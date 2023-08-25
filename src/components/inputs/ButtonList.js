import React from 'react';
import { View } from '../layout/View';
import { Button } from './Button';

function ButtonList(props) {
  const { items, ...restProps } = props;

  return (
    <View {...restProps}>
      {items.map((item, index) => (
        <View
          key={item.label}
          mb={(items?.[index + 1]?.type ?? '') === 'text' ? 0 : 0.5}>
          <Button
            color="primary"
            wide
            {...item}
            containerStyle={{
              marginBottom: index === items?.length - 1 ? 0 : 8,
            }}
          />
        </View>
      ))}
    </View>
  );
}

export { ButtonList };
export default ButtonList;

/*
TODO:
1. Convert to func component
2. useContext

Tests:
1. Renders with label
2. Renders with children - is this even needed? Safer to use Touchable directly
3. onClick fires off onPress function
*/
