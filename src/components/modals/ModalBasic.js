import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default function ModalBasic(props) {
  const { modalStyle } = styles;

  let { children, visible, scrollView, onDismiss, ...modalProps } = props;

  return (
    <Modal
      animationInTiming={1}
      animationType={'fade'}
      animationOutTiming={1}
      presentationStyle="fullScreen"
      isVisible={visible}
      useNativeDriver
      style={modalStyle}
      transparent={false}
      avoidKeyboard
      keyboardShouldPersistTaps="always"
      propagateSwipe={scrollView}
      onBackdropPress={() => onDismiss ?? onDismiss()}
      hideModalContentWhileAnimating
      {...modalProps}>
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    backgroundColor: 'white',
  },
});
