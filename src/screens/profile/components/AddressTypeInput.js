import React from 'react';
import RadioSelector from 'components/inputs/RadioSelector';
import { standardizeString } from 'utility/general';
import addressesConfig from '../config/addresses';
import CheckboxList from 'components/inputs/CheckboxList';
import { View } from 'components';

const AddressTypeInput = props => {
  const { value, values, editing, setFieldValue, profileConfig } = props;
  let addressTypes = profileConfig?.addressTypes?.length
    ? profileConfig.addressTypes
    : ['permanent'];

  let items = addressTypes.map(item => {
    return { value: item, label: item };
  });

  if (editing) {
    return (
      <RadioSelector
        title="address_type"
        responsive
        items={items}
        value={value}
        handleChange={value => setFieldValue('type', value)}
      />
    );
  }

  items = items.map(item => {
    return {
      ...item,
      checked: values.findIndex(value => value === item.value) !== -1,
    };
  });
  return (
    <View pt={1}>
      <CheckboxList
        items={items}
        setValue={(name, value) => {
          if (value) {
            setFieldValue('types', values.concat([name]));
          } else {
            setFieldValue(
              'types',
              values.filter(item => item !== name),
            );
          }
        }}
        label={'address_type'}
      />
    </View>
  );
};

export default AddressTypeInput;
