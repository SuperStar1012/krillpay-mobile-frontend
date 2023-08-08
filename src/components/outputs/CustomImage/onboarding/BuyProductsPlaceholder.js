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
} from 'react-native-svg';

const BuyProductsPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font, secondary, placeholderScreen } = colors;
  const h = 900;
  const w = 900;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 900 900">
      <Defs>
        <LinearGradient
          id="b"
          x1="0.832"
          x2="0.5"
          y1="0.18"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff"></Stop>
          <Stop offset="1" stopColor="#fff" stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="c"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={primary}></Stop>
          <Stop offset="1" stopColor={primary} stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="d"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={secondary}></Stop>
          <Stop offset="1" stopColor={secondary} stopOpacity="0"></Stop>
        </LinearGradient>
        <LinearGradient
          id="e"
          x1="0.5"
          x2="0.448"
          y2="1.206"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0"></Stop>
          <Stop offset="1" stopColor="#fff"></Stop>
        </LinearGradient>
        <ClipPath id="f">
          <Ellipse
            cx="35.237"
            cy="24.662"
            fill="#ffd474"
            data-name="Ellipse 2"
            rx="35.237"
            ry="24.662"
            transform="translate(759.847 219.031)"></Ellipse>
        </ClipPath>
        <ClipPath id="g">
          <Path
            fill="#fff"
            stroke={font}
            strokeWidth="1"
            d="M0 0H274V359H0z"
            data-name="Rectangle 121"></Path>
        </ClipPath>
        <ClipPath id="h">
          <Path
            fill="#fff"
            stroke={font}
            strokeWidth="1"
            d="M0 0H29V31H0z"
            data-name="Rectangle 19"
            transform="translate(24 330)"></Path>
        </ClipPath>
        <ClipPath id="a">
          <Path d="M0 0H900V900H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)" data-name="Buy products">
        <Path
          fill="#cdd2d8"
          d="M2260.638 2707.244a17.291 17.291 0 016.782-7.376l119.414-69.965s5.362-3.729 9.793-2.352 5.268 2.352 5.268 2.352l-2.439 291.837a11.561 11.561 0 01-1.168 5.49 19.369 19.369 0 01-4.294 5l-126.4 75.2a36.742 36.742 0 01-6.781-3.953c-2.785-2.2-2.263-7.543-2.263-7.543l.351-276.722s-.392-7.131 1.737-11.968z"
          data-name="Path 22"
          transform="translate(-2103 -2515)"></Path>
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
          fill="url(#b)"
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.311"
          transform="rotate(-60 1110.43 1657.03)"></Path>
        <Path
          d="M1001.354 609.251s-7.164-8.068 1.093-15.013 18.3-3.426 18.3-3.426l146.829 62.74s8.169 6.417 2.227 13.867-19.81 5.755-19.81 5.755z"
          data-name="Path 11"
          opacity="0.05"
          transform="rotate(-53.98 553.269 1414.266)"></Path>
        <G data-name="Group 30" transform="translate(8 -4)">
          <Ellipse
            cx="65.5"
            cy="68"
            fill="url(#c)"
            data-name="primary"
            opacity="0.573"
            rx="65.5"
            ry="68"
            transform="translate(707 126)"></Ellipse>
          <G
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(368 334)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none"></Circle>
            <Circle cx="17.5" cy="17.5" r="12.5"></Circle>
          </G>
          <G
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(78 176)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none"></Circle>
            <Circle cx="17.5" cy="17.5" r="12.5"></Circle>
          </G>
        </G>
        <G>
          <G
            fill="none"
            stroke={secondary}
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
            fill="url(#d)"
            data-name="Ellipse 7"
            rx="26"
            ry="27"
            transform="rotate(68 40.374 801.98)"></Ellipse>
          <G
            fill="none"
            stroke={secondary}
            strokeWidth="10"
            data-name="Ellipse 5"
            opacity="0.779"
            transform="translate(231 687)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none"></Circle>
            <Circle cx="22.5" cy="22.5" r="17.5"></Circle>
          </G>
          <G
            fill="none"
            stroke={secondary}
            strokeWidth="10"
            data-name="Ellipse 6"
            opacity="0.779"
            transform="translate(640 38)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none"></Circle>
            <Circle cx="22.5" cy="22.5" r="17.5"></Circle>
          </G>
          <G
            fill="none"
            stroke={secondary}
            strokeWidth="10"
            data-name="Ellipse 10"
            opacity="0.25"
            transform="translate(276 32)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none"></Circle>
            <Circle cx="17.5" cy="17.5" r="12.5"></Circle>
          </G>
        </G>
        <Path
          fill="#e1e9f2"
          d="M2260.638 2707.244a17.291 17.291 0 016.782-7.376l119.414-69.965s5.6-4.094 10.189-2.8 3.463 11.377 3.463 11.377l-1.03 283.257a11.561 11.561 0 01-1.168 5.49 19.369 19.369 0 01-4.294 5l-126.422 72.36s-4 2.2-6.781 0-2.242-8.652-2.242-8.652l.351-276.722s-.391-7.132 1.738-11.969z"
          data-name="Path 19"
          transform="translate(-2099 -2513)"></Path>
        <G data-name="Group 31">
          <Path
            fill={placeholderScreen}
            d="M2265.946 2711.94c2.488-4.137 7.424-6.622 7.424-6.622l110.954-63.826s5.907-3.743 8.571-2.323 2.083 8 2.083 8v266.89s.245 5.962-1.264 8.919-7.556 6.5-7.556 6.5l-112.1 64.54s-6.528 4.666-9.053 2.995-1.588-11.416-1.588-11.416v-263.73s.041-5.79 2.529-9.927z"
            transform="translate(-2099 -2513)"></Path>
          <Path
            fill="url(#e)"
            d="M2265.946 2711.94c2.488-4.137 7.424-6.622 7.424-6.622l110.954-63.826s5.907-3.743 8.571-2.323 2.083 8 2.083 8v266.89s.245 5.962-1.264 8.919-7.556 6.5-7.556 6.5l-112.1 64.54s-6.528 4.666-9.053 2.995-1.588-11.416-1.588-11.416v-263.73s.041-5.79 2.529-9.927z"
            data-name="gradient-overlay"
            transform="translate(-2099 -2513)"></Path>
        </G>
        <Path
          fill="#e1e9f2"
          d="M2305.171 2684.971v4.673s.053 1.746 1.027 2.069 2.868-.775 2.868-.775l41.545-23.1a6.737 6.737 0 002.156-2.005 5.005 5.005 0 00.541-2.625v-6.181z"
          data-name="Path 21"
          transform="translate(-2099 -2513)"></Path>
        <G data-name="Group 32" transform="translate(48 -4)">
          <Path
            fill="#dee1e5"
            d="M1528.388 264.662c5.885-5.023 14.731-1.03 14.731-1.03l154.535 74.422s18.3 5.074 19.359 17.983 2.352 33.631 2.352 33.631l6.2 88.688s2.858 13-4.975 19.246-17.1 1.2-17.1 1.2l-154.715-77c-2.4-1.934-8.313-3.032-12.394-9.355s-3.929-15.938-3.929-15.938l-8.252-118.051s-1.7-8.773 4.188-13.796z"
            data-name="primary"
            transform="rotate(4.01 2256.063 -14544.895)"></Path>
        </G>
        <Ellipse
          cx="43.23"
          cy="24.974"
          data-name="Ellipse 11"
          opacity="0.09"
          rx="43.23"
          ry="24.974"
          transform="rotate(177 290.569 309.228)"></Ellipse>
        <G data-name="Group 21" transform="translate(22 -178)">
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
          <G
            clipPath="url(#f)"
            data-name="Mask Group 4"
            transform="rotate(30 -202.997 341.993)">
            <G data-name="bitcoin (2)" transform="translate(781.208 229.054)">
              <G data-name="Group 19">
                <G data-name="Group 18">
                  <Path
                    fill="#fdbb25"
                    d="M23.351 13.19c2.29-.93 3.528-2.791 3.1-4.657-.53-2.882-5.3-3.97-9.065-4.2V0h-3.709v4.295h-2.492V0h-3.71v4.295H0v2.768h2.783c1.246 0 1.855.267 1.855.993v11.891c0 .993-.689 1.3-1.431 1.3H.371v2.823H7.58v4.39h3.737v-4.39h2.491v4.39h3.632v-4.39h.8c7.633 0 10.178-2.691 10.178-6.356-.066-2.161-2.146-4.02-5.067-4.524zM11.185 7.234h2.65c1.855 0 5.513.229 5.513 2.405.127 1.42-1.3 2.665-3.26 2.844h-4.9l-.003-5.249zm4.108 13.743v-.019h-4.108v-5.726h4.771c1.113 0 5.3.267 5.3 2.405s-1.987 3.341-5.963 3.341z"
                    data-name="Path 18"></Path>
                </G>
              </G>
            </G>
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
          fill={primary}
          d="M5502.691 2771.159s5.75 9.28 16.467 7.161 10.039-11.479 10.039-11.479 9.593-4.682 16.84 1.439a79.982 79.982 0 0110.341 10.041l-2.6 25.536-7.736-3.678v63.5l-51.567 20.588v-70.608l-4.133 6.439-15.964-19.918s3.053-3.9 9.954-16.633 18.359-12.388 18.359-12.388z"
          data-name="Path 51"
          transform="translate(-5279.754 -2543)"></Path>
        <G data-name="Group 51">
          <Ellipse
            cx="7"
            cy="9"
            fill={primary}
            data-name="Ellipse 14"
            rx="7"
            ry="9"
            transform="translate(203 393)"></Ellipse>
          <Ellipse
            cx="7"
            cy="9"
            fill="#fff"
            data-name="Ellipse 15"
            rx="7"
            ry="9"
            transform="translate(240 377)"></Ellipse>
          <Ellipse
            cx="7"
            cy="9"
            fill="#fff"
            data-name="Ellipse 16"
            rx="7"
            ry="9"
            transform="translate(271 365)"></Ellipse>
        </G>
        <G data-name="Group 49" transform="translate(78.143 286.653)">
          <Path
            fill={placeholderScreen}
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            opacity="0.4"
            transform="translate(7)"></Path>
          <Path
            fill={placeholderScreen}
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            transform="translate(22)"></Path>
          <Path
            fill="#fff"
            d="M3754.723 2663.044v9.37l-82.32 44.771v-9.061z"
            data-name="Path 32"
            opacity="0.573"
            transform="translate(-3638.439 -2651.653)"></Path>
          <Path
            fill="#fff"
            d="M3736.6 2663.044v9.37l-64.2 35.771v-10.162z"
            data-name="Path 33"
            opacity="0.573"
            transform="translate(-3638.316 -2624.653)"></Path>
        </G>
        <G data-name="Group 50" transform="translate(252.143 170.653)">
          <Path
            fill="#fff"
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            opacity="0.482"
            transform="translate(7)"></Path>
          <Path
            fill="#fff"
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            transform="translate(22)"></Path>
          <Path
            fill="#869db7"
            d="M3754.723 2663.044v9.37l-82.32 44.771v-9.061z"
            data-name="Path 32"
            opacity="0.573"
            transform="translate(-3638.439 -2651.653)"></Path>
          <Path
            fill="#869db7"
            d="M3736.6 2663.044v9.37l-64.2 35.771v-10.162z"
            data-name="Path 33"
            opacity="0.573"
            transform="translate(-3638.316 -2624.653)"></Path>
        </G>
        <Path
          fill="#fff"
          d="M159.577 95.738V79.169L0 0v16.022z"
          data-name="Path 52"
          opacity="0.573"
          transform="rotate(2 -5726.894 15892.483)"></Path>
        <Path
          fill="#fff"
          d="M91.515 64.353l-.633-18.13L0 0v16.022z"
          data-name="Path 53"
          opacity="0.573"
          transform="rotate(2 -6758.114 15910.483)"></Path>
        <G data-name="Group 52" transform="translate(403 246)">
          <G data-name="Group 35">
            <Path
              fill="#e3a976"
              d="M9.257 29.645l-8.526 7.2L6.2 20.3S-2.666 3.367.807.972c1.754-1.21 5.233-1.893 9.3 1.7 3.775 3.342 3.917 3.892 6.662 7.7a26.055 26.055 0 013.782 8.2 20.6 20.6 0 01-4.181 5.906 39.5 39.5 0 01-7.113 5.167z"
              data-name="Path 130"
              transform="rotate(126.02 7.666 212.57)"></Path>
            <Path
              fill="#393939"
              d="M.665 10.023S.9 4.531 3.521 7.745c3.456 4.509 2.764 3.977 4.911 9.237.9 2.265.25 6.123-.525 8.464a41.554 41.554 0 01-2.74 5.944 46.737 46.737 0 007.514-2.735c3.315-1.552 5.241-1.639 5.262-3.3.123-5.252-1.69-10.434-5.392-17.152S4.265-.293 1.49.038s-.825 9.985-.825 9.985z"
              data-name="Path 364"
              transform="rotate(110 -22.577 229.91)"></Path>
            <Path
              fill="#e3a976"
              d="M12.634 20.391l-10.327 7.5 8.3-15.78S-2.9 6.182.571 3.786A27.8 27.8 0 016 .906c2.528-1 5.817-1.553 8.035.411 3.775 3.342 8.028 7.248 8.8 10.18 0 0-.25.943-3.1 3.729a39.5 39.5 0 01-7.101 5.165z"
              data-name="Path 130"
              transform="rotate(126.02 -9.002 198.933)"></Path>
            <Path
              fill="#393939"
              d="M5.1 11.622s-1.25-7.137.964-6.713 6.167 5.571 5.908 7.429a29.163 29.163 0 01-.231 4.2 25.788 25.788 0 00-.984 5.932 77.041 77.041 0 007.312-3.289c3.315-1.552 2.9-1.392 2.921-3.05.123-5.252-2.131-4.373-5.833-11.091C12.505.224 6.931-.635 2.719.376 1.476.673-.486 1.437.11 4.249s4.99 7.373 4.99 7.373z"
              data-name="Path 364"
              transform="rotate(110 -39.198 212.082)"></Path>
            <G data-name="Group 34">
              <G data-name="Group 33">
                <G clipPath="url(#g)" data-name="Mask Group 1">
                  <G data-name="Group 603" transform="translate(-7.987 3.104)">
                    <G data-name="Group 604">
                      <G
                        data-name="Group 146"
                        transform="rotate(-150 137.083 153.617)">
                        <Path
                          fill="#e3a976"
                          d="M31.523 79.727a46.163 46.163 0 01-15.233 2.734C8.055 82.443 0 77.249 0 77.249l3.247-63.214L20.788 0z"
                          data-name="Path 126"
                          transform="rotate(-31 158.166 -28.982)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M19.507 62.685a134.7 134.7 0 0010.9-26.233c4.1-14.289 5.966-22.845 6.058-26.012C36.894-4.228 25.146.85 25.146.85l2.129 3.158S-2.233 62.613.135 73.264c2.839 12.772 19.372-10.579 19.372-10.579z"
                          data-name="Path 127"
                          transform="rotate(-45.97 50.972 21.622)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M50.944 36.452L3.438 16.831c-2.335-1.348-5-13.4-2.3-15.8s9.438.176 12.307.117c5.733-.127 14.855 10.333 23.36 12.5C44.46 15.7 65.068 22.82 63 26.4c-7.436 15.71-12.056 10.052-12.056 10.052z"
                          data-name="Path 135"
                          transform="rotate(169 60.939 116.72)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M56.779 126.686c-12.374 4.292-24.286 2.083-41.866-9.486s-2.866-30.725-2.866-30.725a85.925 85.925 0 002.653-22.03C13.744 36.573 0 15.423 0 15.423s64.445-33.066 66.379-2.366a72.2 72.2 0 01-.488 15.633C63.6 43.856 44.211 47.12 54.555 84.249c3.583 45.501 15.086 38.07 2.224 42.437z"
                          data-name="Path 125"
                          transform="rotate(-27 299.44 -78.092)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M34.769 75.827c-1.628 18.345-1.069-4.334-8.969-4.353S0 65.112 0 65.112L15 0l14.036.245s7.364 57.238 5.733 75.582z"
                          data-name="Path 128"
                          transform="rotate(-31 160.983 -75.735)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M13.412 67.956c7.431-12.677 8.043-38.11 7.805-52.037-.074-4.366.449-7.364-1.339-9.375S15.613-5 12.853 4.453-2.829 49.811.563 69.677c.089.517 6.403 14.68 12.849-1.721z"
                          data-name="Path 129"
                          transform="rotate(-36.011 41.515 -51.316)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M30.886 22.721s-7.016-5.439-7.714-10.759C23.167 11.914 21.241 0 21.241 0L0 3.045s4.01 8.878 5.715 12.2a27.154 27.154 0 012.321 6.732z"
                          data-name="Path 361"
                          transform="rotate(-7 1850.427 -1061.918)"></Path>
                        <Path
                          d="M0 3.487L.49 0a22.134 22.134 0 016.8 3.666 84.148 84.148 0 008.879 5.3l.041 4.215z"
                          data-name="Path 362"
                          opacity="0.089"
                          transform="rotate(-38 413.421 -102.8)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M21.746 57.144c13.269 0 23.431-9.1 23.431-24.582 0-12.075-12.607-28.451-23.119-31.99a8.261 8.261 0 00-7.435.659C7.662 5.974 3.429 10.675 4.271 19.6 3.512 22.574 1.988 25.963.81 30.318c-4.038 14.914 7.666 26.826 20.936 26.826z"
                          data-name="Path 360"
                          transform="rotate(-40 407.036 -62.4)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M26.41 4.024L20.451 2.1s-6.825-4.047-10.408-.918S-1.55-.953.264 1.479c.892 1.2 9.111 5.989 11.264 6.139 1.981.14-2.894 2.311-.949 2.716 5.274 1.123 13.5.627 13.5.627z"
                          data-name="Path 134"
                          transform="rotate(-107 144.094 108.802)"></Path>
                        <Path
                          fill="#e3a976"
                          d="M48.83 14.469c-7.192 5.322-22.4 6.742-22.4 6.742L2.112 24.246s-4.379-6.836-.526-7.633c0 0 33.3-15.988 45.305-16.586s9.131 9.122 1.939 14.442z"
                          data-name="Path 136"
                          transform="rotate(-72 201.617 81.217)"></Path>
                      </G>
                    </G>
                  </G>
                </G>
              </G>
            </G>
          </G>
          <Path
            fill={primary}
            d="M76.645 126.288a32.8 32.8 0 01-5.095 1.381c-1.2-5.768-.609-10.06-7.737-15.407-8.058-6.045-5-2.465-10.516-3.018-10.884-1.089-5.648 20.518-8.679 23.38-1.144.07-5.389-2.772-6.5-3.066-1.71-.928 5.752-4.421-3.576-29.141-2.279-6.04-1.6-14.073-1.7-22.692-.028-2.4-.881-5.276-.972-7.923C28.345 59.624 0 22.107 0 22.107S8.958 8.221 23.971 5.42c16.661-3.109 42.455-10.146 52.323-.58 2.978 2.888 17.629 3.292 17.629 3.292s-6.824 7.839-8.834 17.52c-1.8 8.693-13.568 34.248-14.05 39.34 6.29 24.228 2.225 28.652.234 42.045a35.731 35.731 0 005.371 19.25z"
            data-name="primary"
            transform="scale(-1) rotate(7 1769.74 -1648.16)"></Path>
          <G
            fill="#5a2c1f"
            data-name="Group 36"
            transform="translate(82.054 15.375)">
            <Path
              d="M-2.133 53.8c.292-13.178 34.424-25.432 43.768-50.911 7.245-11.52 8.691 14.839 8.563 19.9-.234 9.276-12.5 41.165-19.729 46.9C19.491 78.41-2.424 66.974-2.133 53.8z"
              data-name="Path 366"
              transform="rotate(166 44.752 41.331)"></Path>
            <Path
              d="M76.6 90.919c-27.214 12.548-30.772 39.861-34.117 46.94-3.452 7.3-43.28 28.628-38.635 37.557 5.774 11.1 17.443 18.11 35.212 13.146s45.925-28.782 58.589-51.893 22.54-14.931 33.159-29.542 12.553-22.685 9.319-28.9c-5.524-10.636-8.849-11.442-26.553-8.648s-9.759 8.791-36.974 21.34z"
              data-name="Path 367"
              transform="rotate(143.989 67.505 103.134)"></Path>
          </G>
        </G>
        <G data-name="Group 53" transform="translate(-270 110)">
          <G data-name="shopping bag" transform="translate(0 1)">
            <Path
              fill={secondary}
              d="M3599.553 2943.589h58.347l20.445 87.625h-92.018z"
              data-name="Path 399"
              transform="translate(-2912.435 -2390)"></Path>
            <Path
              fill="none"
              stroke={secondary}
              strokeWidth="4"
              d="M731.336 554.527s.066-14.173-14.268-13.895-15.334 13.895-15.334 13.895"
              data-name="Path 401"></Path>
          </G>
          <Circle
            cx="24.5"
            cy="24.5"
            r="24.5"
            fill="#fff"
            data-name="Ellipse 88"
            transform="translate(692 575)"></Circle>
          <G
            clipPath="url(#h)"
            data-name="Mask Group 9"
            transform="translate(678 254)">
            <G transform="translate(24 329.535)">
              <Path fill="none" d="M0 0h20v20H0z" data-name="Path 16"></Path>
              <Path
                fill={secondary}
                d="M19.744 16.469a2.575 2.575 0 002.274-1.386l4.653-8.733a1.341 1.341 0 00-1.131-1.992H6.3L5.083 1.667H.833v2.691h2.6l4.678 10.213-1.754 3.284a2.7 2.7 0 002.274 4h15.6V19.16h-15.6l1.43-2.691zM7.54 7.049h15.791l-3.587 6.728H10.62zM8.631 23.2a2.693 2.693 0 000 5.383 2.693 2.693 0 000-5.383zm13 0a2.693 2.693 0 102.6 2.691 2.643 2.643 0 00-2.603-2.691z"
                data-name="Path 17"></Path>
            </G>
          </G>
        </G>
        <G data-name="Group 54" transform="translate(-336 -158)">
          <G data-name="shopping bag" transform="translate(0 1)">
            <Path
              fill={secondary}
              d="M3599.553 2943.589h58.347l20.445 87.625h-92.018z"
              data-name="Path 399"
              transform="translate(-2912.435 -2390)"></Path>
            <Path
              fill="none"
              stroke={secondary}
              strokeWidth="4"
              d="M731.336 554.527s.066-14.173-14.268-13.895-15.334 13.895-15.334 13.895"
              data-name="Path 401"></Path>
          </G>
          <Circle
            cx="24.5"
            cy="24.5"
            r="24.5"
            fill="#fff"
            data-name="Ellipse 88"
            transform="translate(692 575)"></Circle>
          <G
            clipPath="url(#h)"
            data-name="Mask Group 9"
            transform="translate(678 254)">
            <G data-name="shopping_cart-24px" transform="translate(24 329.535)">
              <Path fill="none" d="M0 0h20v20H0z" data-name="Path 16"></Path>
              <Path
                fill={secondary}
                d="M19.744 16.469a2.575 2.575 0 002.274-1.386l4.653-8.733a1.341 1.341 0 00-1.131-1.992H6.3L5.083 1.667H.833v2.691h2.6l4.678 10.213-1.754 3.284a2.7 2.7 0 002.274 4h15.6V19.16h-15.6l1.43-2.691zM7.54 7.049h15.791l-3.587 6.728H10.62zM8.631 23.2a2.693 2.693 0 000 5.383 2.693 2.693 0 000-5.383zm13 0a2.693 2.693 0 102.6 2.691 2.643 2.643 0 00-2.603-2.691z"
                data-name="Path 17"></Path>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default BuyProductsPlaceholder;
