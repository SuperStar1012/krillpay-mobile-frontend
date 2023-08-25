import React from 'react';
import { RefreshControl } from 'react-native';

import TierRequirements from '../components/TierRequirements';
import TierLimitsList from '../../settings/components/TierLimitsList';
import { View, EmptyListMessage } from 'components';
import FormLayout from 'components/layout/Form';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useRehive } from 'hooks/rehive';
import { useSelector } from 'react-redux';
import { currenciesSelector } from 'screens/accounts/redux/reducer';
import { getActiveTier } from 'utility/general';

import Tabs from 'components/layout/TopTabs';
import IncreaseKycLimitCard from '../components/IncreaseKycLimitCard';

function Requirements(props) {
  const { loading, handleRefresh, items, requirementProps } = props;
  return (
    <View h={200} scrollView>
      <View pb={2} ph={1.5}>
        {items?.length > 0 ? (
          items.map(tier => (
            <TierRequirements
              key={tier.level}
              item={tier}
              items={items}
              {...requirementProps}
            />
          ))
        ) : !loading ? (
          <EmptyListMessage id="tier_requirements" />
        ) : null}
      </View>
    </View>
  );
}

function Limits(props) {
  const { loading, tierItem, handleRefresh, currencies } = props;
  return (
    <View
      scrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }>
      <View pb={2} f={1} ph={1.5}>
        <TierLimitsList currencies={currencies} items={tierItem?.limits} />
      </View>
    </View>
  );
}

export default function TierRequirementsPage(props) {
  const {
    context: { user, init, tiers },
  } = useRehiveContext();
  const currencies = useSelector(currenciesSelector);

  const { context = {}, refresh } = useRehive(
    ['documents', 'address', 'bankAccounts'],
    init,
    { user },
  );
  const { address, documents, bankAccounts } = context;
  const { items, loading } = tiers;

  const requirementProps = {
    profile: user,
    addresses: address,
    documents,
    bankAccounts,
  };

  const tierItem = getActiveTier(tiers);

  function handleRefresh() {
    refresh();
    // refreshUser();
  }

  const tabItems = [
    {
      key: 'requirements',
      title: 'requirements',
      component: Requirements,
      props: { loading, handleRefresh, items, requirementProps },
    },
    {
      key: 'limits',
      title: 'limits',
      component: Limits,
      props: { loading, tierItem, handleRefresh, currencies },
    },
  ];

  const contentViewProps = { f: 1 };

  return (
    <View screen>
      <FormLayout
        noPadding
        {...props}
        contentViewProps={contentViewProps}
        scrollView={false}
        config={{
          title: 'tier_requirements',
          image: 'tier' + (tierItem?.level ?? '').toString(),
        }}>
        <View f={1}>
          <IncreaseKycLimitCard mt={-0.5} />
          <Tabs routes={tabItems} />
        </View>
      </FormLayout>
    </View>
  );
}
