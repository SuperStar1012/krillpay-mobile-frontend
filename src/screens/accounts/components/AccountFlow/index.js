import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { getWallet } from 'utility/wallet';

import { useRehiveContext } from 'contexts/RehiveContext';
import SuccessPage from 'components/page/SuccessPage';
import ErrorPage from 'components/page/ErrorPage';
import AmountStep from './AmountStep';
import NoteStep from './NoteStep';
import RecipientStep from './RecipientStep';
import RecipientStepType from './RecipientStepType';
import { useMachine } from '@xstate/react';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import HeaderNew from 'components/layout/HeaderNew';
import {
  conversionRatesSelector,
  currenciesSelector,
} from 'screens/accounts/redux/reducer';
import {
  View,
  HeaderButton,
  LocalAuthentication,
  Text,
  Spinner,
} from 'components';
import TierBlockerModal from './TierBlockerModal';
import MetadataStep from './MetadataStep';
import { useLocalAuth } from 'contexts/LocalAuthContext';
import { useToast } from 'contexts/ToastContext';
import { cryptoSelector } from '@redux/selectors';
import HelpModal from './HelpModal';
import { useModal } from 'utility/hooks';
import { fetchAccounts } from 'screens/accounts/redux/actions';
import ConfirmPage from 'components/page/ConfirmPage';
import { useConversionTimer } from 'screens/accounts/hooks/conversion';

import {
  handleConversionQuoteCreate,
  checkBlocked,
} from 'screens/accounts/util/accounts';

import { Machine } from 'xstate';
import { Icon } from 'components/outputs/Icon';
import { Pressable } from 'react-native';
import { useWyreCurrency } from 'extensions/wyre/hooks';

const components = {
  amount: AmountStep,
  note: NoteStep,
  recipient: RecipientStepType,
  // recipient: RecipientStep,
  metadata: MetadataStep,
};

// function mapDefaultValues(navigation){
//   const params = navigation?.state??{};
//   const { currency, amount = '', recipient = '' } = params;

//   return {
//     amount,
//     recipient,
//     currencyCode: currency?.currency?.code,
//     accountRef: currency?.account,
//     memoSkip: '',
//     stellarTransactionType: 'public',
//     pinVisible: false,
//   }
// }

