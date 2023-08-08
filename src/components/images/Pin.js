import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-FaceID">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G
        id="FaceID"
        fill="none"
        strokeLinecap="round"
        clipPath="url(#clip-FaceID)">
        <Path
          id="Path_62279"
          stroke="#020d88"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M16.023 58.18V15.092h40.761"
          data-name="Path 62279"></Path>
        <Path
          id="Path_62282"
          stroke="#020d88"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M14.619 143.092v43.088H55.38"
          data-name="Path 62282"></Path>
        <Path
          id="Path_62280"
          stroke="#020d88"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M186.785 58.18V15.092h-40.761"
          data-name="Path 62280"></Path>
        <Path
          id="Path_62281"
          stroke="#020d88"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M185.381 143.092v43.088H144.62"
          data-name="Path 62281"></Path>
        <Path
          id="primary"
          stroke={primary}
          strokeWidth="15"
          d="M60.91 75.277v19.034"
          opacity="0.4"></Path>
        <Path
          id="primary-2"
          stroke={primary}
          strokeWidth="15"
          d="M139.91 75.277v19.034"
          data-name="primary"
          opacity="0.4"></Path>
        <Path
          id="primary-3"
          stroke={primary}
          strokeWidth="15"
          d="M100 75.277s.156 18.96 0 30.214-8.093 11.738-8.093 11.738"
          data-name="primary"
          opacity="0.4"></Path>
        <Path
          id="primary-4"
          stroke={primary}
          strokeWidth="15"
          d="M77.176 138.854s11.147 8.747 22.955 8.747 24.277-8.747 24.277-8.747"
          data-name="primary"
          opacity="0.4"></Path>
      </G>
    </Svg>
  );
}
