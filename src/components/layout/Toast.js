import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { View } from './View';
import Text from '../outputs/Text';
import { useToast } from 'contexts/ToastContext';
import Info from './Info';

export default function Toast() {
  const {
    config: {
      active,
      variant,
      duration,
      text,
      id,
      title,
      subtitle,
      actionLabel,
      actionOnPress,
      context = {},
    },
    methods: { deactivate },
  } = useToast();

  const [slideValue] = useState(new Animated.Value(0));
  const [closeTimeout, setCloseTimeout] = useState();

  useEffect(() => {
    if (!active) return;

    startSlideUpAnimation();
    setCloseTimeout(setTimeout(() => close(), duration));
  }, [active]);

  const startSlideUpAnimation = () => {
    Animated.timing(slideValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const startSlideDownAnimation = () => {
    Animated.timing(slideValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  function close() {
    startSlideDownAnimation();
    deactivate();
    clearTimeout(closeTimeout);
  }

  function renderContent() {
    switch (variant) {
      case 'error':
      case 'success':
      case 'warning':
      case 'info':
        return (
          <Info id={id} variant={variant}>
            {text}
          </Info>
        );
      default:
        return (
          <View bR={10} bC={'white'} m={1} p={1}>
            <Text tA={'center'}>
              <Text tA={'center'} id={title ?? id} context={context} />
              <Text tA={'center'}>{text}</Text>
            </Text>
            {Boolean(subtitle) && (
              <View mt={0.25}>
                <Text tA={'center'} c={'grey4'} id={subtitle}>
                  {subtitle}
                </Text>
              </View>
            )}
            {Boolean(actionLabel) && Boolean(actionOnPress) && (
              <View mt={0.25}>
                <TouchableOpacity
                  onPress={() => {
                    actionOnPress();
                    close();
                  }}>
                  <Text
                    tA={'center'}
                    c={'primary'}
                    fW={'700'}
                    context={context}
                    id={actionLabel}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
    }
  }

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: slideValue.interpolate({
              inputRange: [0, 1],
              outputRange: [600, 0],
            }),
          },
        ],
        shadowColor: '#00000021',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 10,
        zIndex: 10000,
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        width: '100%',
      }}>
      {renderContent()}
    </Animated.View>
  );
}
