import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-Path">
          <Path
            id="RectanGle_2308"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H180V180H0z"
            data-name="RectanGle 2308"
            transform="translate(10 10)"></Path>
        </ClipPath>
        <ClipPath id="clip-basic-info">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="basic-info" clipPath="url(#clip-basic-info)">
        <G id="primary" opacity="0.35" transform="translate(10 10)">
          <G id="Group_1487" data-name="Group 1487">
            <G id="Group_1486" data-name="Group 1486">
              <Path
                id="Path_62226"
                fill={primary}
                d="M90.012 0a46.735 46.735 0 1046.735 46.735A46.859 46.859 0 0090.012 0z"
                data-name="Path 62226"></Path>
            </G>
          </G>
          <G id="Group_1489" data-name="Group 1489">
            <G id="Group_1488" data-name="Group 1488">
              <Path
                id="Path_62227"
                fill={primary}
                d="M170.217 130.816a43.569 43.569 0 00-4.694-8.571 58.091 58.091 0 00-40.2-25.306 8.6 8.6 0 00-5.918 1.429 49.816 49.816 0 01-58.776 0 7.657 7.657 0 00-5.918-1.429 57.669 57.669 0 00-40.2 25.306 50.234 50.234 0 00-4.694 8.571 4.34 4.34 0 00.2 3.878 81.419 81.419 0 005.51 8.163 77.558 77.558 0 009.388 10.612 122.328 122.328 0 009.388 8.163 93.066 93.066 0 00111.02 0 89.731 89.731 0 009.388-8.163 94.239 94.239 0 009.388-10.612 71.549 71.549 0 005.51-8.163 3.483 3.483 0 00.608-3.878z"
                data-name="Path 62227"></Path>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
