import React from 'react';
import { Text, View } from 'components';
import { concatName } from 'utility/general';
import Image from 'components/outputs/Image';
import { StyleSheet } from 'react-native';

export default function PosSuccessHeader(props) {
  const { data = {} } = props;
  const { payer_user, payer_email, payer_mobile } = data;

  const image = payer_user?.profile;
  const name = concatName(payer_user)
    ? concatName(payer_user)
    : payer_email ?? payer_mobile;
  if (!name) return null;

  return (
    <View pt={1}>
      <Text fW="bold" c="white">
        FROM
      </Text>
      <View fD="row" aI="center" pt={0.5} mr={3.5}>
        <View fD={'row'} jC={'space-between'} aI={'center'}>
          {!!image && (
            <View style={styles.viewStyleImage}>
              <Image
                style={{ height: 37, width: 37, borderRadius: 100 }}
                src={image}
                resizeMode={'contain'}
              />
            </View>
          )}
          {/* <View jC={'center'} mr={1}> */}
          <Text c="primaryContrast">{name}</Text>
          {/* </View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleImage: {
    marginRight: 12,
    maxHeight: 37,
    maxWidth: 37,
    borderRadius: 37,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
