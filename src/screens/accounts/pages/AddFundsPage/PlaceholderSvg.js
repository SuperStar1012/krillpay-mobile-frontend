import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  G,
  Rect,
  Text as SvgText,
  ClipPath,
} from 'react-native-svg';
import { Text, View } from 'components';
import { useTheme } from 'components/context';
import { standardizeString } from 'utility/general';

export default function PlaceholderSvg(props) {
  const { size = 120, name, label, color = 'primary', ...restProps } = props;

  // const { color, colorsOveride, name,  } = props;
  let { colors = { primary: '#E43' } } = useTheme();
  // if (colorsOveride) {
  //   colors = colorsOveride;
  // }
  const sharedProps = {
    color,
    colors,
    width: size,
    height: size,
  };

  function Image() {
    switch (name) {
      case 'pin':
        return <PinSvg {...sharedProps} />;
      case 'qr':
      case 'scan':
        return <ScanSvg {...sharedProps} />;
      default:
        return null;
    }
  }
  return (
    <View>
      <View style={styles.container}>
        <Image />
      </View>
      <Text tA="center">{label ? label : standardizeString(name)}</Text>
    </View>
  );
}

const PinSvg = props => {
  const { width, height, colors } = props;
  const { primary } = colors;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 130 130">
      <G transform="translate(-468 -147)">
        <Path
          fill={primary}
          d="M35 0h60a35 35 0 0135 35v60a35 35 0 01-35 35H35A35 35 0 010 95V35A35 35 0 0135 0z"
          data-name="Path 611"
          transform="translate(468 147)"></Path>
        <Path
          d="M23.789 77.916l41.922-3.93 45.132-16.138 22.642 33.108c.051 6.72 3.369 23.2-13.863 36.758-8.148 6.714-19.06 6.748-19.06 6.748H78.571z"
          data-name="Intersection 1"
          opacity="0.1"
          transform="translate(464.158 142.423)"></Path>
        <Rect
          width="92.97"
          height="34.273"
          fill="#dbfffa"
          data-name="Rectangle 341"
          rx="17.136"
          transform="translate(486.33 194.848)"></Rect>
        <SvgText
          fill="#222"
          data-name="****"
          fontFamily="HelveticaNeue-Medium, Helvetica Neue"
          fontSize="43"
          fontWeight="500"
          letterSpacing=".03em"
          transform="translate(497.391 234.753)">
          ****
        </SvgText>
      </G>
    </Svg>
  );
};
const ScanSvg = props => {
  const { width, height, colors } = props;
  const { primary } = colors;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 130 130">
      <Defs>
        <ClipPath id="clipPath">
          <Path
            fill="#fff"
            d="M0 0H61.061V61.061H0z"
            data-name="Rectangle 328"></Path>
        </ClipPath>
      </Defs>
      <G transform="translate(-167 -147)">
        <Path
          fill={primary}
          d="M35 0h60a35 35 0 0135 35v60a35 35 0 01-35 35H35A35 35 0 010 95V35A35 35 0 0135 0z"
          data-name="Path 609"
          transform="translate(167 147)"></Path>
        <Path
          d="M37.292 101.243L65.71 73.987l34.354-35 33.926 35c-.183 24.918 2.863 40.169-14.369 53.728-8.148 6.714-19.06 6.748-19.06 6.748H76.044z"
          data-name="Intersection 1"
          opacity="0.1"
          transform="translate(163.158 142.423)"></Path>
        <Path
          fill="#fff"
          d="M0 0H63.03V63.03H0z"
          data-name="Rectangle 327"
          transform="translate(200.27 180.485)"></Path>
        <G
          clipPath="url(#clipPath)"
          data-name="Mask Group 213"
          transform="translate(201.452 181.667)">
          <G data-name="qr-code">
            <G data-name="Group 297">
              <G data-name="Group 296">
                <Path
                  d="M19.082 0H0v19.082h19.082zm-3.817 15.265H3.816V3.816h11.449z"
                  data-name="Path 555"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 329"
                  transform="translate(7.633 7.633)"></Path>
                <Path
                  d="M39.375 0v19.082h19.081V0zM54.64 15.265H43.191V3.816H54.64z"
                  data-name="Path 556"
                  transform="translate(2.604)"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 330"
                  transform="translate(49.612 7.633)"></Path>
                <Path
                  d="M0 58.456h19.082V39.375H0zm3.816-15.265h11.449V54.64H3.816z"
                  data-name="Path 557"
                  transform="translate(0 2.604)"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 331"
                  transform="translate(7.633 49.612)"></Path>
                <Path
                  d="M0 0H7.633V3.816H0z"
                  data-name="Rectangle 332"
                  transform="translate(30.53)"></Path>
                <Path
                  d="M29.11 15.028h3.816v-3.816h3.816V7.4H25.294V3.58h-3.817v7.633h7.633z"
                  data-name="Path 558"
                  transform="translate(1.42 .237)"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 333"
                  transform="translate(22.898 15.265)"></Path>
                <Path
                  d="M36.742 17.9h-3.816v3.816H21.477v3.816h15.265z"
                  data-name="Path 559"
                  transform="translate(1.42 1.184)"></Path>
                <Path
                  d="M3.816 32.926h3.817V29.11H3.816v-7.633H0v15.265h3.816z"
                  data-name="Path 560"
                  transform="translate(0 1.42)"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 334"
                  transform="translate(7.633 22.898)"></Path>
                <Path
                  d="M22.188 36.742h7.632v-3.816H26V29.11h-7.629v-7.633h-3.816v7.633h-3.816v7.633h3.816v-3.817h7.633z"
                  data-name="Path 561"
                  transform="translate(.71 1.42)"></Path>
                <Path
                  d="M0 0H3.816V7.633H0z"
                  data-name="Rectangle 335"
                  transform="translate(34.347 30.53)"></Path>
                <Path
                  d="M32.926 39.375H21.477v3.816h7.633V54.64h-7.633v3.816h11.449v-3.815h7.633v-3.816h-7.633z"
                  data-name="Path 562"
                  transform="translate(1.42 2.604)"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 336"
                  transform="translate(22.898 49.612)"></Path>
                <Path
                  d="M0 0H3.816V7.633H0z"
                  data-name="Rectangle 337"
                  transform="translate(38.163 41.979)"></Path>
                <Path
                  d="M54.4 46.534H42.955v11.449h3.816V50.35H54.4z"
                  data-name="Path 563"
                  transform="translate(2.841 3.078)"></Path>
                <Path
                  d="M0 0H7.633V3.816H0z"
                  data-name="Rectangle 338"
                  transform="translate(53.428 57.245)"></Path>
                <Path
                  d="M0 0H3.816V3.816H0z"
                  data-name="Rectangle 339"
                  transform="translate(57.245 41.979)"></Path>
                <Path
                  d="M43.191 43.665h3.816V32.216h-7.632v3.816h3.816z"
                  data-name="Path 564"
                  transform="translate(2.604 2.131)"></Path>
                <Path
                  d="M50.824 25.294h-3.816v-3.817h-3.817v3.816h-3.816v3.817H54.64v-3.816h3.816v-3.817h-7.632z"
                  data-name="Path 565"
                  transform="translate(2.604 1.42)"></Path>
                <Path
                  d="M0 0H7.633V3.816H0z"
                  data-name="Rectangle 340"
                  transform="translate(53.428 34.347)"></Path>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
});
