import React from 'react';
import Svg, {
  Path,
  Defs,
  ClipPath,
  G,
  Stop,
  Rect,
  LinearGradient,
} from 'react-native-svg';

export default function Referral(props) {
  const { width = 100, height, colors } = props;
  const { primary } = colors;
  const h = 333;
  const w = 555;
  // width="555"
  // height="333"
  return (
    <Svg height={100} width={500} viewBox="0 0 555 333">
      <Defs>
        <LinearGradient
          id="linear-gradient"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor="#03194a"></Stop>
          <Stop offset="1" stopColor="#9c9ecc"></Stop>
        </LinearGradient>
        <ClipPath id="clip-Refer">
          <Path d="M0 0H555V333H0z"></Path>
        </ClipPath>
      </Defs>
      <G ClipPath="url(#clip-Refer)">
        <Path
          fill="#020d88"
          d="M360.259 5871.241s-34.97-74.965 10.213-130.447 102.361-43.97 204.537-91.479 98.413-111.9 213.271-107.7 102.692 206.1 79.106 281.955-68.135 47.673-68.135 47.673z"
          data-name="Path 62302"
          opacity="0.05"
          transform="translate(-336.018 -5532.806)"></Path>
        <G data-name="Group 1518" transform="translate(-27 -6060.481)">
          <G transform="translate(39.469 6133.613)">
            <Path
              fill="#0a0f4d"
              d="M2.8 72.9c-2.8 40.319 12.748 66.625 3.454 91.088s-10.312 44.308.805 58.7 37.415 18.07 56.6 1.385 15.039-54.027 46.594-82.225 45-76.626 16.314-100.264S-7.552-14.565 16.436 6.938 5.6 32.588 2.8 72.9z"
              transform="rotate(164.991 86.077 129.799)"></Path>
            <Path
              fill="#d5d6e2"
              stroke="#020d88"
              strokeWidth="2"
              d="M76.229 241.885l11.755-40.663s-.466-8.366-3.944-29.8-18.034-48.679-9.97-55.934c4.761-4.284 11.5-5.7 16.673-7.572a126.907 126.907 0 0012.211-5.146V66.882h25.113v35.967a109.662 109.662 0 0013.071 5.067c7.041 2.164 14.617 3.083 19.038 7.572 9.589 9.739-7.748 38.6-10.243 50.355s-3.977 35.378-3.977 35.378l15.723 36.684s-13.779 6.074-36.105 6.729q-1.768.017-3.534.017a380.746 380.746 0 01-45.811-2.766z"
              data-name="Union 16"></Path>
            <G transform="translate(102.953 66.884)">
              <Path
                fill="#020d88"
                d="M19.79 25.861c-4.977-.552-11-4.482-15.126-8.927A35.33 35.33 0 010 10.677V0h25.112v23.5a4.325 4.325 0 01-4.239 2.423 9.79 9.79 0 01-1.083-.062z"
                data-name="Intersection 2"
                opacity="0.2"
                transform="translate(0 8.652)"></Path>
            </G>
            <G transform="rotate(-7 249.504 -683.923)">
              <Path
                fill="#d5d6e2"
                stroke="#020d88"
                strokeWidth="2"
                d="M35.647 77.22c-9.164-.121-21.242-9.584-28.409-25.515-1.943-1.886-4.831-5.007-5.868-7.769-1.618-4.311-.189-7.29 1.277-7.751.078-.008.157-.015.236-.02C1.564 21.58 8.428 10.117 13.221 7.137c5.856-3.642 18.893-9.644 29.429-3.9s18.414 12.8 16.626 31.2c-1.784 18.35-13.4 42.783-23.546 42.786z"
                data-name="Union 15"></Path>
              <Path
                fill="none"
                stroke="#020d88"
                strokeWidth="1.908"
                d="M29.568 40.245l-.59-.59c-.41-.43-3.886-3.29-6.681-3.03a43 43 0 00-7.732 1.79"
                data-name="Path 7"></Path>
              <Path
                fill="none"
                stroke="#020d88"
                strokeWidth="1.91"
                d="M41.39 41.024s2.898-3.51 5.852-3.198a31.11 31.11 0 017.21 2.184"
                data-name="Path 8"></Path>
              <Path
                fill="#020d88"
                d="M1.978-.018c1.076-.016 2.91 1 2.89 2.42a2.361 2.361 0 01-.538 1.711 2.314 2.314 0 01-1.573.834A2.656 2.656 0 01-.01 2.585 2.411 2.411 0 011.978-.018z"
                data-name="Path 9"
                transform="rotate(-24.003 99.803 -30.209)"></Path>
              <Path
                fill="#020d88"
                d="M1.8-.012c.988-.011 2.678.988 2.664 2.384A2.274 2.274 0 014 4.014a2.185 2.185 0 01-1.463.832 2.515 2.515 0 01-2.553-2.32C0 1.135.812 0 1.8-.012z"
                data-name="Path 1638"
                transform="rotate(-13 189.828 -182.407)"></Path>
              <Path
                fill="#0a0f4d"
                d="M19.08 2.21l.094 3.019A25.148 25.148 0 009.82 1.763 24.87 24.87 0 00-.006 3.457 12.864 12.864 0 017.961-.014 34.379 34.379 0 0119.08 2.21z"
                data-name="Path 11"
                transform="rotate(2.007 -819.03 365.558)"></Path>
              <Path
                fill="#0a0f4d"
                d="M15.217 2.7l-.038-2.733a31.021 31.021 0 01-9.063 2.5A8.7 8.7 0 010 .294a9.384 9.384 0 006.141 4.118A21.272 21.272 0 0015.217 2.7z"
                data-name="Path 4019"
                transform="rotate(-179.026 28.695 17.327)"></Path>
              <Path
                fill="#020d88"
                d="M11.591.334c-.287.02-1.186.042-2 .009C8.24.323 8.389.446 5.99.36S0 0 0 0s4.568 6.6 9.563 7.146 7.383-5.97 7.383-5.97a18.424 18.424 0 00-5.355-.842z"
                data-name="Path 13"
                transform="rotate(-.974 3491.706 -1553.207)"></Path>
            </G>
            <Path
              fill="#4896d9"
              d="M201.382 510.034a182.22 182.22 0 0039.868 3.449c19.366-.891 31.738-6.84 31.738-6.84l12.179 27.377s-17.649 40.206-41.766 42.9-44.8 6.584-55.933-10.242 13.914-56.644 13.914-56.644z"
              transform="translate(-117.837 -285.114)"></Path>
            <Path
              fill={primary}
              d="M230.941 342.756a126.209 126.209 0 01-12.447 5.307c-5.176 1.893-11.911 3.321-16.673 7.641-8.064 7.318 6.491 34.814 9.969 56.441s3.944 30.067 3.944 30.067l-13.914 40.012s26.366 9.8 48.694 9.137 38.808-16.477 38.808-16.477l-15.61-32.672s1.483-23.841 3.978-35.7 17.9-23.222 16.433-38.078-11.217-19.289-22.309-21.346a85.939 85.939 0 01-16.406-4.326s.909 12.779-10.644 12.949-13.823-12.955-13.823-12.955z"
              transform="translate(-127.752 -240.1)"></Path>
            <G transform="rotate(-7 119.305 -682.82)">
              <Path
                fill="#0a0f4d"
                d="M-425.5-5546.118c-.763-4.388-3.219-9.319 2.564-20.709s13.449-12.579 13.449-12.579l.047.13c3.968-5.246 13.567-9.457 24.265-5.712 11.394 3.989 15.445 10.859 18.967 25.132a33.908 33.908 0 01-3.054 24.673s-2.9-1.734-16.036-18.319-20.828-14.277-20.828-14.277l-.2-.4c-2.367 2.256-10.359 10.222-12.883 17.246a24.682 24.682 0 00-.063 15.8s-5.469-6.596-6.228-10.985z"
                data-name="Union 14"
                transform="translate(426.573 5596.672)"></Path>
            </G>
            <G fill={primary} transform="rotate(87 52.958 170.227)">
              <Path
                d="M-.718 71.311l13.59-69.795A17.878 17.878 0 0027.514-.276c18.019 3.989 20.067 8.883 20.067 8.883L13.832 88.651z"
                data-name="primary"
                opacity="0.998"
                transform="scale(-1) rotate(43.01 104.92 -93.046)"></Path>
              <Path
                d="M.26 5.155c-2.005 11 6.01 21.732 29.987 32.006S54.61 48.529 54.61 48.529l9.536-8.411S46.612 23.97 31.992 13.232 2.268-5.843.26 5.155z"
                data-name="primary"
                transform="rotate(15.009 -39.76 323.918)"></Path>
            </G>
            <G transform="rotate(177 68.07 130.921)">
              <Path
                fill={primary}
                d="M.168 16.463l18.619 65.173s9.867 18.529 17.473 23.078c9.683 5.788 20.809 3.838 19.377-8.422-2.448-20.954-28.489-69.34-42.356-89.3S.168 16.463.168 16.463z"
                data-name="primary"
                opacity="0.998"
                transform="rotate(44.028 7.006 135.78)"></Path>
              <Path
                fill={primary}
                d="M.75 45.2C-1.5 33.343 6.963 21.855 32.481 11.027S54.9.536 54.9.536l5.677 6.817a104.256 104.256 0 01-23.126 22.7C21.934 41.472 3 57.059.75 45.2z"
                data-name="primary"
                transform="scale(-1) rotate(39 72.944 -140.49)"></Path>
              <Path
                fill="#d5d6e2"
                stroke="#020d88"
                strokeWidth="2"
                d="M31.875 32.953A123.278 123.278 0 0019.01 29.3c-5.752-1.183-6.86.859-10.144-1.085-4.31-2.55-9.545-8.38-8.76-2.584.215.048-.516.318 6.388 11.104s24.01 5.445 24.01 5.445z"
                data-name="Path 1643"></Path>
            </G>
          </G>
        </G>
        <G data-name="Group 1517" transform="translate(191 39.718)">
          <G transform="translate(9.788)">
            <Path
              fill="#9c9ecc"
              stroke="#020d88"
              strokeWidth="2"
              d="M92.981 221.09a2.531 2.531 0 01-.612-.247l-.06-.047c-.655.195-1.045.28-1.046.28-13.869-8.89-40.637-47.881-45.922-55.7L32.09 154.435s-7.678-10.294-6.347-15.688 10.616-13.782 14.746-6.87 6.616 18.19 6.616 18.19-.923-8.226.479-7.932c.441.092 1.237.955 2.122 2.094.281-4.09.935-8.174 2.649-8.145 1.13-1.6 2.808 19.608 2.808 19.608l-.223.386.507 2.962c9.328 8.2 31.628 27.259 43.271 37.195 2.868-4.488 5.372-7.743 5.372-7.743l55.75-62.842s11.372-10.734 25.128 1.56c0 0 10.754 11.241-.47 27.816 0 0-39.333 37.292-62.555 53.688-15.276 10.78-23.253 12.621-26.923 12.621a7.312 7.312 0 01-2.039-.245z"
              data-name="Union 19"></Path>
            <G transform="rotate(14 -297.616 173.686)">
              <G transform="rotate(179.026 18.662 38.248)">
                <G fill="#e4e6fc" data-name="Rectangle 1134">
                  <Path
                    d="M3.448 48.295h-.003a2.578 2.578 0 01-1.831-.772 2.923 2.923 0 01-.846-2.088l.046-41.75C.816 2.104 2.023.815 3.504.815L20.727.792a2.58 2.58 0 011.834.773c.547.547.847 1.288.846 2.088l-.046 41.75c-.002 1.58-1.208 2.869-2.69 2.87l-17.223.021z"
                    transform="rotate(-19.01 23.035 3.8)"></Path>
                  <Path
                    fill="#0c266a"
                    d="M20.728 1.61l-17.223.02c-1.032.002-1.873.924-1.874 2.056l-.046 41.75c0 .58.215 1.117.607 1.51.343.343.788.533 1.255.533l17.223-.021c1.032-.001 1.873-.923 1.874-2.055l.046-41.75c.001-.581-.214-1.117-.606-1.51a1.767 1.767 0 00-1.254-.533h-.002m.002-1.633c1.932 0 3.496 1.646 3.494 3.678l-.046 41.75c-.003 2.033-1.572 3.684-3.506 3.686l-17.223.021h-.004c-1.932 0-3.496-1.646-3.494-3.678l.047-41.75C0 1.651 1.569 0 3.503-.002l17.223-.021h.004z"
                    transform="rotate(-19.01 23.035 3.8)"></Path>
                </G>
                <Path
                  fill="#020d88"
                  d="M8.98-8.789H6.15v-3.065h-2.1v3.065H1.24v2.2h2.813v3.065h2.1V-6.59H8.98zM9.744-14v2.344h2.276v10.277h2.634V-14z"
                  data-name="Path 62305"
                  transform="scale(-1) rotate(-19.01 -63.333 64.39)"></Path>
              </G>
            </G>
            <Path
              fill={primary}
              d="M.082 33.924l25.988 35.09s14.9-8.726 15.99-18.286C44.4 30.219 32.966-1.346 23.589.108 10.038 2.209.082 33.924.082 33.924z"
              data-name="primary"
              transform="rotate(13 -434.074 694.952)"></Path>
            <Path
              fill="#9c9ecc"
              stroke="#020d88"
              strokeWidth="2"
              d="M164.496 272.432l2.925-36.787-5.08-51.149-4.472-45.033s-9.442-13.731 33.991-38.882a46.244 46.244 0 001.206-27.546l28.593-1.011.905 26.137h.57l38.314 26.719c-2.568 9.215-3.01 21.18-5.579 30.4-4.745 16.987-3.78 33.959-8.667 50.9 0 0-2.116 14.136-1.331 22.611-.064 3.208 7.606 43.211 5.72 43.641-.008 0-26.51 5.7-52.312 5.7-12.9.005-25.627-1.421-34.783-5.7z"
              data-name="Union 17"></Path>
            <G
              data-name="neck"
              transform="scale(-1) rotate(-2 -3058.844 6313.262)">
              <Path
                fill="#020d88"
                d="M15.133 2.267C20.488.3 24.088-.754 27.652.6c.847.3-1.7 9.692 1.049 17.028l-28.608.011L0 12.5C3.563 7.3 9.777 4.234 15.133 2.267z"
                opacity="0.3"
                transform="translate(-.005 13.547)"></Path>
            </G>
            <Path
              fill={primary}
              d="M906.023 321.368c-.068 3.208 8.135 43.211 6.118 43.641-.014 0-63.775 12.835-93.146 0l3.129-36.787-5.434-51.149-4.783-45.032s-13.662-14.257 38.011-40.95c0 0 1.622 19.195 15.431 18.36s15.614-19.983 15.614-19.983l44.306 28.384c-2.747 9.215-5.815 20.787-8.556 30.006-5.074 16.987-4.042 33.959-9.269 50.9.008 0-2.26 14.136-1.421 22.61z"
              data-name="primary"
              transform="translate(-658.29 -92.576)"></Path>
            <G transform="translate(154.53 123.211)">
              <Path
                fill="#9c9ecc"
                stroke="#020d88"
                strokeWidth="1.633"
                d="M38.13 135.867l-12.3 1.329S-.211 130.277.797 127.527c.6-1.646 4.508-1.235 9.25-.824a52.977 52.977 0 009.93.207c7.938-.863 7.867-2.086 7.867-2.086s-7.762-2.631-6.905-3.793 15.049-1.584 15.049-1.584l7.73 4.63c9.8-2.223 29.117-7.771 44.971-9.839a127.92 127.92 0 0118.532-1.179 50.7 50.7 0 01-2.621-9.312L84.432 22.925C84.985 2.846 100.221.144 100.221.144c18.273-1.771 21.234 13.672 21.234 13.672s17.74 119.968 2.27 123.431a2.582 2.582 0 01-1.106.005c-5.561 1.376-14.628 1.873-24.837 1.873-23.61-.003-53.295-2.662-59.652-3.258z"
                data-name="Union 20"></Path>
            </G>
            <Path
              fill="#9c9ecc"
              stroke="#020d88"
              strokeWidth="2"
              d="M177.178 41.748c-.854-18.989 7.921-25.821 19.451-31.17s25.05 1.5 31.076 5.547c5.122 3.44 12.362 17.87 9.174 32.748a9.563 9.563 0 01.2 4.385c-.475 2.925-3.821 6.918-6.134 9.382-8.4 14.133-19.843 23.673-31.147 23.874h-.167c-12.719-.002-21.604-25.858-22.453-44.766z"
              data-name="Union 18"></Path>
            <G data-name="face" transform="rotate(4.992 18.69 2065.41)">
              <Path
                fill="#ac6f4c"
                d="M5.039 0L.006 14.982"
                data-name="Path 6"
                transform="rotate(-3 797.477 -298.974)"></Path>
              <Path
                fill="none"
                stroke="#020d88"
                strokeLinecap="round"
                strokeWidth="1.306"
                d="M30.847 44.256l.55-.637a8.711 8.711 0 015.691-3.111 40.2 40.2 0 018.427 1.413"
                data-name="Path 7"></Path>
              <Path
                fill="none"
                stroke="#020d88"
                strokeLinecap="round"
                strokeWidth="1.306"
                d="M18.271 44.244s-2.545-3.757-5.55-3.76a32.083 32.083 0 00-7.485 1.393"
                data-name="Path 8"></Path>
              <Path
                fill="#020d88"
                d="M2.564 5.159a2.916 2.916 0 002.642-2.878A2.435 2.435 0 004.352.58 2.387 2.387 0 002.545.025 2.534 2.534 0 00.009 2.583a2.579 2.579 0 002.555 2.576z"
                data-name="Path 9"
                transform="rotate(-164.991 23.067 20.259)"></Path>
              <Path
                fill="#020d88"
                d="M2.564 5.159a2.916 2.916 0 002.642-2.878A2.435 2.435 0 004.352.58 2.387 2.387 0 002.545.025 2.534 2.534 0 00.009 2.583a2.579 2.579 0 002.555 2.576z"
                data-name="Path 1666"
                transform="rotate(-164.991 10.366 22.19)"></Path>
              <Path
                fill="#031439"
                d="M16.5.647l-.334 2.784S11.588 2.812 7.6 2.354A16.878 16.878 0 000 3.424 8.178 8.178 0 016.232.016 72.266 72.266 0 0116.5.647z"
                data-name="Path 12"
                transform="rotate(4.012 -455.565 58.85)"></Path>
              <Path
                fill="#031439"
                d="M15.944 9.031l.923-2.974s-5.04-1.144-9.392-2.214A19.53 19.53 0 010 0a8.345 8.345 0 005.072 5.5c4.261 1.738 10.872 3.531 10.872 3.531z"
                data-name="Path 34"
                transform="rotate(151.001 18.97 22.952)"></Path>
              <Path
                fill="#020d88"
                d="M6.157.025a14.955 14.955 0 001.6 0c1.369-.024 2.993 0 2.993 0l6.5-.013s-5.818 4.116-9.488 4.45S0 .572 0 .572A35.561 35.561 0 016.157.025z"
                data-name="Path 13"
                opacity="0.615"
                transform="translate(16.069 63.116)"></Path>
            </G>
            <G data-name="hair-front" transform="translate(167.985)">
              <Path
                fill="url(#linear-gradient)"
                d="M828.3 123.654s2.017 7.356 4.3 15.884c1.379 5.16.759 7.371.694 12.683a39.527 39.527 0 013.214-5.405c1.147-1.713 2.994.85 4.3-1.515 1.007-1.821 2.148-8.076 2.255-11.663.42-14.012-.059-16.152-5.023-22.189-.009.001-7.355 1.636-9.74 12.205z"
                data-name="Path 1001"
                transform="translate(-770.525 -97.536)"></Path>
              <Path
                fill="#03194a"
                d="M863.993 127.486c24.875 1.263 29.151 0 29.151 0l11.556-7.976s-3.449-10.521-21.265-15.382a43.692 43.692 0 00-18.474-.979c-6.713 4.542-6.791.108-12.881 2.939-4.9 1.945-3.588 6.809-6.3 7.908-6.1 2.468-13.965 3.892-9.223 13.489 9.673 10.521 11.443-.809 27.436.001z"
                data-name="Path 1017"
                transform="translate(-835.097 -102.589)"></Path>
            </G>
            <Path
              fill={primary}
              d="M321.086 2920.311s16.609 3.806 22.075 15.173 3.534 30.547 3.534 30.547L313.476 2988s-10.847-28.344-8.945-45.267a27.816 27.816 0 0116.555-22.426z"
              data-name="primary"
              transform="translate(-67.44 -2802.548)"></Path>
            <Path
              fill="none"
              stroke="#020d88"
              strokeWidth="1"
              d="M198.249 51.146l-5.5 12.1 5.5 1.648"
              data-name="Path 62304"></Path>
          </G>
        </G>
        <Rect
          width="555"
          height="34"
          fill="#0a0f4d"
          data-name="Rectangle 2394"
          rx="17"
          transform="translate(0 299)"></Rect>
        <G transform="translate(126.135 218.383)">
          <G data-name="Group 4">
            <Path
              fill="#9799b2"
              d="M0 0h80.877a5.55 5.55 0 015.514 5.585 5.55 5.55 0 01-5.514 5.585H5.514A5.55 5.55 0 010 5.585z"
              data-name="Path 4086"
              transform="translate(0 78.349)"></Path>
            <Path
              fill="#b1b2c9"
              d="M2430.737 1822.107l15.661-73.44a9.487 9.487 0 014.933-5.817c3.906-1.772 10.687-1.273 10.687-1.273h86.643a7.111 7.111 0 015.483 2.954c1.6 2.815.934 8.306.934 8.306l-13.3 68.207a16.992 16.992 0 01-3.276 6.817 10.969 10.969 0 01-5.918 2.857l-100.506.408c-4.429.195-1.341-9.019-1.341-9.019z"
              data-name="Path 49"
              transform="translate(-2381.983 -1741.512)"></Path>
          </G>
          <Path
            fill="#d5d6e2"
            d="M11.171 22.337a10.963 10.963 0 0011-11.083A11.237 11.237 0 0011.058.057a10.963 10.963 0 00-11 11.083 11.237 11.237 0 0011.114 11.2z"
            data-name="Path 4001"
            transform="rotate(-153 68.59 15.172)"></Path>
        </G>
        <Path
          fill="none"
          stroke="#020d88"
          strokeWidth="1"
          d="M139.575 131.934a28.79 28.79 0 002.459 6.879 38.02 38.02 0 004.572 6.5l-5.538 2.294"
          data-name="Path 62303"></Path>
      </G>
    </Svg>
  );
}
