import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, Path, G, Ellipse } from 'react-native-svg';
import { useTheme } from 'components/context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ProfilePlaceholder = props => {
  const { colors } = useTheme();
  const { size } = props;
  const { primary, primaryContrast } = colors;
  const w = 201;
  const h = 201;

  return (
    <Svg
      height={h * (size / w)}
      width={size}
      // width="201"
      // height="201"
      viewBox="0 0 201 201">
      <G data-name="user avatar" transform="translate(-384 -848)">
        <Circle
          cx="100.5"
          cy="100.5"
          r="100.5"
          fill={primary}
          data-name="Ellipse 36"
          transform="translate(384 848)"
        />
        <G
          fill="none"
          stroke={primaryContrast}
          strokeLinecap="square"
          strokeMiterlimit="3"
          strokeWidth="3"
          transform="translate(27 586)">
          <Ellipse
            cx="25.094"
            cy="25.513"
            data-name="Ellipse 13"
            rx="25.094"
            ry="25.513"
            transform="translate(432.477 297.732)"
          />
          <Path
            d="M410.831 409.623q4.9-49.883 45.978-50.617t47.611 50.617"
            data-name="Path 36"
          />
        </G>
      </G>
    </Svg>
  );
};

// _CustomImage.propTypes = {
//   backgroundColor: PropTypes.string,
//   width: PropTypes.number,
//   height: PropTypes.number,
//   padding: PropTypes.number,
//   colors: PropTypes.object,
// };

// _CustomImage.defaultProps = {
//   backgroundColor: 'white',
//   width: SCREEN_WIDTH,
//   height: 120,
//   padding: 0,
//   colors: {},
// };

export default ProfilePlaceholder;