export default function AccountFlow(props) {
  const {
    navigation,
    config = {},
    context: propsContext = {},
    refresh,
    route,
  } = props;
  const { onSubmit, configs, id, initialFilters = {} } = config;
  const machine = Machine(config.machine);
  const [state, send] = useMachine(machine);

  const {
    user,
    context: rehiveContext,
    config: { pinConfig, actionsConfig, accountsConfig },
  } = useRehiveContext();
  const wallets = useSelector(currenciesSelector);
  const dispatch = useDispatch();
  const rates = useSelector(conversionRatesSelector);
  const crypto = useSelector(cryptoSelector);
  const queryClient = useQueryClient();

  const localAuth = useLocalAuth();

  const defaultValues = {
    editedMobile: false,
    // display:
    //   (accountsConfig?.amountDisplayCurrency && !config?.defaultValues?.amount
    //     ? true
    //     : false) ?? false,
    display: false,
    amountDisplay: '',
    ...config?.defaultValues,
  };

  const form = useForm({
    defaultValues,
  });
  const { watch } = form;
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [localAuthVisible, setLocalAuthVisible] = useState(false);
  const [conversionBlock, setConversionBlock] = useState(null);

  const {
    accountRef,
    currencyCode,
    toCurrency,
    fromWallet,
    toWallet,
    conversionQuote,
  } = watch();
  const wallet = getWallet(wallets, accountRef, currencyCode);

  const { data: wyreCurrency } = useWyreCurrency(wallet);
  if (!wallet) return null; //TODO: error message / go back

  const actionConfig = actionsConfig?.[id];

  const context = {
    ...rehiveContext,
    ...propsContext,
    wyreCurrency,
    accountsConfig,
    wallets,
    actionsConfig,
    actionConfig,
    currencies: wallets,
    wallet,
    rates,
    crypto,
  };

  function handleSuccess() {
    navigation.goBack();
  }

  function refreshAccounts() {
    queryClient.invalidateQueries([user?.id, 'transactions'], { exact: false });
    dispatch(fetchAccounts());
  }
  async function handleSubmit() {
    try {
      const result = await onSubmit({
        wallet,
        form,
        setSubmitting,
        submitting,
        context,
      });
      setResult(result);
      if (
        result?.status === 'Pending' &&
        machine.states?.[state.value]?.handles('PENDING') &&
        !result?.partner?.user?.temporary
      ) {
        send('PENDING');
      } else {
        send('SUCCESS');
        refreshAccounts();
      }
    } catch (error) {
      console.log('handleSubmit -> error', error);
      let { data, message } = error;
      if (
        message?.includes('above the maximum') ||
        message?.includes('exceeds')
      ) {
        send('LIMIT');
      } else if (data && (data.credit_subtype || data.debit_subtype)) {
        message =
          'This transaction flow is not supported by this company(Account Flow Error)';
      }
      setResult({ ...error, message });
      send('FAIL');
    }
  }

  async function localAuthSuccess() {
    setLocalAuthVisible(false);
    await handleSubmit();
    setSubmitting(false);
  }
  const convCurrency = toWallet?.currency
    ? toWallet?.currency
    : fromWallet?.currency
    ? fromWallet?.currency
    : toCurrency;

  async function handleNext() {
    // If the sendPage is part of the withdraw amount flow, navigate to Review Transaction screen

    if (state.matches('amount') && route?.params.isWithDraw) {
      navigation.navigate('Review_Transaction', {
        ...route.params,
        amount: form.getValues()?.amount,
      });
      return;
    }
    if (state?.done) {
      handleSuccess();
    } else if (state.matches('confirm')) {
      if (pinConfig?.[id] && localAuth?.active) {
        setLocalAuthVisible(true);
      } else {
        localAuthSuccess();
      }
    } else {
      let conversionCheck = null;
      if (
        (id !== 'send' && state.matches('amount')) ||
        state.matches('recipient')
      ) {
        conversionCheck = checkBlocked({
          context,
          stateId: state.value,
          wallet,
          form,
          pageId: id,
          result,
        });
      }
      if (!conversionCheck) {
        send('NEXT');
      } else {
        setConversionBlock(conversionCheck);
      }
    }
  }

  // function handleBack() {
  //   if (state?.done) {
  //     navigation.goBack();
  //   }
  //   send('BACK');
  // }

  const stepConfig = configs?.[state.value];
  const stepComponent = stepConfig?.component ?? components?.[state.value];
  const Component = typeof stepComponent === 'function' ? stepComponent : null;

  const { showToast } = useToast();

  const pageProps = {
    showToast,
    wallet,
    form,
    onNext: handleNext,
    onBack: handleBack,
    setSubmitting,
    submitting,
    context,
    configs,
    config: stepConfig,
    screenConfig: config,
    navigation,
    stateId: state.value,
    setResult,
    result,
    send,
    methods: { refreshAccounts },
    // pageConfig: config,
    pageId: id,
    filters,
    setFilters,
    refresh,
  };

  function handleBack() {
    if (state?.done || !machine.states?.[state.value]?.handles('BACK')) {
      //navigation.goBack();
    }
    //send('BACK');
    navigation.navigate('Tabs');
  }

  const isPostStyle = Boolean(state?.value?.match(/confirm|success|fail/));
  const hasResultConfig =
    Boolean(state?.value?.match(/success|error/)) &&
    typeof configs?.result === 'object';

  const isFail = state.matches('fail');
  const isSuccess = state.matches('success');
  const isConfirm = state.matches('confirm');

  const { remaining, expired } = useConversionTimer(conversionQuote);
  useEffect(() => {
    if (
      isConfirm &&
      convCurrency &&
      convCurrency.code !== currencyCode &&
      (!conversionQuote || expired)
    )
      handleConversionQuoteCreate(pageProps);
  }, [isConfirm]);

  function renderContent() {
    if (isFail) {
      return (
        <ErrorPage
          {...pageProps}
          variant="new"
          state={state.value}
          result={result}
          hasNote={
            pageProps.screenConfig?.id == 'send' ||
            pageProps.screenConfig?.id == 'request'
          }
          hasResultConfig={hasResultConfig}
          {...(hasResultConfig ? configs?.result : configs?.post)}
          // {...stepConfig}
        />
      );
    } else if (isSuccess && typeof configs?.post === 'object') {
      return (
        <SuccessPage
          {...pageProps}
          variant="new"
          state={state.value}
          result={result}
          recipientDetails={recipientDetails}
          hasNote={pageProps.screenConfig?.id == 'send'}
          isRequesting={pageProps.screenConfig?.id == 'request'}
          hasResultConfig={hasResultConfig}
          {...(hasResultConfig ? configs?.result : configs?.post)}
          // {...stepConfig}
        />
      );
    } else if (isConfirm && typeof configs?.post === 'object') {
      if (
        convCurrency &&
        convCurrency?.code !== wallet?.currency?.code &&
        !conversionQuote
      )
        return <Spinner />;
      return (
        <ConfirmPage
          {...pageProps}
          variant="new"
          state={state.value}
          result={result}
          recipientDetails={recipientDetails}
          setRecipientDetails={setRecipientDetails}
          hasNote={
            pageProps.screenConfig?.id == 'send' ||
            pageProps.screenConfig?.id == 'request'
          }
          hasResultConfig={hasResultConfig}
          {...(hasResultConfig ? configs?.result : configs?.post)}
          // {...stepConfig}
        />
      );
    } else if (Component) {
      return <Component {...pageProps} />;
    }
    return null;
  }

  function navigateScan() {
    navigation.navigate('Scan', { currency: wallet });
  }
  const helpModalProps = useModal();

  function showHelp() {
    if (stepConfig?.help?.center)
      navigation.navigate('HelpCenter', stepConfig?.help?.center);
    else helpModalProps.showModal();
  }

  function renderHeader() {
    // const { showHelp, qr } = {};
    return (
      <View fD={'row'} pr={0.5}>
        {/* {showHelp ? (
          <HeaderButton onPress={() => this.modalShow()} icon="help-outline" />
        ) : null} */}
        {!!stepConfig?.scan && (
          <HeaderButton
            onPress={navigateScan}
            color={'fontDark'}
            icon={'camera-alt'}
          />
        )}

        {Boolean(conversionQuote && remaining) && isConfirm && (
          <View style={{ backgroundColor: 'blue' }} pr={1} pt={0.5}>
            <Text tA={'right'} c={'font'} s={22}>
              {remaining}
            </Text>
          </View>
        )}
      </View>
    );
  }

  const menuProps = {
    ...stepConfig,
    filters,
    setFilters,
    handleBack,
    navigation,
  };

  function hideLocalAuth() {
    setLocalAuthVisible(false);
  }

  return (
    <View bC={isPostStyle ? 'background' : 'white'} f={1} keyboardAvoiding>
      <CompanyStatusBanner />
      {!(isFail || isSuccess) ? (
        <HeaderNew
          {...menuProps}
          bC={
            stepConfig?.backgroundColor ?? (isConfirm ? 'background' : 'white')
          }
          actions={renderHeader()}
          ns="accounts"
          // right={showHelp} // TODO: scan
          // renderRight={this.renderHeader()}
        />
      ) : (
        <View />
      )}
      {renderContent()}
      <TierBlockerModal
        {...pageProps}
        navigation={navigation}
        conversionBlock={conversionBlock}
        setConversionBlock={setConversionBlock}
      />
      {helpModalProps?.modalVisible && (
        <HelpModal {...pageProps} {...helpModalProps} navigation={navigation} />
      )}
      {localAuthVisible ? (
        <LocalAuthentication
          modal
          localAuth={localAuth}
          modalVisible={localAuthVisible}
          onSuccess={localAuthSuccess}
          onDismiss={hideLocalAuth}
        />
      ) : null}
    </View>
  );
}

// const accountItems = objectToArray(wallets?.accounts);
// let accountItem =
//   wallets?.accounts?.[accountRef] ??
//   wallets?.accounts?.[wallets?.primaryAccount];

// let restrictedCurrencies =
//   accountsConfig.hideCurrencies &&
//   accountsConfig.hideCurrencies.find(x =>
//     tier?.items?.map(y => y?.level).includes(x?.tier),
//   );

// restrictedCurrencies = restrictedCurrencies?.currencies ?? [];

// const filteredWallets = objectToArray(accountItem?.currencies).filter(
//   item =>
//     !hideCurrency.includes(item?.currency?.code) &&
//     !restrictedCurrencies.includes(item?.currency?.code),
// );
