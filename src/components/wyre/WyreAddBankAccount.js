import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'components';
import Image from 'components/images/plaid.svg';
import {
  createWyrePaymentMethod,
  exchangeWyrePublicToken,
  createWyreLinkToken,
  getWyreUser,
} from 'utility/rehive';
import { useToast, useRehiveContext } from 'contexts';
import { useQuery } from 'react-query';
import PlaidLink from './PlaidLink';
import ErrorPage from 'components/page/SuccessPage';

export default function WyreAddBankAccount(props) {
  const {
    context = {},
    onSuccess,
    onBack,
    isOnboardingComplete = true,
    reducedHeight,
  } = props;

  const { data: wyreUserData, isLoading: loadingWyreAccounts } = useQuery(
    [user?.id, 'wyre-user'],
    getWyreUser,
    {
      enabled: !context?.wyreUser,
    },
  );
  const { wyreUser = wyreUserData?.data } = context;

  const id = wyreUser?.item?.id ?? wyreUser?.id ?? '';

  const { showToast } = useToast();
  const {
    context: { user },
    methods: { refreshUser, refreshTier },
  } = useRehiveContext();

  useEffect(() => {
    refreshUser();
  }, []);
  const [state, setState] = useState('');

  const {
    data: linkTokenData,
    isLoading: loadingLinkToken,
    error,
  } = useQuery(['wyre-link-token', id], createWyreLinkToken, {
    enabled: !!id,
    retry: 1,
  });
  const linkToken = linkTokenData?.link_token;

  function handleError(text) {
    showToast({
      variant: 'error',
      id: 'wyre_add_bank_account_error',
      text,
    });
    typeof onBack === 'function' && onBack();
  }

  async function handlePaymentMethodCreate(public_token, account, institution) {
    const data = {
      account_id: account?.id ?? account?._id,
      public_token,
    };
    const exchangeTokenResp = await exchangeWyrePublicToken({
      id,
      data,
    });
    if (exchangeTokenResp?.status === 'success') {
      const data = {
        type: 'LOCAL_TRANSFER',
        processor_token: exchangeTokenResp?.data?.processor_token,
        institution_id: institution?.id,
        institution_name: institution?.name,
      };
      const paymentMethodResp = await createWyrePaymentMethod({
        id,
        data,
      });
      if (paymentMethodResp?.status === 'success') {
        refreshTier();
        setState('');
        typeof onSuccess === 'function'
          ? onSuccess()
          : typeof onBack === 'function' && onBack();
      } else handleError(paymentMethodResp?.message);
    } else handleError(exchangeTokenResp?.message);
  }

  function handlePlaidRedirect() {
    if (!linkToken) {
      const error = user?.metadata?.service_wyre?.account_create_error ?? '';
      showToast({ variant: 'error', text: error });
    } else if (isOnboardingComplete) setState('plaid');
    else showToast({ variant: 'error', id: 'unable_to_skip_onboarding' });
  }

  function handleEvent(event) {
    if (event?.eventName === 'EXIT') handleExit(event);
    else if (event?.publicToken) handleSuccess(event);
    // else console.log('handleEvent -> event', event);
  }
  function handleExit(event) {
    setState('');
  }

  function handleSuccess(event) {
    handlePaymentMethodCreate(
      event?.publicToken,
      event?.metadata?.accounts?.[0],
      event?.metadata?.institution,
    );
  }

  const isLoading = loadingLinkToken || !linkToken || loadingWyreAccounts;

  return (
    <View
      aI="center"
      w="100%"
      pb={1}
      ph={reducedHeight || error ? 0 : 0.5}
      f={1}>
      <React.Fragment>
        {error ? (
          <View w="100%">
            <ErrorPage
              state="fail"
              bC="white"
              hasResultConfig
              result={{ status: 'error', message: 'could_not_connect_to_wyre' }}
              header={ErrorHeader}
              noButtons
              title="something_went_wrong"
            />
          </View>
        ) : (
          <View pv={1} aI="center">
            <Image {...{ width: 80, height: 80 }} />
            <View pv={2}>
              <Text
                options={{ boldColor: 'primary' }}
                tA="center"
                id="plaid_link_bank_account_text"
              />
            </View>
            <Button
              id="continue_to_plaid"
              wide
              onPress={handlePlaidRedirect}
              loading={isLoading}
            />
          </View>
        )}
        <PlaidLink
          linkToken={linkToken}
          onEvent={handleEvent}
          onExit={handleExit}
          onSuccess={handleSuccess}
          visible={state === 'plaid'}
        />
      </React.Fragment>
    </View>
  );
}

function ErrorHeader() {
  return (
    <View w="100%">
      <Text c="white" id="unable_to_connect_to_wyre" tA="center" />
    </View>
  );
}
