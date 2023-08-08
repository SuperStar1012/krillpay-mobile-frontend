import React, { Component, useRef } from 'react';
import { Dimensions } from 'react-native';
import _Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Carousel(props) {
  const {
    data,
    renderItem,
    vertical,
    horizontal,
    loop = true,
    onSnapToItem,
  } = props;

  const carouselRef = useRef();

  return (
    <_Carousel
      ref={carouselRef}
      data={data}
      renderItem={renderItem}
      loop={loop}
      sliderWidth={SCREEN_WIDTH}
      itemWidth={SCREEN_WIDTH * 0.85}
      vertical={vertical}
      horizontal={horizontal}
      activeSlideAlignment={'center'}
      inactiveSlideOpacity={1}
      inactiveSlideScale={1}
      onSnapToItem={slideIndex => onSnapToItem(slideIndex)}
      containerCustomStyle={{ zIndex: 1 }}
      contentContainerCustomStyle={{ zIndex: 1 }}
      useScrollView
      keyboardShouldPersistTaps={'always'}
      layoutCardOffset={SCREEN_WIDTH / 4}
      // removeClippedSubviews={Platform.OS === 'ios'}
      removeClippedSubviews={false}
    />
  );
}

Carousel.propTypes = {
  onSnapToItem: PropTypes.func,
};

Carousel.defaultProps = {
  backgroundColor: 'white',
  width: SCREEN_WIDTH,
  height: 120,
  padding: 0,
  onSnapToItem: () => {},
};

export { Carousel };

/*
TODO:
1. Reimplement this on auth screen
2. Test / simplify
3. Implement on home / wallets


*/
