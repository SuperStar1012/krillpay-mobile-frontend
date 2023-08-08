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

const SendToEmailPlaceholder = props => {
  const { width, colors } = props;
  const { primary, secondary, font, placeholderScreen } = colors;
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
          id="b"
          x1="0.832"
          x2="0.5"
          y1="0.18"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="c"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={primary} />
          <Stop offset="1" stopColor={primary} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={secondary} />
          <Stop offset="1" stopColor={secondary} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="e"
          x1="0.5"
          x2="0.448"
          y2="1.206"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#fff" stopOpacity="0" />
          <Stop offset="1" stopColor="#fff" />
        </LinearGradient>
        <Pattern
          id="f"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 141 190">
          {/* <Image
            width="141"
            height="190"
            xlinkHref="data:image/png;base64,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"
          /> */}
        </Pattern>
        <ClipPath id="g">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H274V359H0z"
            data-name="Rectangle 121"
            transform="translate(-2 -1)"
          />
        </ClipPath>
        <ClipPath id="h">
          <Ellipse
            cx="35.237"
            cy="24.662"
            fill="#ffd474"
            data-name="Ellipse 2"
            rx="35.237"
            ry="24.662"
            transform="translate(759.847 219.031)"
          />
        </ClipPath>
        <ClipPath id="a">
          <Path d="M0 0H900V900H0z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)" data-name="Send to email">
        <Path
          fill="#cdd2d8"
          d="M2260.638 2707.244a17.291 17.291 0 016.782-7.376l119.414-69.965s5.362-3.729 9.793-2.352 5.268 2.352 5.268 2.352l-2.439 291.837a11.561 11.561 0 01-1.168 5.49 19.369 19.369 0 01-4.294 5l-126.4 75.2a36.742 36.742 0 01-6.781-3.953c-2.785-2.2-2.263-7.543-2.263-7.543l.351-276.722s-.392-7.131 1.737-11.968z"
          data-name="Path 22"
          transform="translate(-2103 -2515)"
        />
        <Path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.196"
          transform="rotate(-60 1157.33 1681.797)"
        />
        <Path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          data-name="primary"
          transform="rotate(-60 1110.43 1657.03)"
        />
        <Path
          fill="url(#b)"
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.311"
          transform="rotate(-60 1110.43 1657.03)"
        />
        <Path
          d="M1001.354 609.251s-7.164-8.068 1.093-15.013 18.3-3.426 18.3-3.426l146.829 62.74s8.169 6.417 2.227 13.867-19.81 5.755-19.81 5.755z"
          data-name="Path 11"
          opacity="0.05"
          transform="rotate(-53.98 553.269 1414.266)"
        />
        <G data-name="Group 30" transform="translate(8 -4)">
          <Ellipse
            cx="65.5"
            cy="68"
            fill="url(#c)"
            data-name="primary"
            opacity="0.573"
            rx="65.5"
            ry="68"
            transform="translate(685 125)"
          />
          <G
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(368 334)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <Circle cx="17.5" cy="17.5" r="12.5" />
          </G>
          <G
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(78 176)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <Circle cx="17.5" cy="17.5" r="12.5" />
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
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <Circle cx="22.5" cy="22.5" r="17.5" />
          </G>
          <Ellipse
            cx="26"
            cy="27"
            fill="url(#d)"
            data-name="Ellipse 7"
            rx="26"
            ry="27"
            transform="rotate(68 40.374 801.98)"
          />
          <G
            fill="none"
            stroke={secondary}
            strokeWidth="10"
            data-name="Ellipse 5"
            opacity="0.779"
            transform="translate(231 687)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <Circle cx="22.5" cy="22.5" r="17.5" />
          </G>
          <G
            fill="none"
            stroke={secondary}
            strokeWidth="10"
            data-name="Ellipse 6"
            opacity="0.779"
            transform="translate(640 38)">
            <Circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <Circle cx="22.5" cy="22.5" r="17.5" />
          </G>
          <G
            fill="none"
            stroke={secondary}
            strokeWidth="10"
            data-name="Ellipse 10"
            opacity="0.25"
            transform="translate(276 32)">
            <Circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <Circle cx="17.5" cy="17.5" r="12.5" />
          </G>
        </G>
        <Path
          fill="#e1e9f2"
          d="M2260.638 2707.244a17.291 17.291 0 016.782-7.376l119.414-69.965s5.6-4.094 10.189-2.8 3.463 11.377 3.463 11.377l-1.03 283.257a11.561 11.561 0 01-1.168 5.49 19.369 19.369 0 01-4.294 5l-126.422 72.36s-4 2.2-6.781 0-2.242-8.652-2.242-8.652l.351-276.722s-.391-7.132 1.738-11.969z"
          data-name="Path 19"
          transform="translate(-2099 -2513)"
        />
        <G data-name="Group 31">
          <Path
            fill="#80f1fa"
            d="M2265.946 2711.94c2.488-4.137 7.424-6.622 7.424-6.622l110.954-63.826s5.907-3.743 8.571-2.323 2.083 8 2.083 8v266.89s.245 5.962-1.264 8.919-7.556 6.5-7.556 6.5l-112.1 64.54s-6.528 4.666-9.053 2.995-1.588-11.416-1.588-11.416v-263.73s.041-5.79 2.529-9.927z"
            transform="translate(-2099 -2513)"
          />
          <Path
            fill="url(#e)"
            d="M2265.946 2711.94c2.488-4.137 7.424-6.622 7.424-6.622l110.954-63.826s5.907-3.743 8.571-2.323 2.083 8 2.083 8v266.89s.245 5.962-1.264 8.919-7.556 6.5-7.556 6.5l-112.1 64.54s-6.528 4.666-9.053 2.995-1.588-11.416-1.588-11.416v-263.73s.041-5.79 2.529-9.927z"
            data-name="gradient-overlay"
            transform="translate(-2099 -2513)"
          />
        </G>
        <Path
          fill="#e1e9f2"
          d="M2305.171 2684.971v4.673s.053 1.746 1.027 2.069 2.868-.775 2.868-.775l41.545-23.1a6.737 6.737 0 002.156-2.005 5.005 5.005 0 00.541-2.625v-6.181z"
          data-name="Path 21"
          transform="translate(-2099 -2513)"
        />
        <Path
          fill={secondary}
          d="M2448.894 2706.646c-2.762 4.984-1.824 19.4-1.824 19.4v70.75s-.982 9.707 2.4 12.054 11.132-2.667 11.132-2.667L2577.639 2738s4.906-2.933 7.474-6.478 1.992-12.34 1.992-12.34v-76.033s.7-11.271-2.172-13.521-11.192 3.116-11.192 3.116l-114.113 65.064s-7.973 3.854-10.734 8.838z"
          data-name="Path 24"
          opacity="0.4"
          transform="translate(-2275 -2439)"
        />
        <Path
          fill={secondary}
          d="M2448.894 2706.646c-2.762 4.984-1.824 19.4-1.824 19.4v70.75s-.982 9.707 2.4 12.054 11.132-2.667 11.132-2.667L2577.639 2738s4.906-2.933 7.474-6.478 1.992-12.34 1.992-12.34v-76.033s.7-11.271-2.172-13.521-11.192 3.116-11.192 3.116l-114.113 65.064s-7.973 3.854-10.734 8.838z"
          data-name="Path 23"
          transform="translate(-2253 -2427)"
        />
        <Path
          fill="url(#f)"
          d="M0-10.846l115.1-67.7v93.753L0 84.77z"
          data-name="Path 25"
          transform="translate(215 286.164)"
        />
        <G data-name="Group 32" transform="translate(50 24)">
          <Path
            fill={secondary}
            d="M1528.388 264.662c5.885-5.023 14.731-1.03 14.731-1.03l154.535 74.422s18.3 5.074 19.359 17.983 2.352 33.631 2.352 33.631l6.2 88.688s2.858 13-4.975 19.246-17.1 1.2-17.1 1.2l-154.715-77c-2.4-1.934-8.313-3.032-12.394-9.355s-3.929-15.938-3.929-15.938l-8.252-118.051s-1.7-8.773 4.188-13.796z"
            data-name="primary"
            transform="rotate(4.01 2256.063 -14544.895)"
          />
          <Path
            fill="#fff"
            d="M1528.388 264.662a11.269 11.269 0 016.529-2.443 25.723 25.723 0 018.2 1.413l154.535 74.422a36.22 36.22 0 0113.779 7.62c2.632 2.442 6.547 9.236 4.842 10.1-44.494 12.14-106.476 43.2-106.476 43.2s-83.782-132-81.409-134.312z"
            opacity="0.75"
            transform="rotate(4.01 2256.063 -14544.895)"
          />
        </G>
        <Ellipse
          cx="43.23"
          cy="24.974"
          data-name="Ellipse 11"
          opacity="0.09"
          rx="43.23"
          ry="24.974"
          transform="rotate(177 185.925 311.992)"
        />
        <G data-name="Group 37">
          <G data-name="Group 35">
            <Path
              fill="#e3a976"
              d="M10.25 3.322l-8.526-7.2 5.464 16.549S-1.673 29.6 1.8 32c1.754 1.21 5.233 1.893 9.3-1.7 3.775-3.342 3.917-3.892 6.662-7.7a26.055 26.055 0 003.782-8.2 20.6 20.6 0 00-4.184-5.912 39.5 39.5 0 00-7.11-5.166z"
              data-name="Path 130"
              transform="rotate(53.98 -392.738 610.325)"
            />
            <Path
              fill="#393939"
              d="M-.713 19.553s.233 5.492 2.856 2.278c3.456-4.509 2.764-3.977 4.911-9.237.9-2.265.25-6.123-.525-8.464a41.554 41.554 0 00-2.74-5.944A46.737 46.737 0 0111.3.921c3.315 1.552 5.241 1.639 5.262 3.3.123 5.252-1.69 10.434-5.392 17.152s-8.285 8.5-11.06 8.168-.823-9.988-.823-9.988z"
              data-name="Path 364"
              transform="rotate(70 -247.146 526.913)"
            />
            <Path
              fill="#e3a976"
              d="M10.25 3.322L-.077-4.181l8.3 15.78s-13.51 5.932-10.037 8.327a27.8 27.8 0 005.433 2.881c2.528 1 5.817 1.553 8.035-.411 3.775-3.342 8.028-7.248 8.8-10.18 0 0-.25-.943-3.1-3.729a39.5 39.5 0 00-7.104-5.165z"
              data-name="Path 130"
              transform="rotate(53.98 -372.762 647.123)"
            />
            <Path
              fill="#393939"
              d="M-1.668 8.48s-1.25 7.137.964 6.713 6.167-5.571 5.909-7.428a29.163 29.163 0 00-.231-4.2 25.788 25.788 0 01-.984-5.933A77.041 77.041 0 0111.3.921c3.315 1.552 2.9 1.392 2.921 3.05.123 5.252-2.131 4.373-5.833 11.091-2.654 4.816-8.228 5.676-12.44 4.664-1.243-.3-3.2-1.061-2.609-3.873S-1.668 8.48-1.668 8.48z"
              data-name="Path 364"
              transform="rotate(70 -227.432 553.547)"
            />
            <G data-name="Group 34">
              <G data-name="Group 33" transform="translate(218 259)">
                <G clipPath="url(#g)" data-name="Mask Group 1">
                  <G
                    data-name="Group 603"
                    transform="translate(-53.062 -31.881)">
                    <G data-name="Group 604">
                      <G
                        data-name="Group 146"
                        transform="rotate(-30 237.569 63.668)">
                        <Path
                          fill="#e3a976"
                          d="M31.523 2.734A46.163 46.163 0 0016.289 0C8.055.018 0 5.212 0 5.212l3.247 63.214 17.541 14.035z"
                          data-name="Path 126"
                          transform="rotate(31 -239.666 226.609)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M19.507 14.4a134.7 134.7 0 0110.9 26.233c4.1 14.289 5.966 22.845 6.058 26.012.429 14.668-11.32 9.59-11.32 9.59l2.129-3.158S-2.233 14.471.135 3.82C2.974-8.952 19.507 14.4 19.507 14.4z"
                          data-name="Path 127"
                          transform="rotate(45.97 -215.025 171.763)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M54.246 23.4L6.74 43.018c-2.335 1.348-5 13.4-2.3 15.8s9.438-.176 12.307-.117c5.733.127 14.855-10.333 23.36-12.5 7.66-2.056 28.268-9.172 26.2-12.753C58.866 17.739 54.246 23.4 54.246 23.4z"
                          data-name="Path 135"
                          transform="rotate(-169 75.58 65.147)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M56.779 1.861C44.4-2.431 32.493-.222 14.913 11.347s-2.866 30.725-2.866 30.725A85.925 85.925 0 0114.7 64.1C13.744 91.974 0 113.124 0 113.124s64.445 33.066 66.379 2.366a72.2 72.2 0 00-.488-15.633C63.6 84.692 44.211 81.427 54.555 44.3 58.138-1.2 69.641 6.228 56.779 1.861z"
                          data-name="Path 125"
                          transform="rotate(27 -64.313 299.458)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M34.769 7.163C33.141-11.181 33.7 11.5 25.8 11.517S0 17.878 0 17.878L15 82.99l16.063-1.7S36.4 25.507 34.769 7.163z"
                          data-name="Path 128"
                          transform="rotate(31 -236.895 284.962)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M17.762 14.7c4.928 12.544 5.1 40.866 4.863 54.793-.074 4.366 1.586 5.3-.2 7.31s-4.761 10.249-7.521.792S-.78 32.233 2.613 12.367C2.7 11.851 11.315-1.7 17.762 14.7z"
                          data-name="Path 129"
                          transform="rotate(36.011 -297.8 254.75)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M28.741 0s-7.016 5.439-7.714 10.759c-.006.048-1.932 11.962-1.932 11.962l-21.241-3.046S1.864 10.8 3.57 7.476A27.154 27.154 0 005.89.744z"
                          data-name="Path 361"
                          transform="rotate(7 -447.275 1263.09)"
                        />
                        <Path
                          d="M0 9.693l.49 3.487a22.134 22.134 0 006.8-3.666 84.147 84.147 0 018.879-5.3L16.206 0z"
                          data-name="Path 362"
                          opacity="0.089"
                          transform="rotate(38 -7.173 264.766)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M21.4 0c13.268 0 23.43 9.1 23.43 24.582 0 12.075-12.607 28.451-23.119 31.99a8.261 8.261 0 01-7.435-.659C7.315 51.17 3.082 46.47 3.924 37.548 3.165 34.57 1.642 31.181.463 26.826-3.575 11.913 8.129 0 21.4 0z"
                          data-name="Path 360"
                          transform="rotate(40 69.257 246.775)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M28.09 22.392l-5.959 1.919s-6.825 4.047-10.408.918-11.593 2.139-9.78-.292c.892-1.2 9.111-5.989 11.264-6.139 1.981-.14-2.894-2.311-.949-2.716 5.274-1.123 13.5-.627 13.5-.627z"
                          data-name="Path 134"
                          transform="rotate(107 43.55 56.61)"
                        />
                        <Path
                          fill="#e3a976"
                          d="M49.344 10.225c-7.192-5.322-22.4-6.742-22.4-6.742L2.626.449S-1.753 7.284 2.1 8.082c0 0 33.3 15.988 45.305 16.586s9.131-9.122 1.939-14.443z"
                          data-name="Path 136"
                          transform="rotate(72 11.037 84.408)"
                        />
                      </G>
                    </G>
                  </G>
                </G>
              </G>
            </G>
          </G>
          <Path
            fill={primary}
            d="M76.645 5.659a32.8 32.8 0 00-5.095-1.381c-1.2 5.768-.609 10.06-7.737 15.407-8.058 6.045-5 2.465-10.516 3.018-10.884 1.089-5.647-20.518-8.678-23.38-1.144-.07-5.389 2.772-6.5 3.066-1.71.928 5.752 4.421-3.576 29.141-2.279 6.04-1.6 14.073-1.7 22.692-.028 2.4-.881 5.276-.972 7.923C28.345 72.322 0 109.84 0 109.84s8.958 13.886 23.971 16.687c16.661 3.109 42.455 10.146 52.322.58 2.978-2.888 17.629-3.292 17.629-3.292s-6.824-7.839-8.834-17.52c-1.8-8.693-13.568-34.248-14.05-39.34 6.29-24.228 2.225-28.652.234-42.045a35.731 35.731 0 015.371-19.25z"
            data-name="primary"
            transform="rotate(-7 3043.977 -2158.504)"
          />
          <G fill="#5a2c1f" data-name="Group 36" transform="translate(6 -1)">
            <Path
              d="M219.019 159.741c-3.544 7.086 32.045 31.121 41.389 56.6 7.245 11.52 8.691-14.839 8.563-19.9-.234-9.276-12.5-41.165-19.729-46.9-10.979-8.726-26.679 3.114-30.223 10.2z"
              data-name="Path 366"
              transform="rotate(14 -250.84 628.24)"
            />
            <Path
              d="M24.313 120.8c-17.294-24.473-6.719-49.906-6.076-57.71.663-8.049-23.168-46.434-14.681-51.845 10.552-6.728 24.161-6.962 37.068 6.221S66.005 65.355 65.417 91.7s12.055 24.2 13.946 42.163-.471 25.922-6.381 29.689c-10.1 6.449-13.385 5.485-27.32-5.787s-4.056-12.493-21.349-36.965z"
              data-name="Path 367"
              transform="rotate(6.02 -2403.402 3203.48)"
            />
          </G>
        </G>
        <G data-name="Group 21" transform="translate(22 -178)">
          <Path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 12"
            opacity="0.05"
            transform="rotate(6.02 -5338.434 4127.601)"
          />
          <G data-name="Group 12" transform="translate(-94 71)">
            <G data-name="Group 10" transform="rotate(6.02 -2772.608 -393.474)">
              <Path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"
              />
              <Ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"
              />
            </G>
            <G data-name="Group 11" transform="rotate(6.02 -2620.114 -397.116)">
              <Path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"
              />
              <Ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"
              />
            </G>
          </G>
          <G data-name="Group 13" transform="translate(-94 71)">
            <G data-name="Group 11" transform="rotate(6.02 -2620.114 -397.116)">
              <Path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"
              />
              <Ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"
              />
            </G>
          </G>
        </G>
        <G data-name="Group 20" transform="translate(12 -178)">
          <Path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 13"
            opacity="0.05"
            transform="rotate(14.98 -2433.023 2971.119)"
          />
          <G data-name="Group 9" transform="rotate(14 -1676.57 910.952)">
            <Path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"
            />
            <Ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"
            />
          </G>
        </G>
        <G data-name="Group 29" transform="rotate(-12.04 667.555 406.612)">
          <Path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 15"
            opacity="0.05"
            transform="rotate(14.98 -1977.23 2502.019)"
          />
          <G data-name="Group 8" transform="rotate(14 -1176.754 403.157)">
            <Path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"
            />
            <Ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default SendToEmailPlaceholder;
