import React from 'react';
import { RefreshControl as RN_RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from 'components/context';

const RefreshControl = props => {
  const { refreshing, onRefresh } = props;
  const { colors } = useTheme();

  return (
    <RN_RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
    />
  );
};

RefreshControl.defaultProps = {
  onRefresh: () => {},
  refreshing: false,
};

RefreshControl.propTypes = {
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
};

export default RefreshControl;
