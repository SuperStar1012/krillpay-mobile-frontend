import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import { pick, groupBy, isString, isEmpty, omit, omitBy } from 'lodash';
import {
  updateProfile,
  setConversionSettings,
  updateAddress,
  createAddress,
  deleteAddress,
} from 'utility/rehive';
import OnboardingContainer from './components/OnboardingContainer';
import OnboardingSuccess from './components/OnboardingSuccess';

import { useOnboarding } from 'utility/contexts/onboarding';
import { useRehiveContext } from 'contexts/RehiveContext';
import { updateReduxUser, fetchData, fetchAccounts } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import locales from './config/locales';
import { LanguageProvider } from 'contexts/LanguageContext';

export default function Onboarding(props) {
  const { navigation } = props;

  const {
    data: { userConfig, userAddresses, documents },
    methods: { fetch, refetchPaymentMethods },
  } = useOnboarding();
  let { sections = [], completedSections, isOnboardingComplete } = userConfig;

  let [currentSection, setCurrentSection] = useState(0);
  const [state, setState] = useState('form');
  useEffect(() => {
    if (sections?.length && completedSections < sections?.length) {
      setCurrentSection(completedSections);
      setState('form');
    } else if (sections?.length > 0 && isOnboardingComplete)
      setState('success');
  }, [completedSections]);
  const [error, setError] = useState(true);

  const {
    context: { user },
    config: { onboardingConfig },
    methods: { refreshUser, refreshTier },
  } = useRehiveContext();
  const dispatch = useDispatch();
  const refreshAccounts = () => dispatch(fetchAccounts());

  useEffect(() => {
    setError(null);
  }, [currentSection]);

  // sections[1].fields[0].existing.callingCode = country?.callingCode?.[0] ?? '';

  let activeSection = sections.length && sections[currentSection];

  async function updateUser(values) {
    let response = { status: 'success' };
    try {
      response.data = await updateProfile(values);
      dispatch(updateReduxUser(response.data));

      // updateUserAction({ data: response.data });
    } catch (error) {
      response = error;
      response.status = 'error';
    }

    return response;
  }

  async function updateBasicInfo(values) {
    let response = { status: 'success' };
    const { nationality = '' } = values;

    let data = {
      ...values,
    };
    if (nationality) {
      data.nationality = nationality?.cca2 ?? nationality ?? '';
      const display_currency = nationality?.currency?.[0];

      if (display_currency) {
        await setConversionSettings({
          display_currency,
        });
        refreshAccounts();
      }
    }

    response = await updateUser(data);

    return response;
  }

  async function updateUserAddresses(values) {
    let response = { status: 'success', errors: [] };
    for (let [key, value] of Object.entries(values)) {
      if (isString(value)) continue;

      let filledFields = omitBy(
        omit(value, ['created', 'id', 'status', 'updated', 'type']),
        x => !x,
      );

      if (isEmpty(filledFields)) continue;

      try {
        let existing = userAddresses.find(item => item.type === key);
        value = { ...value, country: value?.country?.cca2 ?? value?.country };

        if (!existing && value) {
          await createAddress({ type: key, ...value });
        } else if (existing) {
          if (value) {
            await updateAddress({ id: existing?.id, ...value });
          } else {
            await deleteAddress(existing?.id);
          }
        }
        fetch({ section: 'address' });
      } catch (error) {
        response.errors.push(error.message);
      }
    }
    return response;
  }

  // async function saveBankDetails(values) {
  //   let response = { status: 'success', message: '' };

  //   try {
  //     let filtered_values = { ...values };

  //     if (!values.branch_address || typeof values.branch_address === 'string')
  //       delete filtered_values.branch_address;

  //     const resp = await updateItem('bank_account', filtered_values);

  //     const { currencies: newCurrencies } = values;
  //     response.data = resp;

  //     const oldCurrencies = resp.currencies.map(item => item.code);
  //     const toAdd = difference(newCurrencies, oldCurrencies);
  //     let i = 0;
  //     for (i = 0; i < toAdd.length; i++) {
  //       await addBankAccountCurrency(resp.id, toAdd[i]);
  //     }
  //     const toRemove = difference(oldCurrencies, newCurrencies);
  //     for (i = 0; i < toRemove.length; i++) {
  //       await deleteBankAccountCurrency(resp.id, toRemove[i]);
  //     }

  //     const resp2 = await getBankAccount(resp?.id);
  //     response.data = resp2;
  //   } catch (error) {
  //     response.status = 'error';
  //     response.message = error.message;
  //   }

  //   return response;
  // }

  async function handleSubmit(values, { setSubmitting }) {
    let resp = {};

    switch (activeSection?.id) {
      case 'central_bank_number':
      case 'basic_info':
        resp = await updateBasicInfo(values);
        break;
      case 'address':
        resp = await updateUserAddresses({ permanent: values });
        break;
      case 'identity':
      case 'address_verification':
        await updateUser(omit(values, ['documents']));
        resp = { status: 'success' };
        break;
      case 'finances':
        resp = { status: 'success' };
        break;
      case 'verify_mobile':
        refreshUser();
        refreshTier();
        resp = { status: 'success' };
        break;
      case 'wyre':
        refetchPaymentMethods();
        resp = { status: 'success' };
        break;
      default:
        resp = await updateUser(values);
        break;
    }

    if (resp && resp.status === 'success') {
      if (currentSection + 1 < sections.length)
        setCurrentSection(++currentSection);
      else {
        const completed = sections.filter(x => x.completed)?.length;
        if (completed === sections?.length) setState('success');
        // else navigation.navigate('Tabs', { screen: 'Home' });
      }
    } else {
      setError((resp && resp.message) || 'Unable to update user profile');
    }

    setSubmitting(false);
  }

  function mapInitialValues(sectionId) {
    switch (sectionId) {
      case 'basic_info':
        return {
          ...pick(user, [
            'first_name',
            'last_name',
            'id_number',
            'birth_date',
            'nationality',
            'gender',
            'mothers_name',
            'fathers_name',
            'marital_status',
            'title',
            'grandfathers_name',
            'grandmothers_name',
          ]),
        };
      case 'central_bank_number':
        return pick(user, ['central_bank_number']);
      case 'profile_pic':
        return pick(user, ['profile']);
      case 'verify_mobile':
        return pick(user, ['mobile', 'verification']);
      case 'identity':
      case 'finances':
      case 'address_verification':
        return {
          documents: groupBy(
            documents?.map(doc =>
              pick(doc, ['document_type', 'file', 'status', 'created']),
            ) ?? '',
            'document_type',
          ),
          id_number: user?.id_number,
          expiry_date: '',
          issuance_date: '',
        };
      case 'address':
        return {
          country: user?.nationality ?? 'US',
          ...(userAddresses?.find(x => x.type === 'permanent') ?? {}),
        };
      // return Object.assign(
      //   {},
      //   ...userAddresses.map(address => {
      //     return {
      //       [address.type]: [
      //         address.line_1,
      //         address.line_2,
      //         address.city,
      //         address.state_province,
      //         address.country,
      //         address.postal_code,
      //       ]
      //         .filter(x => x)
      //         .join(', '),
      //     };
      //   }),
      // );
      // case 'banking':
      //   const bank_acc_copy = {
      //     ...bankAccounts,
      //     currencies: bankAccounts?.currencies?.map(item => item.code),
      //     branch_address: [
      //       bankAccounts?.branch_address?.line_1,
      //       bankAccounts?.branch_address?.line_2,
      //       bankAccounts?.branch_address?.city,
      //       bankAccounts?.branch_address?.state_province,
      //       bankAccounts?.branch_address?.country,
      //       bankAccounts?.branch_address?.postal_code,
      //     ]
      //       .filter(x => x)
      //       .join(', '),
      //   };
      //   if (!bank_acc_copy.name) bank_acc_copy.name = '';
      //   return bank_acc_copy;
      default:
        return { ...user };
    }
  }

  return (
    <LanguageProvider localLocales={locales} configLocales={onboardingConfig}>
      <View screen hC="header">
        {state === 'form' ? (
          <OnboardingContainer
            {...userConfig}
            {...{
              navigation,
              activeSection,
              currentSection,
              setCurrentSection,
              initialValueMapper: mapInitialValues,
              handleSubmit,
            }}
          />
        ) : (
          <OnboardingSuccess {...{ navigation }} />
        )}
      </View>
    </LanguageProvider>
  );
}
