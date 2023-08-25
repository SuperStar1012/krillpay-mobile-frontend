import React from 'react';
import ContactsList from 'screens/accounts/pages/contacts';
import { getRecipientType } from 'screens/accounts/util/validation';
import { useToast } from 'contexts/ToastContext';
import { addCountryCode } from 'utility/general';

export default function RecipientStep(props) {
  const { form, onNext, context } = props;
  const { wallet, user, wyreCurrency } = context;
  const { setValue } = form;
  const { showToast } = useToast();

  const wyreCrypto = wyreCurrency?.wyre_currency_code_for_deposit;

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

  return <ContactsList {...props} onSelect={onSelect} />;
}
