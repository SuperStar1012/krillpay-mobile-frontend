import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const LocalAuthPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font } = colors;
  const h = 500;
  const w = 500;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 500 500">
      <Defs>
        <ClipPath id="b">
          <Path
            fill="#fff"
            stroke={font}
            strokeWidth="1"
            d="M0 0H200V200H0z"
            data-name="Rectangle 25"
            transform="translate(65 150)"></Path>
        </ClipPath>
        <ClipPath id="c">
          <Path
            fill="#fff"
            stroke={font}
            strokeWidth="1"
            d="M0 0H432V441H0z"
            data-name="Rectangle 28"
            transform="translate(-.315)"></Path>
        </ClipPath>
        <ClipPath id="a">
          <Path d="M0 0H500V500H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <G data-name="Group 41" transform="translate(-16 -49)">
          <G clipPath="url(#b)" data-name="Mask Group 13">
            <G transform="translate(65 150)">
              <G>
                <G fill={primary} data-name="Group 36">
                  <Path
                    d="M162.5 179.167c-31.071 0-58.333-23.364-58.333-50a4.167 4.167 0 00-8.334 0c0 31.075 31.153 58.333 66.667 58.333a4.167 4.167 0 100-8.333z"
                    data-name="Path 31"
                  />
                  <Path
                    d="M37.5 25.9a4.185 4.185 0 002.165-.6c35.254-21.4 80.965-22.179 116.65-2.456a4.167 4.167 0 004.037-7.292 124.517 124.517 0 00-125.016 2.612A4.169 4.169 0 0037.5 25.9z"
                    data-name="Path 32"></Path>
                  <Path
                    d="M191.146 72.982C175.008 43.836 139.234 25 100 25S24.992 43.836 8.854 72.982a4.167 4.167 0 107.292 4.036C30.835 50.481 63.754 33.334 100 33.334s69.165 17.147 83.854 43.685a4.167 4.167 0 107.292-4.036z"
                    data-name="Path 33"></Path>
                  <Path
                    d="M50 133.334c0-28.972 21.029-50 50-50 30.371 0 50 17.989 50 45.833a4.167 4.167 0 108.334 0C158.334 96.77 134.888 75 100 75c-33.252 0-58.333 25.077-58.333 58.333 0 24.349 8.675 44.5 28.141 65.344a4.166 4.166 0 006.087-5.689C57.984 173.808 50 155.412 50 133.334z"
                    data-name="Path 34"></Path>
                  <Path
                    d="M100 50c-48.283 0-83.333 33.293-83.333 79.167 0 12.37 4.159 24.1 8.651 34.929a4.167 4.167 0 007.7-3.19C28.849 150.867 25 140.08 25 129.167c0-41.707 30.843-70.833 75-70.833 42.757 0 75 32.243 75 75a20.833 20.833 0 11-41.666 0c0-19.625-13.7-33.334-33.334-33.334s-33.333 13.709-33.333 33.333c0 27.189 15.381 50.061 44.474 66.146a4.167 4.167 0 004.036-7.292C88.517 177.45 75 157.65 75 133.334c0-17.269 12.557-25 25-25s25 7.731 25 25a29.167 29.167 0 0058.334 0C183.334 85.824 147.51 50 100 50z"
                    data-name="Path 35"></Path>
                </G>
              </G>
            </G>
          </G>
          <G fill="none" stroke={font} strokeWidth="10" data-name="Group 40">
            <G data-name="Group 38" transform="translate(19 -8)">
              <Path d="M81.447 143H35.4v44.733" data-name="Path 36"></Path>
              <Path
                d="M35.396 327.342v46.047h44.392"
                data-name="Path 37"></Path>
            </G>
            <G data-name="Group 39" transform="translate(230.396 135)">
              <Path d="M.004 0h46.051v44.733" data-name="Path 36"></Path>
              <Path d="M46.051 184.341v46.051H1.659" data-name="Path 37"></Path>
            </G>
          </G>
        </G>
        <G
          clipPath="url(#c)"
          data-name="Mask Group 16"
          transform="translate(130.315 59)">
          <G transform="translate(.003)">
            <Path
              fill="#3c3b41"
              d="M316.916 200.707h-29.272v-65.141c0-28.268-22.528-51.264-50.217-51.264s-50.218 23-50.218 51.264v65.141h-29.273v-65.141c0-44.745 35.66-81.148 79.491-81.148s79.492 36.4 79.492 81.148v65.141z"
              data-name="Path 39"
              transform="translate(-21.583 -6.456)"></Path>
            <Path
              fill="#171719"
              d="M250 54.419V84.3c27.69 0 50.217 23 50.217 51.264v65.141h29.273v-65.139c.01-44.745-35.655-81.147-79.49-81.147z"
              data-name="Path 40"
              transform="translate(-34.162 -6.456)"></Path>
            <Path
              fill="#d5d5d5"
              d="M295.734 391.708H166.852c-29.588 0-53.8-24.714-53.8-54.92v-109.1c0-14.521 11.639-26.4 25.863-26.4H323.67c14.225 0 25.863 11.881 25.863 26.4v109.1c-.001 30.207-24.211 54.92-53.799 54.92z"
              data-name="Path 41"
              transform="translate(-15.451 -23.878)"></Path>
            <Path
              fill="#959595"
              d="M342.38 201.283H250v190.425h64.442c29.588 0 53.8-24.714 53.8-54.92v-109.1c.002-14.523-11.637-26.405-25.862-26.405z"
              data-name="Path 42"
              transform="translate(-34.162 -23.878)"></Path>
            <G
              fill="#272727"
              data-name="Group 42"
              transform="translate(144.069 253.054)">
              <Path
                d="M202.6 298.652l-4.209-6.211-9.956 7.031v-12.358h-7.4v12.358l-9.956-7.031-4.21 6.211 11.362 8.025-11.358 8.023 4.21 6.211 9.956-7.031v12.358h7.4v-12.355l9.956 7.031 4.205-6.214-11.363-8.026z"
                data-name="Path 43"
                transform="translate(-166.873 -287.114)"></Path>
              <Path
                d="M265.042 298.652l-4.211-6.211-9.955 7.031v-12.358h-7.4v12.358l-9.955-7.031-4.21 6.211 11.362 8.025-11.36 8.023 4.21 6.211 9.955-7.031v12.358h7.4v-12.355l9.955 7.031 4.211-6.211-11.363-8.026z"
                data-name="Path 44"
                transform="translate(-175.404 -287.114)"></Path>
            </G>
            <G
              fill="#272727"
              data-name="Group 43"
              transform="translate(215.843 253.054)">
              <Path
                d="M253.7 313.883l9.955 7.031 4.211-6.211-11.363-8.026 11.363-8.025-4.211-6.211-9.955 7.031v-12.358H250v39.127h3.7z"
                data-name="Path 45"
                transform="translate(-250.005 -287.114)"></Path>
              <Path
                d="M327.482 298.652l-4.21-6.211-9.955 7.031v-12.358h-7.4v12.358l-9.955-7.031-4.211 6.211 11.363 8.025-11.362 8.023 4.211 6.211 9.955-7.031v12.358h7.4v-12.355l9.955 7.031 4.21-6.211-11.363-8.026z"
                data-name="Path 46"
                transform="translate(-255.709 -287.114)"></Path>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default LocalAuthPlaceholder;
