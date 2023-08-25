import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardDidShow(e) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const keyboardDidShowEvent = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardDidShow,
    );
    const keyboardDidHideEvent = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      keyboardDidShowEvent.remove();
      keyboardDidHideEvent.remove();
    };
  }, []);

  return { keyboardHeight };
};
