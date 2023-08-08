import React, { useState, useEffect } from 'react';
import { Dimensions, Image, TouchableOpacity } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

const Logo = props => {
  let {
    company,
    height = SCREEN_WIDTH / 2,
    width,
    onAbout,
    style,
    logo,
  } = props;

  if (height && !width) {
    width = height;
  }

  let IMG = null;
  const [dimensions, setDimensions] = useState({ width, height });

  const isIcon = Boolean(company && company.icon);
  const uri = company
    ? !logo && isIcon
      ? company.icon
      : company.logo
      ? company.logo
      : ''
    : '';

  useEffect(() => {
    if (uri) {
      if (Image)
        Image.getSize(uri, (w, h) => {
          let { width, height } = props;
          if (height && !width) {
            width = height;
          }
          if (!height && width) {
            height = width;
          }

          if (w > h) {
            height = (height * h) / w;
          } else {
            width = (width * h) / w;
          }

          setDimensions({ width, height });
        });
    }
  }, [uri]);

  let iconStyle = {};

  if (isIcon) {
    iconStyle = {
      borderRadius: 200,
      overflow: 'hidden',
    };
  }

  if (uri) {
    IMG = (
      <Image
        style={{ ...dimensions, ...iconStyle }}
        source={{
          uri,
          // cache: 'only-if-cached',
        }}
        resizeMode={'contain'}
      />
    );
  } else {
    IMG = (
      <Image
        source={require('../../../assets/icons/icon.png')}
        resizeMode="contain"
        style={{
          ...dimensions,
          maxWidth: width,
          maxHeight: height,
          ...style,
        }}
      />
    );
  }

  if (onAbout) {
    return (
      <TouchableOpacity
        style={{
          maxWidth: width,
          maxHeight: height,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
        onPress={onAbout}>
        {IMG}
      </TouchableOpacity>
    );
  }
  return IMG;
};

export default Logo;
