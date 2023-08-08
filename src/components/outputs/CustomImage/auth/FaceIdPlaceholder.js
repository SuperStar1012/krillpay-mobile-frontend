import React from 'react';
import Svg, { Path, Defs, Circle, G, ClipPath } from 'react-native-svg';

const LocalAuthPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font } = colors;
  const h = 150;
  const w = 150;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 150 150">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H150V150H0z"
            data-name="Rectangle 444"
            transform="translate(113 78)"></Path>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path d="M0 0H150V150H0z" data-name="Rectangle 463"></Path>
        </ClipPath>
        <ClipPath id="clip-path-3">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="0.3"
            d="M0 0H129.6V132.3H0z"
            data-name="Rectangle 28"
            transform="translate(-.094)"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-path)" transform="translate(-113 -78)">
        <G clipPath="url(#clip-path-2)" transform="translate(113 78)">
          <G data-name="Group 41" transform="translate(-4.8 -14.7)">
            <G
              fill="none"
              stroke="#707070"
              strokeWidth="3"
              data-name="Group 40">
              <G data-name="Group 38" transform="translate(5.7 -2.4)">
                <Path d="M24.434 42.9H10.62v13.42" data-name="Path 36"></Path>
                <Path
                  d="M10.619 98.203v13.814h13.318"
                  data-name="Path 37"></Path>
              </G>
              <G data-name="Group 39" transform="translate(69.119 40.5)">
                <Path d="M.001 0h13.815v13.42" data-name="Path 36"></Path>
                <Path d="M13.816 55.303v13.815H.498" data-name="Path 37"></Path>
              </G>
            </G>
            <G
              fill="#fff"
              stroke={primary}
              strokeWidth="3"
              transform="translate(24.8 49.7)">
              <Circle cx="25" cy="25" r="25" stroke="none"></Circle>
              <Circle cx="25" cy="25" r="23.5" fill="none"></Circle>
            </G>
            <Path
              fill={primary}
              d="M4 0c2.209 0 4.866 1.791 4.866 4S6.209 3.072 4 3.072-.91 6.209-.91 4 1.791 0 4 0z"
              data-name="primary"
              transform="translate(34.822 68.7)"></Path>
            <Path
              fill={primary}
              d="M4 0c2.209 0 4.866 1.791 4.866 4S6.209 3.072 4 3.072-.91 6.209-.91 4 1.791 0 4 0z"
              data-name="primary"
              transform="translate(56.822 68.7)"></Path>
            <Path
              fill="none"
              stroke={primary}
              strokeLinecap="round"
              strokeWidth="3"
              d="M41.371 82.839a19.081 19.081 0 008.283 2.435 18.78 18.78 0 008.238-2.435"
              data-name="primary"></Path>
          </G>
          <G
            clipPath="url(#clip-path-3)"
            data-name="Mask Group 16"
            transform="translate(39.095 17.7)">
            <G transform="translate(.001)">
              <Path
                fill="#3c3b41"
                d="M95.075 60.212h-8.782V40.67a15.068 15.068 0 10-30.13 0v19.542h-8.782V40.67c0-13.423 10.7-24.344 23.847-24.344S95.076 27.245 95.076 40.67v19.542z"
                data-name="Path 39"
                transform="translate(-6.475 -1.937)"></Path>
              <Path
                fill="#171719"
                d="M75 16.326v8.964a15.242 15.242 0 0115.065 15.379v19.542h8.782V40.67C98.85 27.246 88.15 16.326 75 16.326z"
                data-name="Path 40"
                transform="translate(-10.249 -1.937)"></Path>
              <Path
                fill="#d5d5d5"
                d="M88.72 117.512H50.056a16.359 16.359 0 01-16.14-16.476v-32.73a7.864 7.864 0 017.759-7.92H97.1a7.864 7.864 0 017.759 7.92v32.73a16.359 16.359 0 01-16.139 16.476z"
                data-name="Path 41"
                transform="translate(-4.635 -7.163)"></Path>
              <Path
                fill="#959595"
                d="M102.714 60.385H75v57.128h19.333a16.359 16.359 0 0016.14-16.476V68.306a7.864 7.864 0 00-7.759-7.921z"
                data-name="Path 42"
                transform="translate(-10.249 -7.163)"></Path>
              <G
                fill="#272727"
                data-name="Group 42"
                transform="translate(43.221 75.916)">
                <Path
                  d="M60.78 89.6l-1.263-1.863-2.987 2.109v-3.712h-2.22v3.707l-2.987-2.109-1.262 1.868 3.408 2.4-3.407 2.41 1.263 1.863 2.987-2.109v3.707h2.22v-3.706l2.987 2.109 1.261-1.864L57.371 92z"
                  data-name="Path 43"
                  transform="translate(-50.062 -86.134)"></Path>
                <Path
                  d="M79.513 89.6l-1.263-1.863-2.986 2.109v-3.712h-2.22v3.707l-2.986-2.109-1.265 1.868L72.2 92l-3.406 2.41 1.263 1.863 2.986-2.109v3.707h2.22v-3.706l2.987 2.109 1.263-1.863L76.1 92z"
                  data-name="Path 44"
                  transform="translate(-52.621 -86.134)"></Path>
              </G>
              <G
                fill="#272727"
                data-name="Group 43"
                transform="translate(64.753 75.916)">
                <Path
                  d="M76.11 94.165l2.99 2.109 1.263-1.863L76.951 92l3.409-2.4-1.26-1.868-2.99 2.11v-3.708H75v11.738h1.11z"
                  data-name="Path 45"
                  transform="translate(-75.002 -86.134)"></Path>
                <Path
                  d="M98.245 89.6l-1.263-1.863L94 89.842v-3.708h-2.22v3.707l-2.986-2.109-1.269 1.868 3.409 2.4-3.408 2.41 1.263 1.863 2.986-2.109v3.707H94v-3.706l2.986 2.109 1.263-1.863L94.836 92z"
                  data-name="Path 46"
                  transform="translate(-76.713 -86.134)"></Path>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default LocalAuthPlaceholder;
