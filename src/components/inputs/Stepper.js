import React from 'react';
import { Text, View, Button, Spinner } from '..';
import { Icon } from '../outputs/Icon';

export default function Stepper(props) {
  const { value, setValue, loading, ...otherProps } = props;
  function handlePositive() {
    setValue(parseInt(value) + 1);
  }
  function handleNegative() {
    if (parseInt(value) >= 1) {
      setValue(parseInt(value) - 1);
    }
  }

  return (
    <View fD={'column'} jC={'center'} aI={'center'} {...otherProps}>
      {loading ? (
        <Spinner size="small" />
      ) : (
        <>
          <Button onPress={handlePositive}>
            <Icon size={24} name={'ios-add-circle-outline'} color={'grey3'} />
          </Button>
          <View pv={0.25}>
            <Text c="primary" fW="700" s={25}>
              {value}
            </Text>
          </View>
          <Button onPress={handleNegative}>
            <Icon
              size={24}
              name={'ios-remove-circle-outline'}
              color={'grey3'}
            />
          </Button>
        </>
      )}
    </View>
  );
}
