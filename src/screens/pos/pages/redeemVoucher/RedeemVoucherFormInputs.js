import React from 'react';

import { View, ButtonList } from 'components';
import FormikInput from 'components/inputs/FormikInput';

export default function RedeemVoucherFormInputs(props) {
  const { config, formikProps, onSubmit } = props;

  const { fields } = config;

  function onSubmitEditing(fieldId, formikProps) {
    const currentFieldIndex = fields.findIndex(field => field.id === fieldId);
    try {
      if (currentFieldIndex < fields?.length - 1) {
        // passwordFieldRef.focus();
        //TODO:
        // const passwordFieldRef = useRef();
        // const refs = { password: passwordFieldRef };
      } else {
        if (formikProps.isValid) {
          onSubmit(formikProps);
        } else {
          formikProps.validateForm();
        }
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  const actions = [
    {
      id: 'REDEEM',
      loading: formikProps.isSubmitting,
      disabled: formikProps.isSubmitting || !formikProps.isValid,
      onPress: () => onSubmit(formikProps),
    },
  ];

  return (
    <View keyboardAvoiding scrollView f={1}>
      <View mb={0.5} f={1} ph={1}>
        {fields.map((field, index) => (
          <FormikInput
            autoCapitalize={'characters'}
            key={field.id}
            formikProps={formikProps}
            field={field}
            onSubmitEditing={() => onSubmitEditing(field.id, formikProps)}
          />
        ))}
      </View>
      <View keyboardAvoiding scrollView ph={1} f={1}>
        <ButtonList items={actions} />
      </View>
    </View>
  );
}
