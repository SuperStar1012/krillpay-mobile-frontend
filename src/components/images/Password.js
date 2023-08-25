import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-Password">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="Password" clipPath="url(#clip-Password)">
        <G
          id="Rectangle_2381"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2381"
          transform="translate(20.5 67.74)">
          <Rect width="159" height="122" stroke="none" rx="24"></Rect>
          <Rect width="151" height="114" x="4" y="4" rx="20"></Rect>
        </G>
        <Path
          id="primary"
          fill={primary}
          d="M-44.785-50.987l-3.443-6.3-7.73 5.069.141-9.37h-6.605l.07 9.37-7.73-5.069-3.373 6.3 7.659 4.608-7.659 4.532 3.373 6.3 7.73-5.069-.07 9.371h6.605l-.141-9.294 7.73 4.992 3.443-6.3-7.659-4.532zm31.9 0l-3.443-6.3-7.73 5.069.141-9.37h-6.605l.07 9.37-7.73-5.069-3.373 6.3 7.659 4.608-7.659 4.532 3.373 6.3 7.73-5.069-.07 9.371h6.605l-.141-9.294 7.73 4.992 3.443-6.3-7.659-4.532zm31.9 0l-3.443-6.3-7.73 5.069.141-9.37H1.381l.07 9.37-7.73-5.069-3.373 6.3 7.659 4.608-7.659 4.532 3.373 6.3 7.73-5.069-.07 9.371h6.606l-.141-9.294 7.73 4.992 3.443-6.3-7.659-4.532zm31.9 0l-3.443-6.3-7.73 5.069.141-9.37h-6.6l.07 9.37-7.73-5.069-3.373 6.3 7.659 4.608-7.659 4.532 3.373 6.3 7.73-5.069-.07 9.371h6.605l-.141-9.294 7.73 4.992 3.443-6.3-7.659-4.532z"
          opacity="0.4"
          transform="translate(110.767 175.157)"></Path>
        <Path
          id="Path_62212"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M68.188 71.48v-34.8s2.322-25.868 31.174-26.418 31.45 26.418 31.45 26.418v34.8"
          data-name="Path 62212"></Path>
      </G>
    </Svg>
  );
}
