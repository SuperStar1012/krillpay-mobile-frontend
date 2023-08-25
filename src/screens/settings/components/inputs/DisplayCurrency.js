import React from 'react';
import { Formik } from 'formik';
import { Keyboard } from 'react-native';

import { View, Spinner, Button } from 'components';
import { setConversionSettings } from 'utility/rehive';
import { ComposedInputDropdown } from 'components/inputs/ComposedInputDropdown';
import { getCurrencyCode } from 'utility/rates';
import { useRehive } from 'hooks/rehive';
import { useRehiveContext, useRehiveMethods } from 'contexts/RehiveContext';
import { useTheme } from 'contexts/ThemeContext';
import { useToast } from 'contexts/ToastContext';
import { displayCurrencySelector } from 'screens/accounts/redux/reducer';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts, fetchRates } from 'screens/accounts/redux/actions';
import { useTranslation } from 'react-i18next';

export default function DisplayCurrencyInput(props) {
  const { navigation } = props;
  const {
    context: { user, init, services },
  } = useRehiveContext();
  const displayCurrency = useSelector(displayCurrencySelector);
  const dispatch = useDispatch();
  const refreshRates = code => dispatch(fetchRates(code));
  const { context } = useRehive(['conversionCurrencies'], init, { user });

  const { conversionCurrencies = {} } = context;
  const { loading } = conversionCurrencies;

  const { colors } = useTheme();

  const { showToast } = useToast();

  async function handleSubmit(formikProps, item, data) {
    const value = formikProps.values?.currency;
    try {
      formikProps.setSubmitting(true);
      let display_currency = '';
      if (item) {
        display_currency = item.value;
      } else {
        const search = value.toLowerCase();
        const temp = data?.find(item =>
          getCurrencyCode(item)?.toLowerCase().includes(search),
        );
        display_currency = temp?.value;
      }
      if (!display_currency) display_currency = value;

      if (display_currency) {
        const resp = await setConversionSettings({ display_currency });
        if (resp.status === 'success') {
          refreshRates(resp?.data?.display_currency);
          showToast({
            text: 'Display currency successfully set to ' + display_currency,
            variant: 'success',
          });
          navigation.goBack();
        } else {
          formikProps.setFieldError(
            'currency',
            'Unable to update display currency',
          );
        }
      } else {
        formikProps.setFieldError(
          'currency',
          'Unable to update display currency',
        );
      }

      formikProps.setSubmitting(false);
    } catch (e) {
      console.log('TCL: CryptoAddressesScreen -> handleSubmit -> e', e);
    }
  }

  function sections(formikProps, items) {
    const data = items.filter(item =>
      item.label
        ?.toLowerCase()
        .includes(formikProps.values?.currency?.toLowerCase()),
    );

    return [
      {
        title: '',
        data,
        listItemTitle: item => item?.label,
        listItemOnPress: item => {
          Keyboard.dismiss();
          formikProps.setFieldValue('currency', item.value);
          formikProps.setFieldValue('selected', true);
        },
      },
    ];
  }

  // const { colors } = useTheme();
  // const { displayCurrency, colors } = this.props;

  const formatValue = item => getCurrencyCode(item) + ': ' + item.description;
  const items = conversionCurrencies
    ? conversionCurrencies?.items?.map(item => {
        return {
          label: formatValue(item),
          value: item.code,
          id: item.code,
        };
      })
    : [];

  const { t } = useTranslation();
  const label = t('displayCurrency');

  return (
    <Formik
      initialValues={{ currency: displayCurrency.code, selected: false }}
      onSubmit={(values, formikBag) => handleSubmit(values, formikBag)}>
      {formikProps => (
        <React.Fragment>
          <View>
            {loading ? (
              <Spinner />
            ) : (
              <View>
                <ComposedInputDropdown
                  noTitle
                  noImage
                  label={label}
                  placeholder={'e.g. USD'}
                  value={formikProps.values.currency}
                  onChangeText={value =>
                    formikProps.setFieldValue('currency', value)
                  }
                  onBlur={() => formikProps.setFieldTouched('currency')}
                  containerBackgroundColor={'white'}
                  tintColor={colors.primary}
                  // onSubmitEditing={() => () =>
                  // formikProps.setFieldValue('currency', value)}
                  returnKeyType={'done'}
                  autoFocus
                  error={formikProps.errors.currency}
                  autoCapitalize={'none'}
                  sections={sections(formikProps, items)}
                />
              </View>
            )}
            <View mt={1}>
              <Button
                color={'primary'}
                onPress={() => handleSubmit(formikProps, null, items)}
                id="save"
                loading={formikProps.isSubmitting}
                wide
                disabled={
                  !formikProps.values.selected || formikProps.isSubmitting
                }
              />
            </View>
          </View>
        </React.Fragment>
      )}
    </Formik>
  );
}
