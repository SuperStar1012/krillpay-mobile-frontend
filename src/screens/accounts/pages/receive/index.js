import React, { useState, useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import {
  currenciesSelector,
  conversionRatesSelector,
} from '../../redux/reducer';

import Header from 'components/layout/HeaderNew';
import { View, HeaderButton } from 'components';
import { cryptoSelector } from '@redux/selectors';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import { getCurrencyCode } from '../../util/rates';
import { useRehiveContext, useToast } from 'contexts';
import { getWallet } from 'utility/wallet';
import { useModal } from 'utility/hooks';
import { Formik } from 'formik';

import { checkIfCrypto, checkIfStellar } from '../../util/crypto';
import ReceiveQR from './ReceiveQR';
import ReceiveEdit from './ReceiveEdit';
import ReceiveHelpModal from './ReceiveHelpModal';
import ReceiveUsername from './ReceiveUsername';
import { useForm } from 'react-hook-form';
import { useWyreReceive } from 'extensions/wyre/hooks';

export default function ReceivePage(props) {
  const { navigation, route } = props;
  const {
    context: rehiveContext,
    methods: { refreshUser },
    config: { actionsConfig },
  } = useRehiveContext();

  const { showToast } = useToast();

  const { currency: initialWallet } = route?.params;

  const { user } = rehiveContext;
  const wallets = useSelector(currenciesSelector);
  const rates = useSelector(conversionRatesSelector);
  const crypto = useSelector(cryptoSelector);

  const form = useForm({
    defaultValues: {
      currencyCode: initialWallet?.currency?.code,
      accountRef: initialWallet?.account,
    },
  });

  const { watch, setValue } = form;
  const { currencyCode, accountRef } = watch();
  useEffect(() => {
    setValue('currencyCode', currencyCode);
    setValue('accountRef', accountRef);
  }, [initialWallet?.currency?.code, initialWallet?.account]);

  let config = actionsConfig?.receive?.config ?? {};
  let { initialPage = 'qr' } = config;

  const [formState, setFormState] = useState(initialPage);
  const wallet = getWallet(wallets, accountRef, currencyCode);

  const { wyreReceiveAddress, wyreCurrency } = useWyreReceive(wallet);
  const isStellar = checkIfStellar({ wallet, wyreCurrency });
  const modalProps = useModal();

  let { recipient: recipientConfig = ['email', 'mobile', 'crypto'] } = config;
  if (recipientConfig?.length === 0) {
    recipientConfig = ['email', 'mobile', 'crypto'];
  }

  const isCrypto = useMemo(() => {
    const _isCrypto =
      wyreReceiveAddress ||
      (recipientConfig?.toString().includes('crypto') &&
        checkIfCrypto({ currency: wallet.currency, crypto }));

    modalProps.showModal(
      !!(
        _isCrypto &&
        (wyreReceiveAddress || wallet?.crypto?.match(/TXLM|XLM/))
      ),
    );
    return _isCrypto;
  }, [wallet, wyreReceiveAddress]);

  let recipientType =
    isCrypto && recipientConfig.includes('crypto')
      ? 'crypto'
      : user?.email
      ? 'email'
      : 'mobile';

  const context = {
    ...rehiveContext,
    wallet,
    rates,
    crypto,
    wallets,
    config,
    actionsConfig,
    wyreReceiveAddress,
  };

  const pageProps = {
    refreshUser,
    context,
    form,
    setFormState,
    showToast,
    modalProps,
    isStellar,
  };

  return (
    <View screen>
      <Header
        transparent
        navigation={navigation}
        back
        actions={
          <View fD={'row'} pr={0.5}>
            {formState !== 'qr' ? (
              <HeaderButton
                set={'MaterialCommunityIcons'}
                color="font"
                onPress={() => setFormState('qr')}
                icon={'qrcode'}
              />
            ) : (
              <HeaderButton
                set={'MaterialIcons'}
                color="font"
                onPress={() => setFormState('')}
                icon={'edit'}
              />
            )}
          </View>
        }
        title={'receive_header'}
        context={{ currencyCode: getCurrencyCode(wallet?.currency) }}
      />
      <CompanyStatusBanner />
      <Formik
        enableReinitialize
        initialValues={{
          recipient: '',
          recipientType,
          email: user?.email,
          mobile: user?.mobile,
          amount: '',
          note: '',
          memo: '',
          currency: wallet,
          username: '',
          federationAddress: '',
          stellarTransactionType: 'public',
        }}>
        {formikProps => (
          <View keyboardAvoiding scrollView>
            {formState === 'username' ? (
              <ReceiveUsername {...pageProps} formikProps={formikProps} />
            ) : formState === 'qr' ? (
              <ReceiveQR {...pageProps} formikProps={formikProps} />
            ) : (
              <ReceiveEdit {...pageProps} formikProps={formikProps} />
            )}
          </View>
        )}
      </Formik>
      <ReceiveHelpModal {...pageProps} />
    </View>
  );
}

// const mapStateToProps = state => {
//   return {
//     currencies: currenciesSelector(state),
//     profile: authUserSelector(state),
//     crypto: cryptoSelector(state),
//     rates: conversionRatesSelector(state),
//     services: currentCompanyServicesSelector(state),
//     actionsConfig: configActionsSelector(state),
//   };
// };

// export default connect(mapStateToProps, { fetchCrypto, fetchRates })(
//   ReceiveScreen,
// );
