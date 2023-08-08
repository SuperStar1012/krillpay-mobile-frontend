import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

import * as yup from 'yup';
import { View, Button } from 'components';

import { Formik } from 'formik';

import ConfirmPage from 'components/layout/ConfirmPage';
import ResultPage from 'components/layout/ResultPage';

import CurrencySelector from '../../components/CurrencySelector';
import PlaceholderImage from 'components/outputs/CurrencyBadge/CurrencyPlaceholderImage';

export default function TopUpForm(props) {
  const { currency, currencies, actionsConfig } = props;

  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    code: yup.string().required('Code is required'),
  });

  const formInitialValues = {
    code: '',
  };

  async function fetchVoucher(formikProps) {
    const { values } = formikProps;
    const { code } = values;
    setLoading(true);
    setError('');

    setTimeout(function () {
      if (code === '123') {
        setState('confirm');
      } else {
        setError('Unable to find voucher');
      }
      setLoading(false);
    }, 2000);
  }

  const sharedProps = {
    currency,
    fetchVoucher,
    setState,
    setLoading,
    setError,
    error,
    loading,
  };

  function handleCurrencyUpdate(currency, formikProps) {
    formikProps.setFieldValue('currency', currency);
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      isInitialValid={cardPaymentMethods.length && defaultVoucher}
      // enableReinitialize={!loaded}
    >
      {formikProps =>
        result ? (
          <ResultPage
            {...sharedProps}
            formikProps={formikProps}
            handleButtonPress={
              result.status === 'success'
                ? () => {
                    setState('');
                    setResult(null);
                    props.navigation.navigate('CurrencyDetail', {
                      currencyCode: get(currency, ['currency', 'code']),
                      accountRef: get(currency, 'account'),
                    });
                  }
                : () => {
                    setState('');
                    setResult(null);
                  }
            }
            result={result}
            text={
              result.status === 'success'
                ? 'Payment successful'
                : 'Something went wrong'
            }
          />
        ) : state === 'confirm' ? (
          <TopUpConfirm {...sharedProps} formikProps={formikProps} />
        ) : state === 'scan' ? (
          <TopUpScan {...sharedProps} formikProps={formikProps} />
        ) : state === 'input' ? (
          <TopUpInput {...sharedProps} formikProps={formikProps} />
        ) : (
          <View scrollView p={1}>
            <CurrencySelector
              // rates={rates}
              config={actionsConfig}
              action="prepaid"
              item={get(formikProps, ['values', 'currency'])}
              // returnIndex
              items={currencies.data}
              updateItem={item => handleCurrencyUpdate(item, formikProps)}
            />
            <TopUpTypeSelector {...sharedProps} formikProps={formikProps} />
            {/*
          {pinVisible ? (
            <LocalAuthentication
              modal // TODO:
              localAuth={localAuth}
              modalVisible={pinVisible}
              onSuccess={() => {
                this.hidePin();
                this.handleFormSubmit(props);
              }}
              onDismiss={() => this.hidePin()}
            />
          ) : null} */}
          </View>
        )
      }
    </Formik>
  );
}

// function TopUpScan(props) {
//   const { setState, formikProps, fetchVoucher, error, setError } = props;
//   const { setFieldValue } = formikProps;

//   function handleScan(data) {
//     if (data) {
//       fetchVoucher(data);
//       setFieldValue('code', data);
//       setError('');
//       setState('confirm');
//     }
//   }
//   function handleError(err) {
//     console.log('handleError -> err', err);
//     if (err) {
//       setError(err);
//     }
//   }

//   return (
//     <>
//       <PageContent>
//         <QrReader
//           delay={300}
//           onError={handleError}
//           onScan={handleScan}
//           style={{ width: '100%' }}
//         />
//       </PageContent>
//       <ErrorOutput>{error}</ErrorOutput>
//       <PageButtons
//         layout="vertical"
//         items={[
//           {
//             label: 'Input code',
//             variant: 'text',
//             onClick: () => setState('input'),
//           },
//         ]}
//       />
//     </>
//   );
// }

// function TopUpInput(props) {
//   const { setState, formikProps, fetchVoucher, loading, error } = props;

//   return (
//     <form>
//       <PageContent>
//         <Input
//           formikProps={formikProps}
//           field={{
//             name: 'code',
//             label: 'Voucher',
//           }}
//         />
//       </PageContent>
//       <ErrorOutput>{error}</ErrorOutput>

