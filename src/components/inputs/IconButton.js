import React from 'react';
import { I18nManager } from 'react-native';
import { Button } from './Button';
import { View } from '../layout/View';
import { Icon } from '../outputs/Icon';
import Text from '../outputs/Text';

export default function IconButton(item) {
  const {
    label,
    icon,
    onPress,
    disabled,
    contained = true,
    padded = true,
    padding,
    size = 40,
    altStyle,
    color = 'primary',
    set = 'Custom',
    ...restProps
  } = item;

  return (
    <Button disabled={disabled || !onPress} t={'text'} onPress={onPress} wide>
      <View
        fD="row"
        p={altStyle ? 1 : padded ? 0.5 : 0}
        aI="center"
        {...restProps}>
        <View w={size}>
          <Icon
            set={set}
            contained={contained}
            name={icon}
            size={size}
            padded={padded}
            padding={padding}
            color={color}
          />
        </View>
        {label && (
          <Text
            align={'center'}
            width="auto"
            c={altStyle ? 'font' : color}
            style={{
              [I18nManager.isRTL ? 'paddingRight' : 'paddingLeft']: altStyle
                ? 24
                : 12,
            }}
            variant={'subtitle1'}
            fW={altStyle ? 'bold' : '400'}
            id={label}></Text>
        )}
      </View>
    </Button>
  );
}
