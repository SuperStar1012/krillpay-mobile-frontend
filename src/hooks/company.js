import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useQuery } from 'react-query';
import Constants from 'expo-constants';
import { getPublicCompany, getPublicWalletCompany } from 'utility/rehive';
import client from 'config/client';

const GRAY_LABEL_APPS = [
  'com.rehive.wallet',
  'com.rehivewallet',
  'com.rehive.wallet-staging',
  'com.rehivewallet_staging',
];

export function useCompanyFetch() {
  const [companyData, setCompanyData] = useState(null);
  const [companyNotFound, setCompanyNotFound] = useState(false);
  const isAndroid = Platform.OS === 'android';

  // clientjs to override loading white-label data from server
  // TODO: move bitrefill to app config
  if (client.company) {
    return {
      companyData: {
        ...client
      },
    }
  }


  const bundleId = isAndroid
    ? Constants.manifest?.android?.package // || Constants.manifest2?.extra?.expoClient?.android?.package 
    : Constants.manifest?.ios?.bundleIdentifier // || Constants.manifest2?.extra?.expoClient?.ios?.bundleIdentifier;

  const isGrayLabelApp = GRAY_LABEL_APPS.includes(bundleId) || !bundleId;

  useEffect(() => {
    if (isGrayLabelApp) {
      setCompanyData({
        company: '',
        bitrefill: false,
      });
    }
  }, [isGrayLabelApp]);

  const { data: publicWalletCompanyData } = useQuery(
    ['publicWalletCompany', bundleId],
    () => getPublicWalletCompany(bundleId, isAndroid),
    {
      enabled: !isGrayLabelApp,
      retry: 1,
      onError: error => setCompanyNotFound(true),
    },
  );

  const companyId = publicWalletCompanyData?.id;

  useQuery(['publicCompany', companyId], () => getPublicCompany(companyId), {
    enabled: Boolean(companyId),
    retry: 1,
    onSuccess: data =>
      setCompanyData({
        company: companyId,
        ...publicWalletCompanyData,
        ...data?.data,
      }),
    onError: error => setCompanyNotFound(true),
  });

  return {
    companyData,
    companyNotFound,
    isCompanyLoading: !companyData && !companyNotFound,
  };
}