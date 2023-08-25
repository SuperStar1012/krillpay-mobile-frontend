import React from 'react';
import Svg, { Path, Defs, ClipPath, Rect, G } from 'react-native-svg';
import { View } from 'react-native';

export default function QR(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <View>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 200 200">
        <Defs>
          <ClipPath id="clip-path">
            <Path
              id="Rectangle_2319"
              fill="#fff"
              stroke="#707070"
              strokeWidth="1"
              d="M0 0H100V100H0z"
              data-name="Rectangle 2319"
              transform="translate(50 50)"></Path>
          </ClipPath>
          <ClipPath id="clip-qr">
            <Path d="M0 0H200V200H0z"></Path>
          </ClipPath>
        </Defs>
        <G id="qr" clipPath="url(#clip-qr)">
          <G
            id="Rectangle_2318"
            fill="none"
            stroke="#020d88"
            strokeWidth="8"
            data-name="Rectangle 2318"
            transform="translate(25 25)">
            <Rect width="150" height="150" stroke="none" rx="22"></Rect>
            <Rect width="142" height="142" x="4" y="4" rx="18"></Rect>
          </G>
          <G id="qr-code" opacity="0.4" transform="translate(50 50)">
            <G id="Group_1492" fill={primary} data-name="Group 1492">
              <Path
                id="Path_62232"
                d="M0 100h45.454V54.544H0zm9.09-36.364h27.273v27.2H9.09z"
                data-name="Path 62232"></Path>
              <Path
                id="Rectangle_2320"
                d="M0 0H9.091V9.092H0z"
                data-name="Rectangle 2320"
                transform="translate(18.182 72.726)"></Path>
              <Path
                id="Rectangle_2321"
                d="M0 0H9.093V9.091H0z"
                data-name="Rectangle 2321"
                transform="translate(72.725 90.909)"></Path>
              <Path
                id="Rectangle_2322"
                d="M0 0H9.093V9.091H0z"
                data-name="Rectangle 2322"
                transform="translate(90.907 90.909)"></Path>
              <Path
                id="Path_62233"
                d="M90.908 63.636h-9.09v-9.092H54.544V100h9.092V72.726h9.089v9.092H100V54.544h-9.092z"
                data-name="Path 62233"></Path>
              <Path
                id="Path_62234"
                d="M0 45.455h45.454V0H0zM9.09 9.09h27.273v27.273H9.09z"
                data-name="Path 62234"></Path>
              <Path
                id="Rectangle_2323"
                d="M0 0H9.091V9.091H0z"
                data-name="Rectangle 2323"
                transform="translate(18.182 18.182)"></Path>
              <Path
                id="Path_62235"
                d="M54.544 0v45.455H100V0zm36.364 36.363H63.636V9.09h27.272z"
                data-name="Path 62235"></Path>
              <Path
                id="Rectangle_2324"
                d="M0 0H9.093V9.091H0z"
                data-name="Rectangle 2324"
                transform="translate(72.725 18.182)"></Path>
            </G>
          </G>
        </G>
      </Svg>
    </View>
  );
}
