import React from 'react';
import Text from './Text';

const ErrorOutput = ({ children, ...restProps }) => {
  if (!children) {
    return null;
  }
  return <Text c={'error'} tA={'center'} {...restProps} id={children}></Text>;
};

export default ErrorOutput;