//       <PageButtons
//         layout="vertical"
//         items={[
//           {
//             label: 'Redeem',
//             type: 'submit',
//             onClick: () => fetchVoucher(formikProps),
//             disabled: !formikProps.isValid || loading,
//             loading,
//           },
//           {
//             label: 'Scan QR',
//             variant: 'text',
//             onClick: () => setState('scan'),
//           },
//         ]}
//       />
//     </form>
//   );
// }

// const TopUpConfirm = props => {
//   const { formikProps, setState, currency } = props;
//   const { values } = formikProps;
//   const { code, type } = values;

//   const items = [
//     {
//       id: 'amount',
//       label: 'Top-up amount',
//       value: '10 EUR',
//       // value2: amountConvString,
//       horizontal: true,
//     },
//     {
//       id: 'fee',
//       label: 'Service fee',
//       value: '10 EUR',
//       // value2: amountConvString,
//       horizontal: true,
//     },
//     {
//       id: 'total',
//       label: 'Total amount',
//       value: '10 EUR',
//       // value2: amountConvString,
//       horizontal: true,
//     },
//   ];

//   const sentenceString = '10 EUR (4.5 USD) ';
//   const recipient = 'XYZ voucher';

//   const text = (
//     <>
//       <div style={{ paddingBottom: 16 }}>
//         <Text
//           variant="body1"
//           color="primary"
//           align={'center'}
//           style={{
//             wordBreak: 'break-word',
//           }}>
//           {'You are about to top-up with '}
//           <b>{sentenceString}</b>
//           {' using '}
//           <b>{recipient}</b>
//         </Text>
//       </div>
//       <TopUpVoucher />
//     </>
//   );

//   return (
//     <ConfirmPage
//       onConfirm={() => alert('confirmed')}
//       onBack={() => setState(type)}
//       // handleButtonPress={this.handleButtonPress}
//       action={'Redeem'}
//       text={text}
//       formikProps={props}
//       items={items}
//     />
//   );
// };

// function TopUpVoucher(props) {
//   const company = useSelector(currentCompanySelector);
//   const classes = useStyles();

//   return (
//     <div className={classes.voucher}>
//       <Logo image={company.icon} height={90} />
//       <div className={classes.voucherDetails}>
//         <Text bold className={classes.voucherRow} align="left">
//           Top-up voucher
//         </Text>
//         <div className={classes.voucherRow} style={{ opacity: 0.5 }}>
//           <AddShoppingCartIcon
//             fontSize="small"
//             className={classes.voucherIcon}
//           />
//           <Text>Purchased on 10 Feb</Text>
//         </div>
//         <div className={classes.voucherRow}>
//           <AccessTimeIcon
//             color="error"
//             fontSize="small"
//             className={classes.voucherIcon}
//           />
//           <Text color="error">Expires on 20 Feb</Text>
//         </div>
//       </div>
//     </div>
//   );
// }

function TopUpTypeSelector(props) {
  const { setState, formikProps } = props;
  const { setFieldValue } = formikProps;

  const classes = useStyles();

  function handleSelect(type) {
    setFieldValue('type', type);
    setState(type);
  }

  return (
    <div className={classes.selector}>
      <Button onClick={() => handleSelect('scan')} variant="text">
        <PlaceholderImage name="qr" label="QR code" size={90} />
      </Button>
      <Button onClick={() => handleSelect('input')} variant="text">
        <PoSPlaceholderImage name="pin" size={90} />
      </Button>
    </div>
  );
}

// function ButtonSimple(props) {
//   return (
//     <button
//       style={{
//         borderWidth: 0,
//         cursor: 'pointer',
//         backgroundColor: 'transparent',
//         textAlign: 'left',
//       }}
//       {...props}
//     />
//   );
// }

// const useStyles = makeStyles(theme => ({
//   selector: {
//     width: '100%',
//     display: 'flex',
//     // padding
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   voucher: {
//     display: 'flex',
//     flexDirection: 'row',
//     // alignItems: 'center',
//     paddingBottom: theme.spacing(2),
//   },
//   voucherDetails: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//   },
//   voucherIcon: {
//     marginRight: theme.spacing(1),
//     justifyContent: 'center',
//   },
//   voucherRow: {
//     marginTop: theme.spacing(1),
//     display: 'flex',
//     flexDirection: 'row',
//     // justifyContent: 'center',
//     // alignItems: 'center',
//   },
// }));
