import React from 'react';
import { Keyboard, Pressable } from 'react-native';

export default function KeyboardDismiss(props) {
  const { children } = props;
  function handlePress() {
    Keyboard.dismiss();
  }
  return <Pressable onPress={handlePress}>{children}</Pressable>;
}
