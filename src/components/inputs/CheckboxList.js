import React from 'react';
import Checkbox from './CheckboxSimple';
import { View } from '../layout/View';
import Text from '../outputs/Text';

const CheckboxList = props => {
  const { items, label, setValue } = props;

  return (
    <View>
      <Text
        s={12}
        tA="left"
        style={{
          color: 'black',
          opacity: 0.7,
        }}
        id={label}></Text>
      {items.map(({ value, label, checked }) => (
        <Checkbox
          label={label}
          name={value}
          key={value}
          value={checked}
          onPress={(name, value) => setValue(name, value)}
        />
      ))}
    </View>
  );
};

export default CheckboxList;
