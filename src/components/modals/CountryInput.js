import React from 'react';

import { Text as RNText, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import Text from '../outputs/Text';
import { Icon } from '../outputs/Icon';
import { useModal } from 'utility/hooks';
import { Button } from 'components/inputs/Button';
import { useRehiveContext } from 'contexts';

export default function CountryInput(props) {
  const { value, setValue, error, required, onBlur, label = 'country' } = props;

  const {
    context: { company },
  } = useRehiveContext();

  function handleSelect(item) {
    setValue(item);
    typeof onBlur === 'function' && onBlur();
  }

  const countryCode = value?.cca2 ?? value ?? '';

  const { showModal, hideModal, modalVisible } = useModal();

  function handleClose() {
    typeof onBlur === 'function' && onBlur();
    hideModal();
  }
  const countryCodes = company?.settings?.nationalities ?? [];

  const wyreProps = countryCodes?.length
    ? { withAlphaFilter: false, countryCodes }
    : { withAlphaFilter: true };

  return (
    <View>
      <View
        style={{
          flex: 1,
          marginBottom: 8,
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: error ? 'rgb(213, 0, 0)' : 'rgba(0, 0, 0, .15)',
          paddingBottom: countryCode ? 1 : 8,
          alignItems: 'flex-end',
        }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              s={12}
              lH={12}
              c={error ? 'rgb(213, 0, 0)' : 'fontLight'}
              style={{
                paddingBottom: countryCode ? 2 : 8,
                paddingTop: 8,
              }}
              id={label}
            />
            {required && (
              <Text style={{ paddingTop: 4, color: '#FF4C6F' }}> *</Text>
            )}
          </View>
          <CountryPicker
            placeholder={<Text s={18} id="select_country" />}
            countryCode={countryCode}
            withCountryNameButton
            {...wyreProps}
            flatListProps={{
              style: { marginHorizontal: 16, paddingRight: 8 },
            }}
            withFilter
            withFlag
            withModal
            onSelect={handleSelect}
            {...{
              modalProps: {
                visible: modalVisible,
              },
              onClose: handleClose,
              onOpen: showModal,
            }}
          />
        </View>
        <Button onPress={() => showModal(true)}>
          <Icon
            name="chevron-down"
            size={20}
            color={'grey3'}
            style={{ paddingBottom: 4 }}
          />
        </Button>
      </View>
      {!!error && (
        <RNText
          style={{
            color: 'rgb(213, 0, 0)',
            fontSize: 12,
            lineHeight: 12,
            marginTop: -2,
          }}>
          {error}
        </RNText>
      )}
    </View>
  );
}
