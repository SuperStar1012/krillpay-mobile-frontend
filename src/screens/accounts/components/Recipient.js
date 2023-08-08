import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { View, Text } from 'components';
import EmailIcon from '../pages/contacts/Placeholders/email.svg';
import MobileIcon from '../pages/contacts/Placeholders/mobile.svg';
import { CustomIcon } from 'components/outputs/CustomIcon';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { getRecipientType } from '../util/validation';

export default function Recipient(props) {
  const { viewStyleImage } = styles;

  const { value, label = '', wallet } = props;
  const type = getRecipientType(value, wallet);
  const config = {};
  // if (!type) return null;
  let { image = props?.image, width = 37, rightSlot } = config ?? {};

  let height = width;

  return (
    <>
      <View fD={'row'} jC={'space-between'} aI={'center'}>
        <View style={[viewStyleImage]}>
          {image ? (
            <Image
              style={{ height, width, borderRadius: width }}
              source={{
                uri: image,
              }}
              resizeMode={'cover'}
            />
          ) : type === 'email' ? (
            <EmailIcon height={height} width={width} />
          ) : type === 'crypto' ? (
            <View>
              <CurrencyBadge
                inverted
                text={wallet?.currency?.code}
                size={width}
              />
            </View>
          ) : type === 'account' ? (
            <View>
              <CustomIcon name={'default'} size={width} />
            </View>
          ) : type === 'mobile' ? (
            <MobileIcon height={height} width={width} />
          ) : (
            <View>
              <CurrencyBadge
                inverted
                text={value?.substring(0, 2)}
                size={width}
              />
            </View>
          )}
        </View>
        <View jC={'center'} mr={1}>
          {Boolean(label) && (
            <Text s={14} numberOfLines={1} c="primaryContrast">
              {label}
            </Text>
          )}
          {Boolean(value) && (
            <Text s={16} c="primaryContrast" fW="500">
              {value}
            </Text>
          )}
        </View>
        {rightSlot && rightSlot()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  viewStyleImage: {
    marginRight: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
