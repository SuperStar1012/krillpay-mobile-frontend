import React from 'react';
import { View } from './View';
import { Icon } from '../outputs/Icon';
import Text from '../outputs/Text';
import { normalizeFontSize } from 'utility/general';
import { useTheme } from 'contexts/ThemeContext';
import { I18nManager } from 'react-native';

const configs = {
  info: {
    backgroundColor: '#d7eafd',
    label: 'info_prefix',
    icon: 'info',
  },
  error: {
    backgroundColor: '#f9e3e6',
    label: 'alert_prefix',
    icon: 'error',
  },
  warning: {
    backgroundColor: '#FEF1E5',
    label: 'warning_prefix',
    icon: 'warning',
  },
  success: {
    backgroundColor: '#DEF5EC',
    label: 'success_prefix',
    icon: 'check-circle',
  },
};

export default function Info(props) {
  const {
    variant = 'info',
    id,
    children,
    style,
    context,
    ...restProps
  } = props;

  const { colors } = useTheme();
  const config = configs?.[variant] ?? configs.info ?? {};
  const { backgroundColor, icon, label } = config;
  return (
    <View
      bR={10}
      bC={backgroundColor}
      m={1}
      mv={0.25}
      p={1}
      fD={'row'}
      aI={children?.length < 20 ? 'center' : 'flex-start'}
      style={{
        border: 1,
        borderColor: colors?.[variant],
        ...style,
      }}
      {...restProps}>
      <View>
        <Icon
          size={normalizeFontSize(20)}
          name={icon}
          set={'MaterialIcons'}
          color={variant}
        />
      </View>
      <View ml={0.5} f={1}>
        <Text
          tA="left"
          style={{ writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }}>
          <Text
            s={17}
            fW={'700'}
            c={variant}
            id={label}
            context={context}
            style={{ writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }}
          />
          <Text s={17} c={variant} id={id} context={context}>
            {children}
          </Text>
        </Text>
      </View>
    </View>
  );
}
