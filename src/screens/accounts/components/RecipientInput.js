import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, TextField, Button } from 'components';
import { send } from 'config/inputs';
import { configActionsSelector } from '@redux/rehive/selectors';
import { arrayToPlaceholder } from 'utility/general';
import { useTheme } from 'contexts/ThemeContext';

export default function RecipientInput(props) {
  const { onButtonPress, formikProps, currency, action = 'send' } = props;
  const { colors } = useTheme();

  const {
    values,
    setFieldValue,
    setFieldTouched,
    touched,
    errors,
  } = formikProps;

  const [currentValue, setCurrentValue] = useState();
  const actionsConfig = useSelector(configActionsSelector);

  useEffect(() => validate(), [currency, currentValue]);

  const value = values.recipient;
  const touch = touched.recipient;
  const error = errors.recipient;

  let { label, helper } = { ...send.recipient };

  const recipients = actionsConfig?.[action]?.config?.recipient;

  const placeholderRecipients = recipients.filter(x =>
    currency?.crypto ? x : x !== 'crypto',
  );

  const placeholder = arrayToPlaceholder(placeholderRecipients);

  function validate() {
    if (!currentValue) return;

    const letters = new RegExp('.*[a-zA-Z].*');
    let isSteller =
      recipients.includes('crypto') &&
      currency.crypto &&
      currency.crypto.match(/XLM|TXLM/);

    if (
      currentValue.includes('@') &&
      (!isSteller || (isSteller && !currentValue.includes('*')))
    )
      return setFieldValue('recipientType', 'email');

    if (!letters.test(currentValue))
      return setFieldValue('recipientType', 'mobile');

    if (isSteller && !currentValue.includes('*'))
      setFieldValue('stellarTransactionType', 'public');

    if (currency.crypto && recipients.includes('crypto'))
      return setFieldValue('recipientType', 'crypto');
  }

  function onChangeText(value) {
    setCurrentValue(value);

    setFieldValue('recipient', value);
    setFieldValue('stellarTransactionType', '');
    setFieldValue('recipientType', '');
  }

  return (
    <View fD={'row'} aI={'center'}>
      <View f={1} w={'100%'}>
        <TextField
          helper={helper}
          placeholder={placeholder}
          label={label}
          value={value}
          autoCapitalize={'none'}
          multiline={true}
          tintColor={colors.primary}
          type="email"
          error={touch && error}
          onBlur={() => setFieldTouched('recipient')}
          onChangeText={value => onChangeText(value)}
          // onSubmitEditing={() => onSubmitEditing('recipient', props)}
        />
      </View>
      <Button
        type={'text'}
        icon={'perm-contact-calendar'}
        iconSet={'MaterialIcons'}
        color={'primary'}
        size={'large'}
        containerStyle={{ margin: 0 }}
        buttonStyle={{ paddingHorizontal: 0, paddingLeft: 10, minWidth: 30 }}
        onPress={() => onButtonPress()}
      />
    </View>
  );
}
