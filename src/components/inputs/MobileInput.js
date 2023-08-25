import React, { useState, useEffect } from 'react';
import { TextField } from './TextField';

import Text from '../outputs/Text';
import { orderBy } from 'lodash';
import { isMobile } from '../../utility/validation';
import Flag from 'react-native-round-flags';
import countryDialCodes from '../../scripts/country_dial_codes.json';
import CountryPicker from 'react-native-country-picker-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'contexts/ThemeContext';
import { View } from 'components/layout/View';

export default function MobileInput(props) {
  let { value, onChangeText } = props;
  const { colors } = useTheme();

  const [countryCode, setCountryCode] = useState();
  const [mobile, setMobile] = useState();
  const [error, setError] = useState();
  const [time, setTime] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => detectCountry(), [mobile]);
  useEffect(() => {
    if (value) setMobile(value?.replace('+', ''));
    else setMobile('1');
  }, [value]);

  function _onChangeText(input) {
    setMobile(input);
    setTime(new Date());
    setError(
      !isMobile(`+${input}`) ? 'Please enter a valid mobile number' : null,
    );
    onChangeText(`+${input}`);
  }

  const diff = error && new Date() - time;

  function detectCountry() {
    let matches = orderBy(
      countryDialCodes.filter(x => `+${mobile}`.includes(x.dial_code)),
      x => x.name,
      ['asc'],
    );
    const match = matches.length
      ? matches.reduce((a, b) =>
          a.dial_code.length > b.dial_code.length ? a : b,
        )
      : null;
    if (!match) return setCountryCode('US');
    setCountryCode(match.code);
  }

  function handleSelect(item) {
    const newPrefix = (item?.callingCode?.[0] ?? '+1')?.replace('+', '') ?? '1';

    const oldPrefix =
      countryDialCodes
        .find(x => x.code === countryCode)
        ?.dial_code?.replace('+', '') ?? '';

    setMobile(mobile ? mobile.replace(oldPrefix, newPrefix) : newPrefix);
    _onChangeText(mobile ? mobile.replace(oldPrefix, newPrefix) : newPrefix);
    setCountryCode(item?.cca2);
  }

  return (
    <TextField
      tintColor={colors.primary}
      type={'mobile_custom'}
      value={mobile}
      shrink
      autoFocus
      label={'mobile_number'}
      onClear={() => onChangeText('')}
      error={diff > 1000 && error}
      onChangeText={input => _onChangeText(input)}
      prefixComponent={
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 2,
            paddingTop: 6,
            // flex: 1,
          }}>
          <CountryPicker
            countryCode={countryCode}
            // preferredCountries={['US', 'ZA']}
            // withEmoji
            withAlphaFilter
            flatListProps={{ style: { marginHorizontal: 16 } }}
            withFilter
            withFlag
            withCallingCode
            onClose={() => setModalVisible(false)}
            onSelect={handleSelect}
            visible={modalVisible}
            renderFlagButton={() => (
              <TouchableOpacity
                activeOpacity={0.67}
                onPress={() => setModalVisible(true)}>
                <Flag
                  code={countryCode}
                  style={{
                    height: 25,
                    width: 25,
                    marginRight: 5,
                    // marginTop: 2,
                  }}
                />
              </TouchableOpacity>
            )}
          />

          <Text lH={19.5} s={18}>
            +
          </Text>
        </View>
      }
    />
  );
}
