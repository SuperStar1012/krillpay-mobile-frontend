import React, { useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { CustomImage } from '../outputs/CustomImage';
import { View } from './View';
import Text from '../outputs/Text';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../inputs/Button';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Slides = props => {
  let {
    width = SCREEN_WIDTH,
    items,
    initialIndex = 0,
    fullScreen,
    onSuccess,
    ...otherProps
  } = props;

  let imageWidth = width;
  if (imageWidth > SCREEN_HEIGHT / 2) {
    imageWidth = SCREEN_HEIGHT / 2;
  }
  const [index, setIndex] = useState(initialIndex);
  const carouselRef = useRef('carousel');
  const { colors } = useTheme();

  if (!items || !items.length) {
    return null;
  }

  function renderItem({ item, index }) {
    const { image, title, description } = item;

    const height = imageWidth - (fullScreen ? 64 : 96);
    return (
      <View jC={'center'} f={1} pb={2} w="100%">
        <View p={0.5} jC="center">
          <CustomImage
            name={image}
            backgroundColor={'authScreen'}
            height={height}
            width={height}
          />
        </View>
        <View p={0.5} w="100%" mt={1}>
          {Boolean(title) && (
            <Text t={'h5'} s={25} fW={'bold'} tA={'center'} id={title} />
          )}
          <Text
            // c={'authScreenContrast'}
            tA={'center'}
            p={0.5}
            s={16}
            c="#868686"
            minimumFontScale={0.8}
            numberOfLines={7}
            id={description}
            adjustsFontSizeToFit></Text>
        </View>
      </View>
    );
  }

  const length = items.length;
  const inProgress = index < length - 1;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: fullScreen ? 32 : 0,
      }}>
      <Carousel
        ref={carouselRef}
        // currentIndex={index}
        data={items}
        autoplayDelay={6000}
        renderItem={renderItem}
        lockScrollWhileSnapping
        sliderWidth={width}
        inactiveSlideScale={0.7}
        inactiveSlideOpacity={0.3}
        itemWidth={width}
        // enableMomentum
        useExperimentalSnap
        onScrollIndexChanged={index => setIndex(index)}
        {...otherProps}
      />

      {(!fullScreen || inProgress) && (
        <Pagination
          carouselRef={carouselRef}
          // tappableDots
          dotsLength={length}
          activeDotIndex={index}
          containerStyle={{
            backgroundColor: 'transparent',
            paddingTop: 16,
            marginBottom: fullScreen ? 24 : 8,
          }}
          dotStyle={{
            width: 20,
            height: 8,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: colors.primary,
          }}
          inactiveDotStyle={{
            width: 8,
            height: 8,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: colors.grey3,
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      )}

      {fullScreen && !inProgress && (
        <View m={1} mb={2}>
          <Button id="get_started" wide onPress={onSuccess} />
        </View>
      )}
    </View>
  );
};

export { Slides };
