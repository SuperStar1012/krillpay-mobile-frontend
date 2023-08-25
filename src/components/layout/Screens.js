import React, { Component } from 'react';
import { ScrollView, Dimensions, Animated } from 'react-native';
import context from '../context';
import { CustomImage } from '../outputs/CustomImage';
import { View } from './View';
import Text from '../outputs/Text';
import { Button } from '../inputs/Button';

const SCREEN_WIDTH = Dimensions.get('window').width;

class _Screens extends Component {
  scrollX = new Animated.Value(0);

  handleButton(length, count) {
    if (count < length - 1) {
      this.screens.scrollTo({
        x: SCREEN_WIDTH * (count + 1),
        y: 0,
        animated: true,
      });
    } else {
      this.props.nextAuthFormState();
    }
  }

  renderScreens() {
    const { data, colors } = this.props;
    let position = Animated.divide(this.scrollX, width);
    const width = SCREEN_WIDTH;

    return data.map((screen, i) => {
      let opacity = position.interpolate({
        inputRange: [i - 0.7, i, i + 0.7],
        outputRange: [0.05, 1, 0.05],
        extrapolate: 'clamp',
      });
      return (
        <View
          f={1}
          key={screen.id}
          style={{
            // opacity,
            width,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <CustomImage
              name={screen.image}
              backgroundColor={'authScreen'}
              height={SCREEN_WIDTH / 2}
              width={SCREEN_WIDTH / 2}
            />
          </View>
          <View p={0.5}>
            <Text
              c={'authScreenContrast'}
              t={'h5'}
              fW={'600'}
              tA={'center'}
              p={0.5}>
              {screen.title}
            </Text>
            <Text c={'authScreenContrast'} t={'s1'} tA={'center'} p={0.5}>
              {screen.description}
            </Text>
          </View>
          <View p={2} w={width}>
            <Button
              label={i < data.length - 1 ? 'NEXT' : 'ENTER'}
              color="primary"
              size="large"
              reference={input => {
                this.next = input;
              }}
              onPress={() => this.handleButton(data.length, i)}
              // animation="fadeInUp"
              wide
              // disabled={!props.isValid || props.isSubmitting}
              // loading={props.isSubmitting}
            />
          </View>
        </View>
      );
    });
  }

  render() {
    const { width, data, colors } = this.props;
    let position = Animated.divide(this.scrollX, width);
    return (
      <View
        f={1}
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <ScrollView
          ref={c => {
            this.screens = c;
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: this.scrollX } } },
          ])}
          scrollEventThrottle={16}>
          {this.renderScreens()}
        </ScrollView>
        {/* {data && data.length > 1 ? (
          <View
            style={{
              flexDirection: 'row',
            }}>
            {data.map((_, i) => {
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={{
                    opacity,
                    height: 6,
                    width: 6,
                    backgroundColor: colors['authScreenContrast'],
                    marginVertical: 2,
                    marginHorizontal: 8,
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </View>
        ) : null} */}
      </View>
    );
  }
}

const Screens = context(_Screens);

export { Screens };
