import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

function Icon(props) {
  const { width = 150, height = 150 } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H100V100H0z"
            data-name="Rectangle 1279"
            transform="translate(482 129)"></Path>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="0.667"
            d="M0 0H100V100H0z"
            data-name="Rectangle 1161"
            transform="translate(75.333 62)"></Path>
        </ClipPath>
      </Defs>
      <G clip-path="url(#clip-path)" transform="translate(-482 -129)">
        <G transform="translate(406.667 67)">
          <G clip-path="url(#clip-path-2)" data-name="Mask Group 473">
            <G data-name="01-home" transform="translate(74.54 61.207)">
              <G>
                <Path
                  fill="#cc2538"
                  d="M50.794.793A38.933 38.933 0 0011.9 39.683c0 10.417 6.311 23.793 18.757 39.757a211.469 211.469 0 0018.486 20.693 2.381 2.381 0 003.291 0A211.465 211.465 0 0070.925 79.44C83.372 63.476 89.683 50.1 89.683 39.683A38.933 38.933 0 0050.794.793zm0 66.667a27.778 27.778 0 1127.778-27.778A27.778 27.778 0 0150.794 67.46z"
                  data-name="Path 61783"></Path>
              </G>
            </G>
          </G>
          <Path
            d="M3559.667-4081v-33.017q.5.017 1 .018a27.808 27.808 0 0027.777-27.777 27.808 27.808 0 00-27.777-27.779q-.5 0-1 .018v-10.8h6.1a38.948 38.948 0 0133.789 38.556c0 10.416-6.311 23.793-18.758 39.756a211.338 211.338 0 01-18.486 20.693 2.361 2.361 0 01-.428.326z"
            data-name="Intersection 2"
            opacity="0.2"
            transform="translate(-3435.333 4242.667)"></Path>
        </G>
        <Path
          fill="none"
          stroke="#0daf2d"
          strokeWidth="7"
          d="M520.133 172.127l10.9 9.684 16.1-23.155"
          data-name="Path 61958"></Path>
      </G>
    </Svg>
  );
}

export default Icon;
