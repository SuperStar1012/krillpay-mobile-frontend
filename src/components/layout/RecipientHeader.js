import React from 'react';

import { View, Text } from 'components';
import { Image } from 'react-native';
import Images from 'components/images';

export default function RecipientHeader(props) {
  const { image, name } = props;

  if (!image && !name) {
    return null;
  }

  return (
    <View style={styles.viewStyleContainer}>
      {image === 'product' ? (
        <View style={styles.imageStylePhoto}>
          <Images name={'product'} height={70} width={70} />
        </View>
      ) : image ? (
        <Image
          style={styles.imageStylePhoto}
          source={{
            uri: image,
          }}
          key={image}
        />
      ) : null}

      <View style={styles.viewStyleName}>
        <Text fW={'700'} color={'headerContrast'} s={20}>
          {name}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  viewStyleContainer: {
    alignItems: 'center',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 2,
    // shadowOpacity: 0.15,
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
