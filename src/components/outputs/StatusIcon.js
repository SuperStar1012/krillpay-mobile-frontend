import React from 'react';

import { Icon } from 'components/outputs/Icon';
import { useTheme } from 'contexts/ThemeContext';

export default function StatusIcon(props) {
  const { status, set = 'MaterialIcons', padded, size = 35, icon = '' } = props;
  const { colors } = useTheme();

  const isSuccess = status === 'positive';
  const isNegative = status === 'negative';

  return (
    <Icon
      set={set}
      name={icon}
      size={size - (padded ? 14 : 0)}
      color={isSuccess || isNegative ? 'white' : 'grey4'}
      style={{
        padding: padded ? 7 : 0,
        minWidth: size,
        minHeight: size,
        backgroundColor: isNegative
          ? colors.error
          : isSuccess
          ? '#0DAF2D'
          : '#EFEFEF',
        borderRadius: 100,
      }}></Icon>
  );
}
