import React from 'react';
import { useSelector } from 'react-redux';
import { profileSelector } from '@redux/rehive/reducer';
import { View, Text } from 'components';
import { Image } from 'react-native';

export default function PayRecipient(props) {
  const { business, data, request, contactMatch, userLabel } = props;

  const user = useSelector(profileSelector);

  const image = business?.icon ?? data?.image;

  const outgoing = request?.user?.id === user?.id;
  const existing = contactMatch(
    outgoing
      ? { email: request?.payer_email, mobile: request?.payer_mobile_number }
      : { email: request?.user.email, mobile: request?.user.mobile_number },
  );

  const contact =
    (existing && existing.name) ||
    userLabel(request, outgoing ? 'payer_user' : 'user', true);

  const name = business?.name ?? data?.name ?? contact;

  return (
    <>
      {image ? (
        <View style={styles.viewStyleContainer}>
          <Image
            style={styles.imageStylePhoto}
            source={{
              uri: image,
            }}
            key={image}
          />
        </View>
      ) : (
        <View w={'100%'} aI={'center'}>
          <View w={90} h={90} bC={'#DDD'} bR={100} jC={'center'} aI={'center'}>
            <Text c={'#9A9A9A'} fW={'700'} s={40}>
              {name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.viewStyleName}>
        <Text tA={'center'} fW={'700'} color={'headerContrast'} s={20}>
          {name}
        </Text>
      </View>
    </>
  );
}

const styles = {
  viewStyleContainer: {
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.15,
    zIndex: 2,
  },
  imageStylePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0,
    marginBottom: 8,
  },
  viewStyleName: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
};
