import React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';

import { CardActions } from '../../card';
import ModalHeaderActions from './ModalHeaderActions';
import { Spinner } from '../../outputs/Spinner';
import { View } from '../../layout/View';

const ModalFullscreen = props => {
  const { containerStyle, viewStyleHeader, viewStyleFooter, modalStyle } =
    styles;

  let {
    title,
    subtitle,
    modalActionOne,
    modalActionTwo,
    children,
    visible,
    onDismiss,
    loading,
    scrollView,
    action,
    action2,
    noPadding,
  } = props;

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      style={modalStyle}
      avoidKeyboard
      keyboardShouldPersistTaps="always"
      propagateSwipe={scrollView}
      onBackdropPress={() => onDismiss()}
      hideModalContentWhileAnimating>
      <View style={containerStyle}>
        <View style={viewStyleHeader}>
          <ModalHeaderActions
            onDismiss={onDismiss}
            action={action}
            action2={action2}
          />
          {/* <ModalTitle title={title} subtitle={subtitle} /> */}
        </View>

        <View fG={1} ph={noPadding ? 0 : 1.5} scrollView={scrollView}>
          {children}
        </View>

        {modalActionOne || modalActionTwo ? (
          <View style={viewStyleFooter}>
            {loading ? (
              <Spinner size="small" containerStyle={{ width: '100%' }} />
            ) : (
              <CardActions
                actionOne={modalActionOne}
                actionTwo={modalActionTwo}
              />
            )}
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  containerStyle: {
    backgroundColor: '#fff',
    // flex: 1,
    height: '100%',
  },
  viewStyleHeader: {
    flexDirection: 'column',
    paddingTop: Constants.statusBarHeight,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  viewStyleTitle: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  textStyleTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    fontWeight: 'bold',
    fontSize: 20,
  },
  textStyleSubtitle: {
    opacity: 0.8,
    fontSize: 12,
  },
  textStyleContent: {
    fontSize: 16,
    textAlign: 'center',
  },
  textStyleError: {
    paddingBottom: 0,
    fontSize: 14,
  },
  iconStyleClose: {
    padding: 16,
  },
  viewStyleFooter: {
    flexDirection: 'row',
    height: 52,
    width: '100%',
    alignItems: 'center',
  },
  viewStyleActions: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionStyle: {
    justifyContent: 'center',
    color: '#777',
    paddingRight: 20,
  },
});

export { ModalFullscreen };
