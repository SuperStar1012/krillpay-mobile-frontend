import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const ModalBasic = props => {
  const { modalStyle } = styles;

  let {
    children,
    visible,
    onDismiss = () => {},
    scrollView,
    ...modalProps
  } = props;

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
      onBackdropPress={() => onDismiss()}
      hideModalContentWhileAnimating
      {...modalProps}>
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    backgroundColor: 'white',
  },
});

export default ModalBasic;
