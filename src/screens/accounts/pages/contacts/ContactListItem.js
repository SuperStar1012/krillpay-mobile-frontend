import React from 'react';
import { Image, StyleSheet } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import UserAvatar from 'react-native-user-avatar';
import { View, Text } from 'components';
import EmailIcon from './Placeholders/email.svg';
import MobileIcon from './Placeholders/mobile.svg';

function ContactListItem(props) {
  const { viewStyleImage } = styles;
  let {
    image,
    type,
    title,
    titlePrefix,
    subtitle,
    krilltag,
    nationality,
    width = 45,
    rightSlot,
  } = props;

  let height = width;

  return (
    <View fD={'row'} jC={'space-between'} aI={'center'}>
      <View>
        <View style={[viewStyleImage]}>
          {image ? (
            <Image
              style={{ height, width, borderRadius: width }}
              source={{
                uri: image,
              }}
              resizeMode={'contain'}
            />
          ) : type === 'email' ? (
            <EmailIcon height={height} width={width} />
          ) : (
            <UserAvatar size={45} name={title} />
          )}
        </View>
        {nationality.length > 0 && (
          <CountryFlag
            style={styles.flagIcon}
            isoCode={nationality}
            size={17}
          />
        )}
      </View>
      <View jC={'center'} f={1} mr={1}>
        {Boolean(title) && (
          <Text s={17} fW={'500'} numberOfLines={1}>
            {titlePrefix && <Text s={17}>{titlePrefix} </Text>}
            {title}
          </Text>
        )}
        {Boolean(krilltag) && (
          <Text s={15} numberOfLines={1}>
            {krilltag.startsWith('@') ? krilltag : `@${krilltag}`}
          </Text>
        )}
        {Boolean(subtitle) && (
          <Text s={12} c={'#898989'} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightSlot && rightSlot()}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleImage: {
    marginRight: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  flagIcon: { alignSelf: 'center', marginTop: -10, marginRight: 10 },
});

export default ContactListItem;
