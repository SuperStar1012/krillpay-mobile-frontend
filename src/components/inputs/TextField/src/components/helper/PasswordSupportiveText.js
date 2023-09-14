import React, { useCallback } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'contexts/ThemeContext';

export const PasswordSupportiveText = ({
  value,
  isError,
  style,
  hideHelper,
}) => {
  const twelveOrMoreIsFulfilled = !hideHelper && /^.{12,}$/.test(value);
  const oneLowerIsFulfilled = !hideHelper && /[a-z]/.test(value);
  const oneUpperIsFulfilled = !hideHelper && /[A-Z]/.test(value);
  const mixtureOfLettersAndNumberIsFulfilled =
    !hideHelper && /[a-zA-Z]+\d+|\d+[a-zA-Z]+/.test(value);
  const oneSplFulfilled = !hideHelper && /[!@#?]/.test(value);
  const fulfilledColor = '#90CDC3';
  const textColor = '#777777';
  const inStyle = style;
  const { colors } = useTheme();

  const { t } = useTranslation(['common']);
  const getSupportiveText = useCallback(({ isFulfilled, id, hideHelper }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {!hideHelper && (
          <MaterialIcons
            name={isFulfilled ? 'check-box' : 'check-box-outline-blank'}
            size={26}
            color={isFulfilled ? colors.primary : colors.font}
          />
        )}
        <Animated.Text
          style={[
            inStyle,
            {
              color: isFulfilled ? fulfilledColor : textColor,
              paddingLeft: 4,
            },
          ]}>
          {t(id)}
        </Animated.Text>
      </View>
    );
  }, []);

  return (
    <View style={{ marginTop: 6 }}>
      {
        <>
          {getSupportiveText({
            id: 'at_least_twelve',
            isFulfilled: twelveOrMoreIsFulfilled,
            hideHelper,
          })}
          {getSupportiveText({
            id: 'mixture_of_upper_Lower',
            isFulfilled: oneLowerIsFulfilled && oneUpperIsFulfilled,
            hideHelper,
          })}
          {getSupportiveText({
            id: 'mixture_of_letters_number',
            isFulfilled: mixtureOfLettersAndNumberIsFulfilled,
            hideHelper,
          })}
          {getSupportiveText({
            id: 'special_letters',
            isFulfilled: oneSplFulfilled,
            hideHelper,
          })}
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 16,
  },
});
