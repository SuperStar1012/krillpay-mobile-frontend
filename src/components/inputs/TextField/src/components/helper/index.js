import PropTypes from 'prop-types';
import React from 'react';
import { View, Animated } from 'react-native';

import styles from './styles';
import { useTranslation } from 'react-i18next';

export default function Helper(props) {
  let { children, style, helperWrapperStyle, ...restProps } = props;

  const { t } = useTranslation(['common']);
  const i18nString = t(children);

  return (
    <View style={[styles.container, helperWrapperStyle]}>
      <Animated.Text style={[styles.text, style]} {...restProps}>
        {i18nString ? i18nString : children}
      </Animated.Text>
    </View>
  );
}

Helper.defaultProps = {
  numberOfLines: 1,
};

Helper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
