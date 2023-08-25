import React from 'react';
import Svg, {
  Path,
  Defs,
  ClipPath,
  G,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';

export default function MobileVerify(props) {
  const { width = 150, height = 150, colors } = props;
  const { primary } = colors;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 500 500"
      {...props}>
      <Defs>
        <ClipPath id="clip-path">
          <Path
            id="Rectangle_26"
            fill="#fff"
            d="M0 0H500V500H0z"
            data-name="Rectangle 26"></Path>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path
            id="Rectangle_28"
            fill="#fff"
            stroke="#707070"
            strokeWidth="5"
            d="M0 0H500V500H0z"
            data-name="Rectangle 28"
            transform="translate(1935 165)"></Path>
        </ClipPath>
        <LinearGradient
          id="linear-gradient"
          x1="0.5"
          x2="0.448"
          y2="1.206"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0"></Stop>
          <Stop offset="1" stopColor="#fff"></Stop>
        </LinearGradient>
        <ClipPath id="clip-path-3">
          <Path
            id="Rectangle_121"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1.155"
            d="M0 0H315.845V413.83H0z"
            data-name="Rectangle 121"></Path>
        </ClipPath>
        <ClipPath id="clip-verify-mobile">
          <Path d="M0 0H500V500H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="verify-mobile" clipPath="url(#clip-verify-mobile)">
        <G
          id="Mask_Group_14"
          clipPath="url(#clip-path)"
          data-name="Mask Group 14">
          <G
            id="verify-mobile-2"
            clipPath="url(#clip-path-2)"
            data-name="verify-mobile"
            transform="translate(-1935 -165)">
            <G
              id="Group_5"
              data-name="Group 5"
              transform="translate(902.875 -247.96)">
              <G
                id="Group_4"
                data-name="Group 4"
                transform="translate(908.39 283.57)">
                <Path
                  id="Path_22"
                  fill="#cdd2d8"
                  d="M2605.9 3120.71a19.932 19.932 0 017.82-8.5l137.65-80.65a15.582 15.582 0 0111.29-2.71 15.178 15.178 0 016.075 2.709l-2.81 336.41a13.327 13.327 0 01-1.345 6.33 22.325 22.325 0 01-4.95 5.765l-145.7 86.685a42.288 42.288 0 01-7.815-4.555c-3.21-2.535-2.61-8.7-2.61-8.7l.405-319a36.2 36.2 0 011.995-13.79z"
                  data-name="Path 22"
                  transform="translate(-2424.18 -2899.105)"></Path>
                <Path
                  id="Path_19"
                  fill="#e1e9f2"
                  d="M2605.9 3120.71a19.932 19.932 0 017.82-8.5l137.65-80.65a16.579 16.579 0 0111.745-3.23c5.29 1.5 4 13.115 4 13.115l-1.185 326.5a13.325 13.325 0 01-1.345 6.33 22.307 22.307 0 01-4.949 5.765l-145.73 83.41a7.839 7.839 0 01-7.815 0c-3.2-2.535-2.585-9.975-2.585-9.975l.4-319a36.222 36.222 0 011.99-13.765z"
                  data-name="Path 19"
                  transform="translate(-2419.57 -2896.8)"></Path>
                <G id="Group_31" data-name="Group 31">
                  <Path
                    id="second"
                    fill="#80f1fa"
                    d="M2612 3126.125a23.755 23.755 0 018.56-7.635l127.9-73.575s6.81-4.315 9.88-2.68 2.4 9.22 2.4 9.22V3359.1a27.182 27.182 0 01-1.455 10.28 29.031 29.031 0 01-8.71 7.5l-129.22 74.4s-7.525 5.38-10.435 3.46-1.83-13.16-1.83-13.16v-304a26.087 26.087 0 012.91-11.455z"
                    transform="translate(-2419.57 -2896.8)"></Path>
                  <Path
                    id="gradient-overlay"
                    fill="url(#linear-gradient)"
                    d="M2612 3126.125a23.755 23.755 0 018.56-7.635l127.9-73.575s6.81-4.315 9.88-2.68 2.4 9.22 2.4 9.22V3359.1a27.182 27.182 0 01-1.455 10.28 29.031 29.031 0 01-8.71 7.5l-129.22 74.4s-7.525 5.38-10.435 3.46-1.83-13.16-1.83-13.16v-304a26.087 26.087 0 012.91-11.455z"
                    transform="translate(-2419.57 -2896.8)"></Path>
                </G>
                <Path
                  id="Path_21"
                  fill="#e1e9f2"
                  d="M2657.23 3095.035v5.385s.06 2 1.185 2.385 3.3-.9 3.3-.9l47.89-26.63a7.765 7.765 0 002.5-2.3 5.775 5.775 0 00.625-3.025v-7.125z"
                  data-name="Path 21"
                  transform="translate(-2419.57 -2896.8)"></Path>
              </G>
              <Path
                id="Path_4"
                fill="none"
                stroke="#5de058"
                strokeWidth="38.04"
                d="M1175.07 580.8l51.245 41.45 102.36-123.24"
                data-name="Path 4"></Path>
              <G
                id="Group_37"
                data-name="Group 37"
                transform="translate(1260.75 499.13)">
                <G id="Group_35" data-name="Group 35">
                  <Path
                    id="Path_130"
                    fill="#e3a976"
                    d="M10.671 8.3L.845 0l6.3 19.082S-3.075 38.6.93 41.365A8.5 8.5 0 0011.651 39.4a37 37 0 007.681-8.876 30.043 30.043 0 004.36-9.451 23.748 23.748 0 00-4.826-6.816 45.535 45.535 0 00-8.2-5.961z"
                    data-name="Path 130"
                    transform="rotate(53.989 -281.44 313.893)"></Path>
                  <Path
                    id="Path_364"
                    fill="#393939"
                    d="M.77 24.63s.27 6.33 3.29 2.625A28.2 28.2 0 009.72 16.6a16.93 16.93 0 00-.605-9.75A47.9 47.9 0 005.96 0a53.875 53.875 0 018.655 3.155c3.82 1.79 6.04 1.89 6.065 3.8a39 39 0 01-6.215 19.77c-4.265 7.745-9.55 9.8-12.745 9.42S.77 24.63.77 24.63z"
                    data-name="Path 364"
                    transform="rotate(70 -194.73 280.797)"></Path>
                  <Path
                    id="Path_130-2"
                    fill="#e3a976"
                    d="M14.567 8.646L2.66 0l9.571 18.192S-3.345 25.033.66 27.793a32.049 32.049 0 006.261 3.32 9 9 0 009.266-.475 34.6 34.6 0 0010.141-11.731s-.29-1.085-3.575-4.3a45.54 45.54 0 00-8.186-5.956z"
                    data-name="Path 130"
                    transform="rotate(53.989 -256.117 352.67)"></Path>
                  <Path
                    id="Path_364-2"
                    fill="#393939"
                    d="M5.88 12.5S4.44 20.73 7 20.245a12.845 12.845 0 006.8-8.565 33.615 33.615 0 00-.265-4.84A29.725 29.725 0 0112.4 0a88.808 88.808 0 018.43 3.79c3.82 1.79 3.345 1.6 3.365 3.5.14 6.055-2.455 5.04-6.725 12.785A12.585 12.585 0 013.135 25.47a3.445 3.445 0 01-3-4.47 26.875 26.875 0 015.745-8.5z"
                    data-name="Path 364"
                    transform="rotate(70 -168.441 307.383)"></Path>
                  <G id="Group_34" data-name="Group 34">
                    <G id="Group_33" data-name="Group 33">
                      <G
                        id="Mask_Group_1"
                        clipPath="url(#clip-path-3)"
                        data-name="Mask Group 1">
                        <G
                          id="Group_603"
                          data-name="Group 603"
                          transform="translate(-48.885 3.58)">
                          <G id="Group_604" data-name="Group 604">
                            <G
                              id="Group_146"
                              data-name="Group 146"
                              transform="rotate(-30.001 222.273 59.56)">
                              <Path
                                id="Path_126"
                                fill="#e3a976"
                                d="M36.334 3.15A53.209 53.209 0 0018.775 0 40.434 40.434 0 000 6l3.745 72.874 20.22 16.175z"
                                data-name="Path 126"
                                transform="rotate(31 -250.692 248.545)"></Path>
                              <Path
                                id="Path_127"
                                fill="#e3a976"
                                d="M22.5 16.6a155.267 155.267 0 0112.55 30.234 177.285 177.285 0 017 30C42.549 93.743 29 87.888 29 87.888l2.455-3.64S-2.575 16.68.155 4.4C3.43-10.32 22.5 16.6 22.5 16.6z"
                                data-name="Path 127"
                                transform="rotate(45.972 -231.637 187.115)"></Path>
                              <Path
                                id="Path_135"
                                fill="#e3a976"
                                d="M58.719 1.145L3.96 23.76C1.27 25.315-1.8 39.2 1.31 41.969s10.88-.2 14.19-.135c6.6.165 17.12-11.91 26.924-14.4 8.83-2.37 32.584-10.575 30.2-14.7C64.044-5.38 58.719 1.145 58.719 1.145z"
                                data-name="Path 135"
                                transform="rotate(-169 84.304 54.645)"></Path>
                              <Path
                                id="Path_125"
                                fill="#e3a976"
                                d="M65.448 2.34c-14.27-4.95-28-2.4-48.259 10.935s-3.3 35.414-3.3 35.414a99.043 99.043 0 013.06 25.389A121.857 121.857 0 010 130.592s74.283 38.114 76.5 2.725a83.223 83.223 0 00-.565-18c-2.64-17.5-25-21.239-13.065-64.038C67-1.185 80.273 7.375 65.448 2.34z"
                                data-name="Path 125"
                                transform="rotate(27 -43.967 331.816)"></Path>
                              <Path
                                id="Path_128"
                                fill="#e3a976"
                                d="M40.079 8.255c-1.875-21.145-1.23 5-10.34 5S0 20.6 0 20.6l17.29 75.063 18.5-1.96S41.959 29.4 40.079 8.255z"
                                data-name="Path 128"
                                transform="rotate(31 -247.493 315.806)"></Path>
                              <Path
                                id="Path_129"
                                fill="#e3a976"
                                d="M18.115 9.315C23.794 23.779 24 56.429 23.719 72.5c-.085 5.035 1.83 6.11-.23 8.425s-5.5 11.815-8.67.915S-3.26 29.529.65 6.625c.1-.595 10.03-16.215 17.465 2.69z"
                                data-name="Path 129"
                                transform="rotate(36 -334.617 281.488)"></Path>
                              <Path
                                id="Path_361"
                                fill="#e3a976"
                                d="M35.6 0s-8.1 6.27-8.89 12.4c0 .055-2.225 13.79-2.225 13.79L0 22.68S4.62 12.45 6.59 8.62A31.3 31.3 0 009.265.86z"
                                data-name="Path 361"
                                transform="rotate(7 -393.315 1404.764)"></Path>
                              <Path
                                id="Path_362"
                                d="M0 11.18l.565 4A25.5 25.5 0 008.4 10.95a97.038 97.038 0 0110.24-6.09L18.69 0z"
                                data-name="Path 362"
                                opacity="0.089"
                                transform="rotate(38 12.041 293.544)"></Path>
                              <Path
                                id="Path_360"
                                fill="#e3a976"
                                d="M25.072 0c15.3 0 27 10.5 27 28.342 0 13.921-14.536 32.8-26.652 36.883a9.5 9.5 0 01-8.571-.76C8.836 59 3.955 53.574 4.925 43.288c-.875-3.43-2.625-7.34-3.99-12.361A24.427 24.427 0 0125.072 0z"
                                data-name="Path 360"
                                transform="rotate(40 99.127 272.388)"></Path>
                              <Path
                                id="Path_134"
                                fill="#e3a976"
                                d="M30.444 8.12l-6.87 2.21s-7.865 4.665-12 1.06S-1.785 13.86.3 11.055A41.729 41.729 0 0113.285 4c2.285-.18-3.335-2.685-1.09-3.15A73.258 73.258 0 0127.754.125z"
                                data-name="Path 134"
                                transform="rotate(85 23.604 52.043)"></Path>
                              <Path
                                id="Path_136"
                                fill="#e3a976"
                                d="M56.275 11.264C48 5.135 30.458 3.5 30.458 3.5L2.435 0s-5.05 7.874-.6 8.794c0 0 38.382 18.429 52.211 19.113S64.565 17.4 56.275 11.264z"
                                data-name="Path 136"
                                transform="rotate(50 -15.084 103.373)"></Path>
                            </G>
                          </G>
                        </G>
                      </G>
                    </G>
                  </G>
                </G>
                <Path
                  id="primary"
                  fill={primary}
                  d="M88.435 7.31a37.84 37.84 0 00-5.88-1.6c-1.385 6.655-.7 11.61-8.925 17.775-9.3 6.975-5.765 2.845-12.135 3.5C48.935 28.235 55 3.305 51.5 0A57.625 57.625 0 0044 3.535C42 4.61 50.63 8.64 39.87 37.16c-2.63 6.97-1.845 16.24-1.96 26.18-.03 2.77-1 6.085-1.12 9.14C32.705 84.225 0 127.5 0 127.5a47.325 47.325 0 0027.66 19.255c19.225 3.585 49 11.705 60.37.67 3.435-3.33 20.34-3.8 20.34-3.8a50.785 50.785 0 01-10.2-20.215c-2.07-10.035-15.65-39.5-16.205-45.39 7.26-27.955 2.57-33.06.27-48.5a41.225 41.225 0 016.2-22.21z"
                  transform="rotate(-7.004 949.888 -603.431)"></Path>
                <G
                  id="Group_36"
                  fill="#5a2c1f"
                  data-name="Group 36"
                  transform="translate(108.095 17.725)">
                  <Path
                    id="Path_366"
                    d="M.285 15.311c-4.089 8.183 36.93 35.86 47.7 65.223 8.348 13.276 10-17.1 9.867-22.934-.272-10.688-14.409-47.438-22.736-54.046C22.464-6.5 4.369 7.143.285 15.311z"
                    data-name="Path 366"
                    transform="rotate(14.008 10.147 82.597)"></Path>
                  <Path
                    id="Path_367"
                    d="M26.038 131.513C6.107 103.3 18.291 73.965 19.031 64.969 19.8 55.709-7.676 11.46 2.109 5.218c12.164-7.752 27.847-8.018 42.73 7.176S74.1 67.6 73.421 97.954s13.9 27.9 16.077 48.607-.545 29.881-7.357 34.219c-11.645 7.432-15.428 6.322-31.485-6.672s-4.678-14.383-24.618-42.595z"
                    data-name="Path 367"
                    transform="rotate(6.03 -16.1 223.886)"></Path>
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
