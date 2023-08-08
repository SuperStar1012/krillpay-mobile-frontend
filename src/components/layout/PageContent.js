import React from 'react';
import { View } from './View';

export default function PageContent(props) {
  let { children, dense, ...restProps } = props;

  return (
    <View ph={1.5} pb={dense ? 0 : 1} {...restProps}>
      {children}
    </View>
  );
}
