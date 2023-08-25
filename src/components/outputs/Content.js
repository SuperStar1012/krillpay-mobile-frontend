import React from 'react';
import PropTypes from 'prop-types';
import context from '../context';
import { View } from '../layout/View';
import Text from './Text';

const _Content = props => {
  const { children, text, type, containerStyle, textStyle } = props;
  const color = type === 'error' ? 'error' : 'font';

  return (
    <View aI={'flex-start'} style={containerStyle}>
      <Text c={color} t={'b2'} lh={22} style={textStyle}>
        {text ? text : children}
      </Text>
    </View>
  );
};

_Content.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  onPress: PropTypes.func,
  textStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

_Content.defaultProps = {
  text: '',
  type: '',
  onPress: () => {},
  textStyle: null,
  containerStyle: null,
};

const Content = context(_Content);

export { Content };

/*
TODO:
1. can this be replaced with just Text and padding from else where?
2. Otherwise, simplify


*/
// TODO: can this be replaced with just Text and padding from else where
