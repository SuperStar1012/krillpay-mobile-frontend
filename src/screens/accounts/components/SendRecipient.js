import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { View, Text } from 'components';
import EmailIcon from '../pages/contacts/Placeholders/email.svg';
import MobileIcon from '../pages/contacts/Placeholders/mobile.svg';
import { CustomIcon } from 'components/outputs/CustomIcon';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import UserAvatar from 'react-native-user-avatar';
import CountryFlag from 'react-native-country-flag';
import { getRecipientType } from '../util/validation';

export default function SendRecipient(props) {
  const { viewStyleImage } = styles;

  const { value, label = '', wallet, recipientDetails, user } = props;
  const {
    nationality,
    contact,
    name,
    titlePrefix,
    username,
    first_name,
    last_name,
    identifier,
  } = recipientDetails ? recipientDetails : user;
  recipientDetails;

  const type = getRecipientType(value, wallet);
  const config = {};

  // if (!type) return null;
  let { image = props?.image, width = 37, rightSlot } = config ?? {};

  let height = width;

  // const styles = StyleSheet.create({
  //   image: {
  //     borderWidth: 3,
  //     borderRadius: 5,
  //     padding: 10,
  //     paddingTop: 20,
  //     paddingBottom: 20,
  //   },
  //   text: {
  //     textAlign: 'center',
  //     textAlignVertical: 'center',
  //     color: '#ffffff',
  //     fontSize: 20,
  //   },
  // });

  return (
    <>
      <View fD={'column'} jC={'space-between'} aI={'center'}>
        {user && (
          <>
            <View style={[viewStyleImage]}>
              {user.profile ? (
                <Image
                  style={{ height: 90, width: 90, borderRadius: width }}
                  source={{
                    uri: user.profile,
                  }}
                  resizeMode={'contain'}
                />
              ) : type === 'email' ? (
                <EmailIcon size={90} height={height} width={width} />
              ) : (
                <UserAvatar size={90} name={first_name + ' ' + last_name} />
              )}
            </View>
            {identifier && identifier[0] == '+' && (
              <CountryFlag
                style={styles.flagIcon}
                isoCode={identifier[1] == '1' ? 'US' : 'NG'}
                //TODO: Change above code for nationality with another schema
                size={30}
              />
            )}

            <View jC={'center'} f={1}>
              {Boolean(first_name) && (
                <Text style={styles.text} s={20} fW={'700'} numberOfLines={1}>
                  {titlePrefix && <Text s={20}>{titlePrefix} </Text>}

                  {first_name + ' ' + last_name}
                </Text>
              )}
              {Boolean(identifier) && (
                <Text style={styles.text} s={15} umberOfLines={1}>
                  {identifier}
                </Text>
              )}
              {Boolean(username) && (
                <Text style={styles.text} s={15} umberOfLines={1}>
                  {username.startsWith('@') ? username : `@${username}`}
                </Text>
              )}
            </View>
            {rightSlot && rightSlot()}
          </>
        )}
        {recipientDetails && (
          <>
            <View style={[viewStyleImage]}>
              {recipientDetails.image ? (
                <Image
                  style={{ height: 90, width: 90, borderRadius: width }}
                  source={{
                    uri: recipientDetails.image,
                  }}
                  resizeMode={'contain'}
                />
              ) : type === 'email' ? (
                <EmailIcon size={90} height={height} width={width} />
              ) : (
                <UserAvatar size={90} name={name} />
              )}
            </View>
            {nationality?.length > 0 && (
              <CountryFlag
                style={styles.flagIcon}
                isoCode={nationality}
                size={30}
              />
            )}

            <View jC={'center'} f={1}>
              {Boolean(name) && (
                <Text style={styles.text} s={20} fW={'700'} numberOfLines={1}>
                  {titlePrefix && <Text s={20}>{titlePrefix} </Text>}
                  {name}
                </Text>
              )}
              {Boolean(contact) && (
                <Text style={styles.text} s={15} umberOfLines={1}>
                  {contact}
                </Text>
              )}
              {Boolean(username) && (
                <Text style={styles.text} s={15} umberOfLines={1}>
                  {username.startsWith('@') ? username : `@${username}`}
                </Text>
              )}
            </View>
            {rightSlot && rightSlot()}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  viewStyleImage: {
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#04418b',
    borderWidth: 2,
    borderRadius: 45,
  },
  flagIcon: {
    alignSelf: 'center',
    marginTop: -15,
    borderColor: '#ffffff',
    borderWidth: 4,
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#000000',
    marginTop: 2,
  },
});
