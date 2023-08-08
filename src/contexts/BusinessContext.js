import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { getBusinesses, getBusinessServiceSettings } from 'utility/rehive';
import { useRehiveContext } from './RehiveContext';
import { arrayToObject } from 'utility/general';
import { checkBusinessGroup } from 'utility/business';

const initialContext = {
  businesses: [],
  business: null,
  refetch: () => {},
  isLoading: true,
  setBusinessId: () => {},
};
const BusinessContext = React.createContext(initialContext);

function useBusinessSettings() {
  const { company, services } = useRehiveContext();
  const hasBusinessService = services?.['Business Service (beta)'];
  const queryBusinessServiceSettings = useQuery(
    ['businessServiceSettings', company?.id],
    getBusinessServiceSettings,
    { enabled: Boolean(hasBusinessService) },
  );

  return queryBusinessServiceSettings;
}

function useIsBusinessGroup() {
  const { user } = useRehiveContext();
  const queryBusinessServiceSettings = useBusinessSettings();

  const userGroup = user?.groups?.[0]?.name ?? 'user';

  const businessServiceSettings = queryBusinessServiceSettings?.data;

  const isBusinessGroup = useMemo(
    () => checkBusinessGroup(businessServiceSettings, userGroup),
    [businessServiceSettings, userGroup],
  );

  return isBusinessGroup;
}

function BusinessProvider({ children }) {
  const { user } = useRehiveContext();
  const [businessId, setBusinessId] = useState('');
  const [refetchInterval, setRefetchInterval] = useState(null);
  const isBusinessGroup = useIsBusinessGroup();

  const { data, isLoading, refetch } = useQuery(
    ['businesses', user?.id],
    async () => getBusinesses(true),
    {
      enabled: !!user?.id && isBusinessGroup,
      refetchInterval,
    },
  );

  const businesses = data?.results ?? [];
  const bussinessById = arrayToObject(businesses, 'id');
  const business = bussinessById?.[businessId] ?? {};

  useEffect(() => {
    if (!businessId && businesses?.length) setBusinessId(businesses?.[0]?.id);
  }, [businesses]);

  useEffect(() => {
    if (!business?.id || business?.status === 'pending')
      setRefetchInterval(5000);
    else setRefetchInterval(null);
  }, [business]);

  const context = {
    businesses,
    bussinessById,
    business,
    item: business,
    refetch,
    refetchBusiness: refetch,
    refetchBusinesses: refetch,
    loading: isLoading || !business?.id,
    setBusinessId,
  };

  return (
    <BusinessContext.Provider value={context}>
      {children}
    </BusinessContext.Provider>
  );
}

function useBusiness() {
  const value = useContext(BusinessContext);
  if (value === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return value;
}

export { BusinessContext, BusinessProvider, useBusiness };
