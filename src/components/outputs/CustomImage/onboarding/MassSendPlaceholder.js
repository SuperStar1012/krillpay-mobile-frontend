import React from 'react';
import Svg, {
  Path,
  Defs,
  ClipPath,
  G,
  Stop,
  LinearGradient,
  Ellipse,
  Circle,
  Pattern,
  Image,
} from 'react-native-svg';

const MassSendPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font, secondary, placeholderScreen } = colors;
  const h = 900;
  const w = 900;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/Svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 900 900">
      <Defs>
        <LinearGradient
          id="linear-gradient"
          x1="0.832"
          x2="0.5"
          y1="0.18"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff"></Stop>
          <Stop offset="1" stopColor="#fff" stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="linear-gradient-2"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={primary}></Stop>
          <Stop offset="1" stopColor={primary} stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="linear-gradient-3"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#80f1fa"></Stop>
          <Stop offset="1" stopColor="#80f1fa" stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="linear-gradient-4"
          x1="0.5"
          x2="0.552"
          y2="1.206"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0"></Stop>
          <Stop offset="1" stopColor="#fff"></Stop>
        </LinearGradient>
        <ClipPath id="clip-path">
          <Ellipse
            cx="35.237"
            cy="24.662"
            fill="#ffd474"
            data-name="Ellipse 2"
            rx="35.237"
            ry="24.662"
            transform="translate(759.847 219.031)"></Ellipse>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H274V359H0z"
            data-name="Rectangle 121"
            transform="translate(183 330)"></Path>
        </ClipPath>
        <ClipPath id="clip-Mass_send">
          <Path d="M0 0H900V900H0z"></Path>
        </ClipPath>
      </Defs>
      <G clip-path="url(#clip-Mass_send)" data-name="Mass send">
        <Path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.196"
          transform="rotate(-60 1157.33 1681.797)"></Path>
        <Path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          data-name="primary"
          transform="rotate(-60 1110.43 1657.03)"></Path>
        <Path
          fill="url(#linear-gradient)"
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.311"
          transform="rotate(-60 1110.43 1657.03)"></Path>
        <Path
          d="M1001.354 609.251s-7.164-8.068 1.093-15.013 18.3-3.426 18.3-3.426l146.829 62.74s8.169 6.417 2.227 13.867-19.81 5.755-19.81 5.755z"
          data-name="Path 11"
          opacity="0.05"
          transform="rotate(7 2011.273 -3286.017)"></Path>
        <G data-name="Group 30" transform="translate(8 -4)">
          <Ellipse
            cx="65.5"
            cy="68"
            fill="url(#linear-gradient-2)"
            data-name="primary"
            opacity="0.573"
            rx="65.5"
            ry="68"
            transform="translate(39 241)"></Ellipse>
          <G
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(764 291)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none"></Circle>
            <Circle cx="17.5" cy="17.5" r="12.5"></Circle>
          </G>
          <G
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(253 152)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none"></Circle>
            <Circle cx="17.5" cy="17.5" r="12.5"></Circle>
          </G>
        </G>
        <G>
          <G
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 9"
            opacity="0.544"
            transform="translate(102 732)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none"></Circle>
            <Circle cx="22.5" cy="22.5" r="17.5"></Circle>
          </G>
          <Ellipse
            cx="26"
            cy="27"
            fill="url(#linear-gradient-3)"
            data-name="Ellipse 7"
            rx="26"
            ry="27"
            transform="rotate(68 40.374 801.98)"></Ellipse>
          <G
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 5"
            opacity="0.779"
            transform="translate(231 687)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none"></Circle>
            <Circle cx="22.5" cy="22.5" r="17.5"></Circle>
          </G>
          <G
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 6"
            opacity="0.779"
            transform="translate(640 38)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none"></Circle>
            <Circle cx="22.5" cy="22.5" r="17.5"></Circle>
          </G>
          <G
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 10"
            opacity="0.25"
            transform="translate(276 32)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none"></Circle>
            <Circle cx="17.5" cy="17.5" r="12.5"></Circle>
          </G>
        </G>
        <G data-name="Group 38" transform="translate(530.511 90.245)">
          <Path
            fill="#cdd2d8"
            d="M2399.768 2707.244a17.291 17.291 0 00-6.782-7.376l-119.414-69.968s-5.362-3.729-9.793-2.352-5.268 2.352-5.268 2.352l2.439 291.837a11.561 11.561 0 001.168 5.49 19.369 19.369 0 004.294 5l126.4 75.2a36.742 36.742 0 006.781-3.953c2.785-2.2 2.263-7.543 2.263-7.543l-.351-276.722s.395-7.128-1.737-11.965z"
            data-name="Path 22"
            transform="translate(-2255.798 -2627.245)"></Path>
          <Path
            fill="#e1e9f2"
            d="M2398.478 2707.244a17.291 17.291 0 00-6.782-7.376l-119.414-69.968s-5.6-4.094-10.189-2.8-3.463 11.377-3.463 11.377l1.03 283.257a11.561 11.561 0 001.168 5.49 19.369 19.369 0 004.294 5l126.422 72.36s4 2.2 6.781 0 2.242-8.652 2.242-8.652l-.351-276.722s.391-7.129-1.738-11.966z"
            data-name="Path 19"
            transform="translate(-2258.507 -2625.245)"></Path>
          <G data-name="Group 31" transform="translate(5.577 13.603)">
            <Path
              fill="#80f1fa"
              d="M2392.333 2711.94c-2.488-4.137-7.424-6.622-7.424-6.622l-110.954-63.826s-5.907-3.743-8.571-2.323-2.083 8-2.083 8v266.89s-.245 5.962 1.264 8.919 7.556 6.5 7.556 6.5l112.1 64.54s6.528 4.666 9.053 2.995 1.588-11.416 1.588-11.416v-263.73s-.04-5.79-2.529-9.927z"
              transform="translate(-2263.248 -2638.848)"></Path>
            <Path
              fill="url(#linear-gradient-4)"
              d="M2392.333 2711.94c-2.488-4.137-7.424-6.622-7.424-6.622l-110.954-63.826s-5.907-3.743-8.571-2.323-2.083 8-2.083 8v266.89s-.245 5.962 1.264 8.919 7.556 6.5 7.556 6.5l112.1 64.54s6.528 4.666 9.053 2.995 1.588-11.416 1.588-11.416v-263.73s-.04-5.79-2.529-9.927z"
              data-name="gradient-overlay"
              transform="translate(-2263.248 -2638.848)"></Path>
          </G>
          <Path
            fill="#e1e9f2"
            d="M2353.32 2684.971v4.673s-.053 1.746-1.027 2.069-2.868-.775-2.868-.775l-41.545-23.1a6.737 6.737 0 01-2.156-2.005 5.005 5.005 0 01-.541-2.625v-6.181z"
            data-name="Path 21"
            transform="translate(-2257.882 -2625.245)"></Path>
        </G>
        <G data-name="Group 21" transform="translate(-251 -19)">
          <Path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 12"
            opacity="0.05"
            transform="rotate(6.02 -5338.434 4127.601)"></Path>
          <G data-name="Group 12" transform="translate(-94 71)">
            <G data-name="Group 10" transform="rotate(6.02 -2772.608 -393.474)">
              <Path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"></Path>
              <Ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"></Ellipse>
            </G>
            <G data-name="Group 11" transform="rotate(6.02 -2620.114 -397.116)">
              <Path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"></Path>
              <Ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"></Ellipse>
            </G>
          </G>
          <G data-name="Group 13" transform="translate(-94 71)">
            <G data-name="Group 11" transform="rotate(6.02 -2620.114 -397.116)">
              <Path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"></Path>
              <Ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"></Ellipse>
            </G>
          </G>
        </G>
        <G data-name="Group 20" transform="translate(12 -178)">
          <Path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 13"
            opacity="0.05"
            transform="rotate(14.98 -2433.023 2971.119)"></Path>
          <G data-name="Group 9" transform="rotate(14 -1676.57 910.952)">
            <Path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"></Path>
            <Ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"></Ellipse>
          </G>
        </G>
        <G data-name="Group 29" transform="rotate(-12.04 667.555 406.612)">
          <Path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 15"
            opacity="0.05"
            transform="rotate(14.98 -1977.23 2502.019)"></Path>
          <G data-name="Group 8" transform="rotate(14 -1176.754 403.157)">
            <Path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"></Path>
            <Ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"></Ellipse>
          </G>
        </G>
        <Path
          fill="#64e1ff"
          d="M2547.889 2684.055a6.855 6.855 0 011.509 5.215v32.051s.531 10.613-1.894 13.767-10.9-2.491-10.9-2.491l-82.621-45.041a21.742 21.742 0 01-5.538-3.478c-1.9-1.9-1.476-6.625-1.476-6.625v-40.821s-.519-6.051 1.609-7.259 8.294 1.673 8.294 1.673l80.778 46.408s8.192 3.926 10.239 6.601z"
          data-name="Path 29"
          opacity="0.4"
          transform="translate(-1831.774 -2349.422)"></Path>
        <Path
          fill="#64e1ff"
          d="M2547.889 2684.055a6.855 6.855 0 011.509 5.215v32.051s.531 10.613-1.894 13.767-10.9-2.491-10.9-2.491l-82.621-45.041a21.742 21.742 0 01-5.538-3.478c-1.9-1.9-1.476-6.625-1.476-6.625v-40.821s-.519-6.051 1.609-7.259 8.294 1.673 8.294 1.673l80.778 46.408s8.192 3.926 10.239 6.601z"
          data-name="Path 31"
          opacity="0.4"
          transform="translate(-1921.774 -2315.422)"></Path>
        <Path
          fill="#64e1ff"
          d="M2547.889 2684.055a6.855 6.855 0 011.509 5.215v32.051s.531 10.613-1.894 13.767-10.9-2.491-10.9-2.491l-82.621-45.041a21.742 21.742 0 01-5.538-3.478c-1.9-1.9-1.476-6.625-1.476-6.625v-40.821s-.519-6.051 1.609-7.259 8.294 1.673 8.294 1.673l80.778 46.408s8.192 3.926 10.239 6.601z"
          data-name="Path 28"
          transform="translate(-1853.774 -2354.422)"></Path>
        <Path
          fill="#64e1ff"
          d="M2547.889 2684.055a6.855 6.855 0 011.509 5.215v32.051s.531 10.613-1.894 13.767-10.9-2.491-10.9-2.491l-82.621-45.041a21.742 21.742 0 01-5.538-3.478c-1.9-1.9-1.476-6.625-1.476-6.625v-40.821s-.519-6.051 1.609-7.259 8.294 1.673 8.294 1.673l80.778 46.408s8.192 3.926 10.239 6.601z"
          data-name="Path 30"
          transform="translate(-1943.774 -2320.422)"></Path>
        <Path
          fill="#fff"
          d="M3672.4 2663.044v9.37l82.321 44.771v-9.061z"
          data-name="Path 35"
          opacity="0.573"
          transform="translate(-3069 -2370)"></Path>
        <Path
          fill="#fff"
          d="M3672.4 2663.044v9.37l82.321 44.771v-9.061z"
          data-name="Path 37"
          opacity="0.573"
          transform="translate(-3159 -2335)"></Path>
        <G data-name="Group 49">
          <Path
            fill="#64e1ff"
            d="M2547.889 2684.055a6.855 6.855 0 011.509 5.215v32.051s.531 10.613-1.894 13.767-10.9-2.491-10.9-2.491l-82.621-45.041a21.742 21.742 0 01-5.538-3.478c-1.9-1.9-1.476-6.625-1.476-6.625v-40.821s-.519-6.051 1.609-7.259 8.294 1.673 8.294 1.673l80.778 46.408s8.192 3.926 10.239 6.601z"
            data-name="Path 27"
            opacity="0.4"
            transform="translate(-1945.774 -2487.422)"></Path>
          <Path
            fill="#64e1ff"
            d="M2547.889 2684.055a6.855 6.855 0 011.509 5.215v32.051s.531 10.613-1.894 13.767-10.9-2.491-10.9-2.491l-82.621-45.041a21.742 21.742 0 01-5.538-3.478c-1.9-1.9-1.476-6.625-1.476-6.625v-40.821s-.519-6.051 1.609-7.259 8.294 1.673 8.294 1.673l80.778 46.408s8.192 3.926 10.239 6.601z"
            data-name="Path 26"
            transform="translate(-1967.774 -2492.422)"></Path>
          <Path
            fill="#fff"
            d="M3672.4 2663.044v9.37l82.321 44.771v-9.061z"
            data-name="Path 32"
            opacity="0.573"
            transform="translate(-3185 -2515)"></Path>
          <Path
            fill="#fff"
            d="M3672.4 2663.044v9.37l64.2 35.771v-10.162z"
            data-name="Path 33"
            opacity="0.573"
            transform="translate(-3185 -2496)"></Path>
        </G>
        <Path
          fill="#fff"
          d="M3672.4 2663.044v9.37l64.2 35.771v-10.162z"
          data-name="Path 34"
          opacity="0.573"
          transform="translate(-3069 -2351)"></Path>
        <Path
          fill="#fff"
          d="M3672.4 2663.044v9.37l64.2 35.771v-10.162z"
          data-name="Path 36"
          opacity="0.573"
          transform="translate(-3159 -2316)"></Path>
        <G data-name="Group 40">
          <Ellipse
            cx="21"
            cy="23"
            fill="#0cdb04"
            data-name="Ellipse 12"
            rx="21"
            ry="23"
            transform="rotate(-5.13 2736.475 -7288.84)"></Ellipse>
        </G>
        <G data-name="Group 39" transform="translate(-27 -16)">
          <Path
            fill="#0cdb04"
            d="M21 0c11.6 0 21 10.3 21 23s-9.4 23-21 23S0 35.7 0 23 9.4 0 21 0z"
            data-name="Path 416"
            transform="rotate(-5.13 3064.623 -5676.052)"></Path>
        </G>
        <G data-name="Group 41">
          <Path
            fill="#80f1fa"
            d="M114.086-6.7c63.37-3.429 188.429 78.159 169.127 149.069S214.579 246.558 135.6 246.558-6.862 231.566-6.862 154.522 50.717-3.268 114.086-6.7z"
            data-name="second"
            transform="translate(189.99 303.513)"></Path>
          <Path
            d="M114.086-6.7C150.65-8.676 103.462-.344 65.05 36.7c-28.111 27.108-42.929 72.03-38.443 104.638S44.569 192.6 59.77 206.059c49.177 43.549 151.09 36.485 89.52 40.076-42.252 0-85.716.176-115.636-15.627C8.1 217.011-6.862 190.348-6.862 154.522c0-77.043 57.579-157.79 120.948-161.222z"
            opacity="0.048"
            transform="translate(189.99 303.513)"></Path>
        </G>
        <G data-name="Group 27" transform="rotate(-12.04 296.4 -47.001)">
          <G
            clip-path="url(#clip-path-2)"
            data-name="Mask Group 1"
            transform="translate(-83 -82)">
            <G data-name="Group 603" transform="translate(129.969 298.136)">
              <G data-name="Group 604" transform="translate(-10 9)">
                <G
                  data-name="Group 146"
                  transform="rotate(-150 164.338 172.334)">
                  <Path
                    fill="#5a2c1f"
                    d="M8.977 43.211c-17.294 24.473.747 56.551-4.991 75.179s-7.211 35.444 8.924 45.731c10.552 6.728 20.369 7.358 36.043-3.757s15.42-47.921 35.82-69.073S117.935 9.672 90.219 2.66 45.122 5.209 20.582 1 26.27 18.737 8.977 43.211z"
                    data-name="Path 367"
                    transform="rotate(-36.011 315.477 -15.513)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M31.523 79.727a46.163 46.163 0 01-15.233 2.734C8.055 82.443 0 77.249 0 77.249l3.247-63.214L20.788 0z"
                    data-name="Path 126"
                    transform="rotate(-69 111.93 63.086)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M19.507 63.258a134.7 134.7 0 0010.9-26.233c4.1-14.289 5.966-22.845 6.058-26.012.429-14.668-6-10.451-6-10.451l-3.19 4.019S-2.233 63.187.136 73.838c2.838 12.772 19.371-10.58 19.371-10.58z"
                    data-name="Path 127"
                    transform="rotate(-62.03 75.92 87.268)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M53.99 49.389L17.567 18.827c-3.3-2.771-4.112-7.243-1.809-9.988l3.51-2.374c2.3-2.745 9.322.015 20.49 7.866s25.018 22.617 25.018 22.617c3.3 2.771 18 5.249 16.126 7.066L64.14 49.436c-2.303 2.745-6.848 2.724-10.15-.047z"
                    data-name="Path 132"
                    transform="rotate(-122 148.91 121.768)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M67.483 62.957L17.732 18.049c-2.066-1.733-2.876-7.952.2-9.853s9.264 1.812 12.1 2.252c5.668.871 9.608 9.252 17.607 12.866a51.6 51.6 0 0118.975 14.752c2.478 2.073 13.078 4.72 10.42 7.888-10.051 14.178-9.551 17.003-9.551 17.003z"
                    data-name="Path 135"
                    transform="scale(-1) rotate(-23 -701.809 498.088)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M59.853 122.551c-12.374 4.292-22.414 5.369-35.346 3.3-12.544-2.069-8.653 2.882-19.532-25.947-3.014-7.986 10.1-24.61 9.725-35.458C13.744 36.574 0 15.423 0 15.423s64.445-33.066 66.379-2.366a72.2 72.2 0 01-.488 15.633C63.6 43.856 45.376 46.617 55.721 83.746c3.579 45.501 16.994 34.438 4.132 38.805z"
                    data-name="Path 125"
                    transform="rotate(-27 332.762 -75.58)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M34.769 76.363C33.141 94.708 33.7 72.029 25.8 72.01S0 65.648 0 65.648L13.369 0l17.7 2.233s5.331 55.786 3.7 74.13z"
                    data-name="Path 128"
                    transform="rotate(-72 108.444 38.952)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M37.917 12.925c16.369 5.6 50.286 36.4 50.286 36.4l-4.049 6.124s-46.042-14.1-58.485-29.067-4.124-19.059 12.248-13.457z"
                    data-name="Path 129"
                    transform="scale(-1) rotate(23 309.888 -233.028)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M28.741 22.721s-7.016-5.439-7.714-10.759C21.021 11.914 19.1 0 19.1 0L0 8.106s1.864 3.818 3.57 7.139a27.154 27.154 0 012.32 6.731z"
                    data-name="Path 361"
                    transform="rotate(-7 1994.807 -1073.79)"></Path>
                  <Path
                    d="M0 4.381L.375.593a7.062 7.062 0 017.512 1.19 80.721 80.721 0 018.277 9.222l.041 5.1z"
                    data-name="Path 362"
                    opacity="0.089"
                    transform="rotate(-39 424.444 -86.683)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M21.4 57.126c13.269 0 23.431-9.1 23.431-24.582S24.11-5.488 14.277 1.212 3.287 13.608.463 30.3 8.129 57.126 21.4 57.126z"
                    data-name="Path 360"
                    transform="matrix(.92 -.391 .391 .92 138.39 254.191)"></Path>
                  <Path
                    fill={primary}
                    d="M77 127.663a36.651 36.651 0 01-5.354 1.573c-1.2-5.768-5.835-10.813-12.963-16.161-8.058-6.045-11.5-3.364-17.02-3.917-10.884-1.089-1.481 18.676-4.513 21.538a17.108 17.108 0 01-4.244-.785c-1.71-.928.917-.682-8.411-25.4-3.015-7.989 7.745-23.281 7.372-34.133C28.345 60.2 0 22.682 0 22.682S7.514 9.544 22.527 6.744c16.66-3.109 36.108-18.362 45.975-8.8 2.978 2.892 34.082 7.682 34.082 7.682s-13.522 11.222-15.532 20.9C85.417 34.4 73.18 50.037 70.91 58.137c-.145.51.175 6.953.13 7.431 6.29 24.228 2.225 28.652.234 42.045A38.838 38.838 0 0077 127.663z"
                    data-name="primary"
                    transform="rotate(-24 362.682 -57.2)"></Path>
                  <G
                    data-name="Group 42"
                    transform="rotate(-12.04 238.844 271.479)">
                    <Path
                      fill="#e3a976"
                      d="M15.112 32.887L0 34.734l8.3-11.915S-1.628 2.788 1.845.392C3.6-.818 7.033.846 11.1 4.444c3.775 3.342 3.917 3.892 6.662 7.7a26.055 26.055 0 013.782 8.2z"
                      data-name="Path 130"
                      transform="rotate(-59 32.52 18.352)"></Path>
                    <Path
                      fill="#393939"
                      d="M.094 10.608S-.48 5.532 2.142 8.745a63.876 63.876 0 018.442 14.718c2.18 5.458.279 7.114.279 7.114a6.742 6.742 0 004.965-6.42c.123-5.252-.933-8.155-4.635-14.872S4.886-.305 2.112.026.094 10.608.094 10.608z"
                      data-name="Path 364"
                      transform="rotate(-74.991 24.097 18.487)"></Path>
                  </G>
                  <Path
                    fill="#e3a976"
                    d="M7.274 4.737l-9.465 18.552c-7.526 11.978-4.847 8.567.06 14.826 1.855 2.365 6.1-4.96 6.1-4.96l12.905-13.41c1.932-1.5 4.58-8.968-.33-15.224-1.853-2.367-7.338-1.287-9.27.216z"
                    data-name="Path 133"
                    transform="rotate(-154 100.436 136.076)"></Path>
                  <Path
                    fill="#e3a976"
                    d="M20.634 11.347c-8.7 2.088-19.562 12.825-19.562 12.825l-17.938 15.957s1.718 8.894 4.805 6.455c0 0 34.338-15.658 42.512-24.468s-1.119-12.858-9.817-10.769z"
                    data-name="Path 136"
                    transform="rotate(-2 6284.523 -5543.05)"></Path>
                  <G
                    data-name="Group 43"
                    transform="rotate(-12.04 120.25 149.993)">
                    <Path
                      fill="#e3a976"
                      d="M15.112 32.887L0 34.734l8.3-11.915S-1.628 2.788 1.845.392C3.6-.818 7.033.846 11.1 4.444c3.775 3.342 3.917 3.892 6.662 7.7a26.055 26.055 0 013.782 8.2z"
                      data-name="Path 130"
                      transform="rotate(-59 32.52 18.352)"></Path>
                    <Path
                      fill="#393939"
                      d="M.094 10.608S-.48 5.532 2.142 8.745a63.876 63.876 0 018.442 14.718c2.18 5.458.279 7.114.279 7.114a6.742 6.742 0 004.965-6.42c.123-5.252-.933-8.155-4.635-14.872S4.886-.305 2.112.026.094 10.608.094 10.608z"
                      data-name="Path 364"
                      transform="rotate(-74.991 24.097 18.487)"></Path>
                  </G>
                </G>
                <Path
                  fill="#5a2c1f"
                  d="M268.783 158.889c3.544 6.387-28.987 11.13-38.331 34.094-7.245 10.383-9.593 10.779-9.465 6.217.234-8.36 5.559-38.987 12.784-44.159 10.98-7.861 31.468-2.541 35.012 3.848z"
                  data-name="Path 366"
                  transform="translate(-40.896 -97.861)"></Path>
              </G>
            </G>
          </G>
        </G>
        <Path
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          d="M658.517 230l7.587 7.244 10.94-14.528"
          data-name="Path 414"></Path>
        <Path
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          d="M491.152 249l9.165 7.5 10.391-13.813"
          data-name="Path 415"></Path>
      </G>
    </Svg>
  );
};

export default MassSendPlaceholder;
