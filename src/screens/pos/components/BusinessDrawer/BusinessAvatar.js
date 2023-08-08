import React from 'react';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Image from 'components/outputs/Image';
import { Icon } from 'components/outputs/Icon';

export default function BusinessAvatar(props) {
  const { context = {}, imageSize = 36 } = props;
  const { business } = context;

  const photoLink = business?.icon ?? business?.logo;
  const name = business?.name;

  return (
    <View fD="row" aI="center">
      <View
        style={{
          height: imageSize,
          maxHeight: imageSize,
          maxWidth: imageSize,
          width: imageSize,
          borderRadius: imageSize,

          overflow: 'hidden',
        }}>
        {photoLink ? (
          <Image
            style={{
              maxHeight: imageSize,
              maxWidth: imageSize,
            }}
            imgStyle={{
              width: imageSize,
              height: imageSize,
              maxHeight: imageSize,
              maxWidth: imageSize,
              objectFit: 'cover',
            }}
            key={photoLink}
            src={photoLink}
            // key={photoLink}
            height={imageSize}
            width={imageSize}
          />
        ) : (
          <View
            bR={imageSize}
            h={imageSize}
            w={imageSize}
            aI="center"
            jC="center"
            bC={business?.colors?.primary ?? 'primary'}>
            <Icon
              set={'MaterialIcons'}
              color="white"
              name="store"
              size={imageSize - 8}
            />
          </View>
        )}
      </View>

      <View pl={0.675}>
        <Text
          bold
          tA="left"
          s={14}
          style={{
            color: '#333333',
          }}>
          {name}
        </Text>
      </View>
    </View>
  );
}
