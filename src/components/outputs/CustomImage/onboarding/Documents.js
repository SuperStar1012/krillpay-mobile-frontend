import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const Documents = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 150 150">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H150V150H0z"
            data-name="Rectangle 1236"
            transform="translate(113 75)"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-path)" transform="translate(-113 -75)">
        <G transform="translate(113 75)">
          <G>
            <G data-name="Group 874">
              <G data-name="Group 873">
                <G data-name="Group 872">
                  <G data-name="Group 871">
                    <Path
                      fill="#cecece"
                      d="M132.129 39.551l-30.762-8.789L92.578 0H31.055a13.184 13.184 0 00-13.184 13.184v123.632A13.184 13.184 0 0031.055 150h87.891a13.184 13.184 0 0013.184-13.184z"
                      data-name="Path 61857"></Path>
                  </G>
                </G>
              </G>
            </G>
            <Path
              fill="#c4c4c4"
              d="M132.129 39.551v97.266A13.184 13.184 0 01118.945 150H75V0h17.578l8.789 30.762z"
              data-name="Path 61858"></Path>
            <Path
              fill="#e6e6e6"
              d="M132.129 39.551h-30.762a8.815 8.815 0 01-8.789-8.789V0a4.121 4.121 0 013.076 1.319l35.156 35.156a4.121 4.121 0 011.319 3.076z"
              data-name="Path 61859"></Path>
            <G data-name="Group 875">
              <Path
                fill="#e6e6e6"
                d="M101.367 70.605H48.633a4.395 4.395 0 010-8.789h52.734a4.395 4.395 0 010 8.789z"
                data-name="Path 61860"></Path>
            </G>
            <G data-name="Group 876">
              <Path
                fill="#e6e6e6"
                d="M101.367 88.184H48.633a4.395 4.395 0 010-8.789h52.734a4.395 4.395 0 010 8.789z"
                data-name="Path 61861"></Path>
            </G>
            <G data-name="Group 877">
              <Path
                fill="#e6e6e6"
                d="M101.367 105.762H48.633a4.395 4.395 0 010-8.789h52.734a4.395 4.395 0 010 8.789z"
                data-name="Path 61862"></Path>
            </G>
            <G data-name="Group 878">
              <Path
                fill="#e6e6e6"
                d="M83.789 123.34H48.633a4.395 4.395 0 010-8.789h35.156a4.395 4.395 0 010 8.789z"
                data-name="Path 61863"></Path>
            </G>
          </G>
          <G>
            <G data-name="Group 883">
              <G data-name="Group 879">
                <Path
                  fill="#dbdbdb"
                  d="M75 123.34h8.789a4.395 4.395 0 000-8.789H75z"
                  data-name="Path 61864"></Path>
              </G>
              <G data-name="Group 880">
                <Path
                  fill="#dbdbdb"
                  d="M75 105.762h26.367a4.395 4.395 0 000-8.789H75z"
                  data-name="Path 61865"></Path>
              </G>
              <G data-name="Group 881">
                <Path
                  fill="#dbdbdb"
                  d="M75 88.184h26.367a4.395 4.395 0 000-8.789H75z"
                  data-name="Path 61866"></Path>
              </G>
              <G data-name="Group 882">
                <Path
                  fill="#dbdbdb"
                  d="M75 70.605h26.367a4.395 4.395 0 000-8.789H75z"
                  data-name="Path 61867"></Path>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default Documents;
