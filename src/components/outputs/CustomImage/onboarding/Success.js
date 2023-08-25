import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const Success = props => {
  const { width = 150, height = 150, colors, primary, primaryContrast } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      {...props}>
      <Defs>
        <ClipPath id="prefix__a">
          <Path d="M0 0h200v200H0z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#prefix__a)" fill="none">
        <Path
          data-name="Path 62284"
          d="M70.315 102.907l21.642 21.687L138 75.407"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth={10}
        />
        <G data-name="Path 62285">
          <Path d="M100.5 13A87.5 87.5 0 1113 100.5 87.5 87.5 0 01100.5 13z" />
          <Path
            d="M100.5 23C57.766 23 23 57.766 23 100.5S57.766 178 100.5 178c17.297 0 34.221-5.816 47.655-16.378 11.707-9.204 20.464-21.303 25.324-34.989A77.89 77.89 0 00178 100.5c0-42.734-34.766-77.5-77.5-77.5m0-10c48.325 0 87.5 39.175 87.5 87.5 0 10.251-1.763 20.09-5.098 29.48-5.517 15.538-15.542 29.264-28.567 39.503C139.657 181.023 120.893 188 100.5 188 52.175 188 13 148.825 13 100.5S52.175 13 100.5 13z"
            fill="#fff"
          />
        </G>
      </G>
    </Svg>
  );
};

export default Success;
