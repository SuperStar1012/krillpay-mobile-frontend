import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            id="Rectangle_25"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H140V140H0z"
            data-name="Rectangle 25"></Path>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path
            id="Rectangle_25-2"
            fill={primary}
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H140V140H0z"
            data-name="Rectangle 25"></Path>
        </ClipPath>
        <ClipPath id="clip-Fingerprint">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="Fingerprint" clipPath="url(#clip-Fingerprint)">
        <Path
          id="Path_62279"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M16.023 58.18V15.092h40.761"
          data-name="Path 62279"></Path>
        <Path
          id="Path_62282"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M14.619 143.092v43.088H55.38"
          data-name="Path 62282"></Path>
        <Path
          id="Path_62280"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M186.785 58.18V15.092h-40.761"
          data-name="Path 62280"></Path>
        <Path
          id="Path_62281"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M185.381 143.092v43.088H144.62"
          data-name="Path 62281"></Path>
        <G
          id="Mask_Group_13"
          clipPath="url(#clip-path)"
          data-name="Mask Group 13"
          transform="translate(30 30)">
          <G
            id="fingerprint-2"
            data-name="fingerprint"
            transform="translate(5.831 -.001)">
            <G id="primary">
              <G id="Group_36" fill="#fff" data-name="Group 36">
                <Path
                  id="Path_31"
                  d="M142.461 162.924c-21.731 0-40.8-16.353-40.8-35a2.914 2.914 0 00-5.828 0c0 21.751 21.788 40.828 46.627 40.828a2.834 2.834 0 002.528-1.436 2.978 2.978 0 000-2.961 2.834 2.834 0 00-2.527-1.431z"
                  data-name="Path 31"
                  transform="translate(-34.638 -37.521)"></Path>
                <Path
                  id="Path_32"
                  d="M36.251 18.124a2.925 2.925 0 001.514-.422 82.528 82.528 0 0181.585-1.716 2.908 2.908 0 003.961-1.142 2.944 2.944 0 00.247-2.227 2.868 2.868 0 00-1.385-1.735 87.033 87.033 0 00-87.437 1.83 2.881 2.881 0 00-1.312 1.788 2.947 2.947 0 00.334 2.215 2.913 2.913 0 002.493 1.4z"
                  data-name="Path 32"
                  transform="translate(-15.854 .002)"></Path>
                <Path
                  id="Path_33"
                  d="M136.2 58.584C124.91 38.185 99.889 25 72.449 25S19.988 38.185 8.7 58.584a2.946 2.946 0 00-.248 2.228 2.87 2.87 0 001.388 1.736 2.916 2.916 0 003.96-1.139c10.275-18.575 33.3-30.576 58.649-30.576s48.374 12 58.648 30.576a2.915 2.915 0 003.962 1.139 2.868 2.868 0 001.386-1.736 2.944 2.944 0 00-.249-2.228z"
                  data-name="Path 33"
                  transform="translate(-8.34 -7.501)"></Path>
                <Path
                  id="Path_34"
                  d="M47.5 115.829c0-20.278 14.708-35 34.97-35 21.242 0 34.97 12.593 34.97 32.079a2.914 2.914 0 005.828 0c0-22.675-16.4-37.912-40.8-37.912-23.257 0-40.8 17.552-40.8 40.828 0 17.042 6.067 31.148 19.682 45.736a2.915 2.915 0 004.257-3.982C53.079 144.157 47.5 131.282 47.5 115.829z"
                  data-name="Path 34"
                  transform="translate(-18.356 -22.505)"></Path>
                <Path
                  id="Path_35"
                  d="M74.954 50c-33.77 0-58.284 23.3-58.284 55.41 0 8.658 2.909 16.866 6.051 24.447a2.92 2.92 0 003.808 1.579 2.86 2.86 0 001.57-1.566 2.961 2.961 0 00.006-2.245C25.191 120.6 22.5 113.05 22.5 105.412c0-29.192 21.572-49.577 52.455-49.577 29.9 0 52.452 22.566 52.452 52.492a14.571 14.571 0 11-29.141 0C98.265 94.589 88.679 85 74.951 85s-23.313 9.595-23.313 23.33c0 19.03 10.758 35.039 31.105 46.3a2.913 2.913 0 003.961-1.142 2.944 2.944 0 00.248-2.228 2.868 2.868 0 00-1.386-1.736c-18.646-10.315-28.1-24.173-28.1-41.193 0-12.087 8.782-17.5 17.485-17.5s17.485 5.411 17.485 17.5a20.4 20.4 0 1040.8 0C133.236 75.074 108.181 50 74.954 50z"
                  data-name="Path 35"
                  transform="translate(-10.843 -15.003)"></Path>
              </G>
            </G>
          </G>
        </G>
        <G
          id="primary-2"
          clipPath="url(#clip-path-2)"
          data-name="primary"
          opacity="0.4"
          transform="translate(30 30)">
          <G
            id="fingerprint-3"
            data-name="fingerprint"
            transform="translate(5.831 -.001)">
            <G id="primary-3" data-name="primary">
              <G id="Group_36-2" fill={primary} data-name="Group 36">
                <Path
                  id="Path_31-2"
                  d="M142.461 162.924c-21.731 0-40.8-16.353-40.8-35a2.914 2.914 0 00-5.828 0c0 21.751 21.788 40.828 46.627 40.828a2.834 2.834 0 002.528-1.436 2.978 2.978 0 000-2.961 2.834 2.834 0 00-2.527-1.431z"
                  data-name="Path 31"
                  transform="translate(-34.638 -37.521)"></Path>
                <Path
                  id="Path_32-2"
                  d="M36.251 18.124a2.925 2.925 0 001.514-.422 82.528 82.528 0 0181.585-1.716 2.908 2.908 0 003.961-1.142 2.944 2.944 0 00.247-2.227 2.868 2.868 0 00-1.385-1.735 87.033 87.033 0 00-87.437 1.83 2.881 2.881 0 00-1.312 1.788 2.947 2.947 0 00.334 2.215 2.913 2.913 0 002.493 1.4z"
                  data-name="Path 32"
                  transform="translate(-15.854 .002)"></Path>
                <Path
                  id="Path_33-2"
                  d="M136.2 58.584C124.91 38.185 99.889 25 72.449 25S19.988 38.185 8.7 58.584a2.946 2.946 0 00-.248 2.228 2.87 2.87 0 001.388 1.736 2.916 2.916 0 003.96-1.139c10.275-18.575 33.3-30.576 58.649-30.576s48.374 12 58.648 30.576a2.915 2.915 0 003.962 1.139 2.868 2.868 0 001.386-1.736 2.944 2.944 0 00-.249-2.228z"
                  data-name="Path 33"
                  transform="translate(-8.34 -7.501)"></Path>
                <Path
                  id="Path_34-2"
                  d="M47.5 115.829c0-20.278 14.708-35 34.97-35 21.242 0 34.97 12.593 34.97 32.079a2.914 2.914 0 005.828 0c0-22.675-16.4-37.912-40.8-37.912-23.257 0-40.8 17.552-40.8 40.828 0 17.042 6.067 31.148 19.682 45.736a2.915 2.915 0 004.257-3.982C53.079 144.157 47.5 131.282 47.5 115.829z"
                  data-name="Path 34"
                  transform="translate(-18.356 -22.505)"></Path>
                <Path
                  id="Path_35-2"
                  d="M74.954 50c-33.77 0-58.284 23.3-58.284 55.41 0 8.658 2.909 16.866 6.051 24.447a2.92 2.92 0 003.808 1.579 2.86 2.86 0 001.57-1.566 2.961 2.961 0 00.006-2.245C25.191 120.6 22.5 113.05 22.5 105.412c0-29.192 21.572-49.577 52.455-49.577 29.9 0 52.452 22.566 52.452 52.492a14.571 14.571 0 11-29.141 0C98.265 94.589 88.679 85 74.951 85s-23.313 9.595-23.313 23.33c0 19.03 10.758 35.039 31.105 46.3a2.913 2.913 0 003.961-1.142 2.944 2.944 0 00.248-2.228 2.868 2.868 0 00-1.386-1.736c-18.646-10.315-28.1-24.173-28.1-41.193 0-12.087 8.782-17.5 17.485-17.5s17.485 5.411 17.485 17.5a20.4 20.4 0 1040.8 0C133.236 75.074 108.181 50 74.954 50z"
                  data-name="Path 35"
                  transform="translate(-10.843 -15.003)"></Path>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
