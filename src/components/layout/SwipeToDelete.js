import React, { useRef } from 'react';
import { Spinner } from 'components';
import { Animated, StyleSheet } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import { RectButton } from 'react-native-gesture-handler';

import { MaterialIcons as Icon } from '@expo/vector-icons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function SwipeToDelete(props) {
  let { children, onDelete, loading, text = 'Delete' } = props;
  const updateRef = useRef();

  function renderRemove(progress, dragX) {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton
        style={[
          styles.rectButton,
          // {
          //   transform: [{ translateX: scale }],
          // },
        ]}
        onPress={onDelete}>
        {loading ? (
          <Spinner color="white" />
        ) : (
          <>
            <AnimatedIcon
              name="delete-forever"
              size={30}
              color="#fff"
              style={[styles.actionIcon, { transform: [{ scale }] }]}
            />
            <Animated.Text
              style={[
                styles.actionText,
                {
                  transform: [{ translateX: scale }],
                },
              ]}>
              {text}
            </Animated.Text>
          </>
        )}
      </RectButton>
    );
  }

  return (
    <Swipeable
      renderRightActions={renderRemove}
      ref={updateRef}
      enableTrackpadTwoFingerGesture>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rectButton: {
    // width: 100,
    // height: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#CC2538',
  },
  actionText: { color: 'white' },

  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
  container: {
    // width: '100%',
    // flex: 1,
    // height: 50,
  },
  title: {
    // width: '100%',
    // flex: 1,
    paddingBottom: 2,
  },
  subtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%',
    // height: 50,
  },
});
