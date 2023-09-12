import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';

export const PasswordSupportiveText = ({ value, isError, style }) => {
  const textColor = '#777777';
  const twelveOrMoreIsFulfilled = /^.{12,}$/.test(value);
  const oneLowerIsFulfilled = /[a-z]/.test(value);
  const oneUpperIsFulfilled = /[A-Z]/.test(value);
  const mixtureOfLettersAndNumberIsFulfilled = /[a-zA-Z]+\d+|\d+[a-zA-Z]+/.test(
    value,
  );
  const oneSplFulfilled = /[!@#?]/.test(value);
  const fulfilledColor = '#90CDC3';
  const inStyle = style;
  console.log('In style', inStyle);

  const { t } = useTranslation(['common']);
  //   const i18nString = t(children);

  return (
    <View style={{ marginTop: 6 }}>
      {
        <>
          <Animated.Text
            style={[
              inStyle,
              { color: twelveOrMoreIsFulfilled ? fulfilledColor : textColor },
            ]}>
            {t('at_least_twelve')}
          </Animated.Text>
          <Animated.Text
            style={[
              inStyle,
              {
                color:
                  oneLowerIsFulfilled && oneUpperIsFulfilled
                    ? fulfilledColor
                    : textColor,
              },
            ]}>
            {t('mixture_of_upper_Lower')}
          </Animated.Text>
          <Animated.Text
            style={[
              inStyle,
              {
                color: mixtureOfLettersAndNumberIsFulfilled
                  ? fulfilledColor
                  : textColor,
              },
            ]}>
            {t('mixture_of_letters_number')}
          </Animated.Text>
          <Animated.Text
            style={[
              inStyle,
              { color: oneSplFulfilled ? fulfilledColor : textColor },
            ]}>
            {t('special_letters')}
          </Animated.Text>
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
