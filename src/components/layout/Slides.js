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
        currentIndex={index}
        data={items}
        autoplayDelay={6000}
        renderItem={renderItem}
        lockScrollWhileSnapping
        sliderWidth={width}
        inactiveSlideScale={0.7}
        inactiveSlideOpacity={0.3}
        itemWidth={width}
        enableMomentum
        onBeforeSnapToItem={index => setIndex(index)}
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

// class _Slides extends Component {
//   scrollX = new Animated.Value(0);

//   renderSlides() {
//     const { width = SCREEN_WIDTH, data } = this.props;
//     let position = Animated.divide(this.scrollX, width);

//     return data.map((slide, i) => {
//       let opacity = position.interpolate({
//         inputRange: [i - 0.7, i, i + 0.7],
//         outputRange: [0.05, 1, 0.05],
//         extrapolate: 'clamp',
//       });
//       // console.log('TCL: renderSlides -> slide', slide);
//       return (
//         <Animated.View
//           key={slide.id}
//           style={{
//             opacity,
//             width,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               // flex: 1,
//               justifyContent: 'center',
//             }}>
//             <CustomImage
//               name={slide.image}
//               backgroundColor={'authScreen'}
//               height={SCREEN_WIDTH / 2}
//               width={SCREEN_WIDTH / 2}
//             />
//           </View>
//           <View p={0.5}>
//             <Text
//               c={'authScreenContrast'}
//               t={'h5'}
//               fW={'600'}
//               tA={'center'}
//               p={0.5}>
//               {slide.title}
//             </Text>
//             <Text c={'authScreenContrast'} t={'s1'} tA={'center'} p={0.5}>
//               {slide.description}
//             </Text>
//           </View>
//         </Animated.View>
//       );
//     });
//   }

//   render() {
//     const { width, data, colors } = this.props;
//     let position = Animated.divide(this.scrollX, width);
//     return (
//       <View
//         style={{
//           justifyContent: 'space-around',
//           alignItems: 'center',
//         }}>
//         <ScrollView
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={Animated.event([
//             { nativeEvent: { contentOffset: { x: this.scrollX } } },
//           ])}
//           scrollEventThrottle={16}>
//           {this.renderSlides()}
//         </ScrollView>
//         {data && data.length > 1 ? (
//           <View
//             style={{
//               flexDirection: 'row',
//             }}>
//             {data.map((_, i) => {
//               let opacity = position.interpolate({
//                 inputRange: [i - 1, i, i + 1],
//                 outputRange: [0.3, 1, 0.3],
//                 extrapolate: 'clamp',
//               });
//               return (
//                 <Animated.View
//                   key={i}
//                   style={{
//                     opacity,
//                     height: 6,
//                     width: 6,
//                     backgroundColor: colors['authScreenContrast'],
//                     marginVertical: 2,
//                     marginHorizontal: 8,
//                     borderRadius: 3,
//                   }}
//                 />
//               );
//             })}
//           </View>
//         ) : null}
//       </View>
//     );
//   }
// }
