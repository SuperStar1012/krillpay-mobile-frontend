import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ContactsList from 'screens/accounts/pages/contacts';
import { EmptyListMessage } from 'components';
import Tabs from 'components/layout/TopTabs';
import { getRecipientType } from 'screens/accounts/util/validation';
import { useToast } from 'contexts/ToastContext';
import { addCountryCode } from 'utility/general';
import { Formik } from 'formik';

import { TabView, SceneMap } from 'react-native-tab-view';

import CountryInput from 'components/modals/CountryInput';

export default function RecipientStepType(props) {
  const { form, onNext, context } = props;
  const { wallet, user, wyreCurrency } = context;
  const { setValue } = form;
  const { showToast } = useToast();

  const wyreCrypto = wyreCurrency?.wyre_currency_code_for_deposit;

  const [activeTab, setActiveTab] = useState(0);

  const handleTabPress = tabIndex => {
    setActiveTab(tabIndex);
  };

  function onSelect({ contact, type }) {
    const isMobile = type === 'mobile';
    let validatedType = getRecipientType(contact, wallet, wyreCrypto);
    let recipient = contact;
    if (isMobile && validatedType !== 'mobile') {
      recipient = addCountryCode(recipient, user?.nationality);
      validatedType = getRecipientType(recipient);
    }

    if (!validatedType) {
      showToast({
        text:
          'Invalid recipient' +
          (isMobile &&
            ' - please include or select the correct country code, eg. +1'),
        variant: 'error',
      });
    } else {
      setValue('recipient', recipient);
      setValue('contact', contact);
      setValue('type', type);
      onNext();
    }
  }

  //return  <ContactsList {...props} onSelect={onSelect} />;

  // return (
  //       <View>
  //         <Tabs routes={tabItem} />
  //       </View>
  // );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 16,
        }}>
        <TouchableOpacity onPress={() => handleTabPress(0)}>
          <Text style={{ fontWeight: activeTab === 0 ? 'bold' : 'normal' }}>
            KrillPay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(1)}>
          <Text style={{ fontWeight: activeTab === 1 ? 'bold' : 'normal' }}>
            Non-KrillPay
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 0 && <ContactsList {...props} onSelect={onSelect} />}
      {activeTab === 1 && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: activeTab === 1 ? 'bold' : 'normal' }}>
            {JSON.stringify(props)}
          </Text>
        </View>
      )}
    </View>
  );
}
