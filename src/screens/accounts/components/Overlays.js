import React from 'react';

import Svg, { Stop, Path, LinearGradient, G, Defs } from 'react-native-svg';
import { View, Dimensions } from 'react-native';
import { useIsRTL } from 'hooks/general';
// import { useTheme } from 'core/common/components/context';
const SCREEN_WIDTH = Dimensions.get('window').width;

const Overlays = props => {
  const { variant } = props;
  // const { colors } = useTheme();

  function renderSvg() {
    switch (variant) {
      case 'cardSmall':
        return <CardSmallOverlay {...props} />;
      case 'card':
        return <CardOverlay {...props} />;
      case 'chiplessCard':
        return <ChiplessCardOverlay {...props} />;
      case 'detail':
        return <DetailOverlay {...props} />;

      default:
        return null;
    }
  }

  return (
    <View style={{ position: 'absolute', width: '100%', zIndex: 5 }}>
      {renderSvg()}
    </View>
  );
};

export default Overlays;

const CardOverlay = props => {
  const { width = SCREEN_WIDTH - 72 } = props;
  const w = 276;
  const h = 165;

  return (
    <Svg height={h * (width / w)} width={width} viewBox="0 0 275.677 164.981">
      <Defs>
        <LinearGradient
          id="a"
          x1="0.984"
          x2="0.011"
          y1="0.027"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.333" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="b"
          x1="0.072"
          x2="1.03"
          y1="1"
          y2="0.5"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0.502" />
        </LinearGradient>
      </Defs>
      <G transform="translate(-60.901 -30)">
        <Path
          fill="url(#a)"
          d="M2164.5 9046v162.146s-136.608 16.539-213.343-30.273S1890.251 9046 1890.251 9046z"
          data-name="Path 452"
          transform="translate(-1828 -9016)"
        />
        <Path
          fill="url(#b)"
          d="M2050.178 9154.387v55.7h-165.9s70.263 2.762 110.329-15.08 55.571-40.62 55.571-40.62z"
          data-name="Path 453"
          opacity="0.374"
          transform="translate(-1713.6 -9017)"
        />
      </G>
    </Svg>
  );
};

const CardSmallOverlay = props => {
  const width = SCREEN_WIDTH;
  const w = 276;
  const h = 165;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="94.981"
      viewBox="0 0 275.677 94.981">
      <Defs>
        <LinearGradient
          id="a"
          x1="0.984"
          x2="0.011"
          y1="0.027"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.333"></Stop>
          <Stop offset="1" stopColor="#fff" stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="b"
          x1="0.072"
          x2="1.03"
          y1="1"
          y2="0.5"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0"></Stop>
          <Stop offset="1" stopColor="#fff" stopOpacity="0.502"></Stop>
        </LinearGradient>
      </Defs>
      <Path
        fill="url(#a)"
        d="M2164.5 9046v93.35s-136.608 9.521-213.343-17.429-60.906-75.921-60.906-75.921z"
        data-name="Path 452"
        transform="translate(-1888.901 -9046)"></Path>
      <Path
        fill="url(#b)"
        d="M2050.178 9154.387v55.7h-165.9s70.263 2.762 110.329-15.08 55.571-40.62 55.571-40.62z"
        data-name="Path 453"
        opacity="0.374"
        transform="translate(-1774.501 -9117)"></Path>
    </Svg>
  );
};

const DetailOverlay = props => {
  const width = SCREEN_WIDTH;
  const w = 376;
  const h = 812;
  const isRTL = useIsRTL();

  return (
    <Svg height={h * (width / w)} width={width} viewBox="0 0 376 812">
      <Defs>
        <LinearGradient
          id="a"
          x1={isRTL ? '0.127' : '1.017'}
          x2={isRTL ? '1.017' : '0.127'}
          y2="0.224"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.992" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path fill="url(#a)" d="M0 0H376V812H0z" opacity="0.355" />
    </Svg>
  );
};

const ChiplessCardOverlay = props => {
  const { width = SCREEN_WIDTH - 16 } = props;
  const w = 330;
  const h = 182;

  const height = h * (width / w);
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 330.599 181.644">
      <Defs>
        <LinearGradient
          id="linear-gradient"
          x1="0.984"
          x2="0.011"
          y1="0.027"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.333"></Stop>
          <Stop offset="1" stopColor="#fff" stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="linear-gradient-2"
          x1="0.072"
          x2="1.03"
          y1="1"
          y2="0.5"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0"></Stop>
          <Stop offset="1" stopColor="#fff" stopOpacity="0.502"></Stop>
        </LinearGradient>
      </Defs>
      <Path
        fill="url(#linear-gradient)"
        d="M2219.422 9046v178.522s-163.832 18.209-255.858-33.332-73.043-145.19-73.043-145.19z"
        data-name="Path 452"
        transform="translate(-1888.901 -9046)"></Path>
      <Path
        fill="url(#linear-gradient-2)"
        d="M2050.178 9154.387v55.7h-165.9s70.263 2.762 110.329-15.08 55.571-40.62 55.571-40.62z"
        data-name="Path 453"
        opacity="0.374"
        transform="translate(-1719.579 -9030.337)"></Path>
    </Svg>
  );
};
