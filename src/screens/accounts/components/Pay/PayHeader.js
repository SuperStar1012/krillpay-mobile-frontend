import React from 'react';
import { Text, View } from 'components';
import { standardizeString } from 'utility/general';
import Image from 'components/outputs/Image';
import { StyleSheet } from 'react-native';

export default function PayHeader(props) {
  const { business, data } = props;

  const image = business?.icon ?? business?.logo ?? data?.image;
  const name = business
    ? business?.name ?? standardizeString(business?.id)
    : data?.name;

  return (
    <View pt={1}>
      <Text fW="bold" c="white">
        TO
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
          <Text c="primaryContrast">{name}</Text>
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
