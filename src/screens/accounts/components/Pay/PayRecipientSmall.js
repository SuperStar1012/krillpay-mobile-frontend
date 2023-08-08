import React from 'react';
import { View, Text } from 'components';
import { Image } from 'react-native';

const imageSize = 24;

export default function PayRecipientSmall(props) {
  const { data } = props;

  const { image, name } = data;

  return (
    <View fD="row" aI="center" jC="center">
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
        <View aI={'center'}>
          <View
            w={imageSize}
            h={imageSize}
            bC={'#DDD'}
            bR={100}
            jC={'center'}
            aI={'center'}>
            <Text c={'#9A9A9A'} fW={'700'} s={24}>
              {name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.viewStyleName}>
        <Text tA={'center'} fW={'700'} color={'headerContrast'} s={18}>
          {name}
        </Text>
      </View>
    </View>
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
    width: imageSize,
    height: imageSize,
    borderRadius: 40,
    borderWidth: 0,
    // marginBottom: 8,
  },
  viewStyleName: {
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: 8,
  },
};
