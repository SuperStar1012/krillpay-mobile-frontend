import React from 'react';

import { View, CustomIcon } from 'components';
import { I18nManager } from 'react-native';

export default function BurgerIcon(props) {
  return (
    <View
      style={{
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        justifyContent: 'flex-end',
      }}>
      <CustomIcon
        name={'burger'}
        size={14}
        color="#434343"
        width={32}
        contained={false}
        {...props}
      />
    </View>
  );
}
