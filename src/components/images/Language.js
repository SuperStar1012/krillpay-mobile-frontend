import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Language(props) {
  const { width = 200, height = 200, colors } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 116 116">
      <G id="language" transform="translate(-269 -452)">
        <Path
          id="primary"
          fill="#5d48f8"
          d="M58 0A58 58 0 110 58 58 58 0 0158 0z"
          opacity="0.3"
          transform="translate(269 452)"></Path>
        <Path
          id="primary-2"
          fill="#5d48f8"
          d="M-12.32 0H.77l-24.1-53.9h-12.32L-59.675 0h12.782l4.774-11.55h25.025zm-25.795-21.021l8.547-20.636 8.547 20.636z"
          data-name="primary"
          transform="translate(339 525)"></Path>
        <Path
          id="Path_63000"
          fill="#fff"
          d="M-6.89-45.825c-7.28.39-16.64.715-27.95.91.26-2.08.65-4.16 1.1-6.24l-6.63-1.43c-.52 2.6-.975 5.2-1.3 7.8-5.33 0-11.05.065-17.16.065l.065 6.24c5.72 0 11.18-.065 16.38-.065-.26 2.6-.455 5.265-.52 7.93a30.779 30.779 0 00-7.735 4.225c-6.175 4.485-9.23 9.815-9.23 15.925a11.707 11.707 0 003.06 8.515 10.668 10.668 0 007.995 3.185C-40.3 1.235-33.15-3.12-27.3-11.7A68.094 68.094 0 00-20.41-26a16.266 16.266 0 013.12 1.365c3.64 2.08 5.46 5.005 5.46 8.84a11.154 11.154 0 01-5.135 9.685c-3.12 2.015-7.8 3.445-14.1 4.225l2.34 5.85c7.8-1.04 13.585-3.055 17.42-5.98 4.16-3.25 6.24-7.8 6.24-13.78 0-5.655-2.47-10.075-7.28-13.325a22.4 22.4 0 00-6.175-2.925c.26-1.04.585-2.08.845-3.12l-6.435-1.495c-.26 1.17-.585 2.275-.91 3.38-.78-.065-1.625-.065-2.405-.065a45.982 45.982 0 00-8.645.78c.13-2.08.26-4.1.455-6.11 11.505-.195 21.19-.52 29.12-.975zM-26.975-27.1a57.85 57.85 0 01-6.11 12.025c-.78 1.04-1.5 2.015-2.21 2.925a94.064 94.064 0 01-.91-13.975 37.809 37.809 0 018.775-.975zm-15.99 3.51A92.6 92.6 0 00-41.21-7.02a15.584 15.584 0 01-7.605 2.08c-2.925 0-4.355-1.885-4.355-5.525 0-4.225 2.4-8 7.28-11.375a21.778 21.778 0 012.925-1.76z"
          data-name="Path 63000"
          transform="translate(376 549.31)"></Path>
      </G>
    </Svg>
  );
}
