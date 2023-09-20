import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import { View, Dimensions } from 'react-native';
import Image from 'components/outputs/Image';
import { get } from 'lodash';
import { useTheme } from 'components/context';
import Images from './images';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductCardHeader(props) {
  const { items, width = SCREEN_WIDTH / 2 - 24 } = props;

  const image = get(items, [0], null);

  return image ? (
    <Image src={image.file ?? image} height={width} width={width} />
  ) : (
    <Images size={width} name="productPadded" />
  );
}

ProductCardHeader.propTypes = {};

ProductCardHeader.defaultProps = {};

export function ProductHeaderSvg(props) {
  const { colors } = useTheme();
  const { primary, secondary } = colors;
  const { width = SCREEN_WIDTH / 2 - 24 } = props;
  const h = 118.401;
  const w = 130.432;

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        height: width,
        width: width,
        maxHeight: width,
        maxWidth: width,
        // padding: 16,
        // display: 'flex',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        height={h * (width / w) * 0.8}
        width={width * 0.8}
        viewBox="0 0 118.401 130.432">
        <G fill={secondary} data-name="Group 176">
          <Path
            d="M181.71 49.731l-59.2 32.529-59.2-32.529 59.206-32.845z"
            data-name="Path 90"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(129.426 447.482) translate(-63.311 -16.886)"
          />
          <Path
            d="M143.224 94l-59.2 32.529V61.471l59.2-32.529z"
            data-name="Path 91"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(129.426 447.482) translate(-24.826 3.904)"
          />
          <Path
            d="M63.31 94l59.205 32.529V61.471L63.31 28.942z"
            data-name="Path 92"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(129.426 447.482) translate(-63.311 3.904)"
          />
        </G>
        <G fill="#fff">
          <Path
            d="M181.71 49.731l-59.2 32.529-59.2-32.529 59.206-32.845z"
            data-name="Path 90"
            opacity="0.75"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(66.114 430.596)"
          />
          <Path
            d="M143.224 94l-59.2 32.529V61.471l59.2-32.529z"
            data-name="Path 91"
            opacity="0.52"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(104.599 451.386)"
          />
        </G>
        <G fill="#fff" data-name="Group 177">
          <Path
            d="M1053.014 8224.208l59.754-32.455 10.647 5.852-57.887 33.951z"
            data-name="Path 437"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(-900.983 -7731.602)"
          />
          <Path
            d="M1053.014 8224.122v16.53l12.416 6.792v-15.961z"
            data-name="Path 438"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(-900.983 -7731.602)"
          />
        </G>
      </Svg>
    </View>
  );
}
