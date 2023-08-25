import React, { useState, useEffect } from 'react';
import { Dimensions, Image as RNImage, TouchableOpacity } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from '../layout/View';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Image(props) {
  const {
    src: uri,
    height,
    width,
    onPress,
    style = {},
    resizeMode = 'cover',
  } = props;

  const [dimensions, setDimensions] = useState({ width, height });
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (uri) {
  //     RNImage.getSize(uri, (w, h) => {
  //       let { width, height } = props;

  //       if (w > h) {
  //         height = (height * h) / w;
  //       } else {
  //         width = (width * h) / w;
  //       }

  //       // setDimensions({ width, height });
  //     });
  //   }
  // }, [uri]);

  let IMG = (
    <View
      style={{
        position: 'relative',
        width,
        height,
        minWidth: width,
        maxWidth: width,
        overflow: 'hidden',
        borderRadius: style?.borderRadius ?? 0,
      }}>
      {loading && (
        <SkeletonPlaceholder speed={1000}>
          <SkeletonPlaceholder.Item
            width={style?.width ?? dimensions?.width ?? width}
            height={style?.height ?? dimensions?.height ?? height}
            borderRadius={style?.borderRadius ?? 0}
          />
        </SkeletonPlaceholder>
      )}

      <View
        style={{
          position: loading ? 'absolute' : 'relative',
        }}
        w={'100%'}
        h={'100%'}>
        <RNImage
          style={{
            ...dimensions,
            ...style,
          }}
          source={{
            uri,
            // cache: 'only-if-cached',
          }}
          onError={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          resizeMode={resizeMode}
        />
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={{
          maxWidth: width,
          maxHeight: height,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
        onPress={onPress}>
        {IMG}
      </TouchableOpacity>
    );
  }
  return IMG;
}
