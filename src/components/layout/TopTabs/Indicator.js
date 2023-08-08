import { useTheme } from 'components/context';
import React from 'react';
import { Animated, Dimensions } from 'react-native';
const { width } = Dimensions.get('screen');

export default function Indicator(props) {
  const { measures, scrollX } = props;
  const { colors } = useTheme();

  const inputRange = measures.map((_, i) => i * width);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(m => m.width),
  });
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(m => m.x),
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 4,
        left: 0,
        width: indicatorWidth,
        backgroundColor: colors?.primary,
        bottom: -10,
        transform: [
          {
            translateX,
          },
        ],
      }}
    />
  );
}
