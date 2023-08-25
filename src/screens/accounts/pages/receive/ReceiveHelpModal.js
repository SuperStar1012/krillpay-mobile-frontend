import React from 'react';
import { PopUpGeneral } from 'components';

export default function ReceiveHelpModal(props) {
  const { setFormState, modalProps, context, isStellar } = props;
  const { hideModal, modalVisible } = modalProps;
  const modalActionTwo = {
    id: 'acknowledge',
    onPress: hideModal,
  };

  const { wallet, crypto } = context;
  const titleText = 'important_please_read_title';

  function handleSetUsername() {
    setFormState('username');
    hideModal();
  }
  const modalActionOne = {
    id: 'set_username',
    onPress: handleSetUsername,
    color: 'secondary',
  };

  const showUsernameButton =
    crypto?.[wallet?.crypto] && !crypto?.[wallet?.crypto]?.user?.username;

  const buttons = [
    showUsernameButton ? modalActionOne : null,
    modalActionTwo,
  ].filter(item => item);

  return (
    <PopUpGeneral
      visible={modalVisible}
      buttonActions={buttons}
      onDismiss={hideModal}
      errorText={''}
      title={titleText}
      contentText={
        isStellar
          ? 'stellar_receive_help_modal_text'
          : 'non_stellar_receive_help_modal_text'
      }
      textLangContext={{ code: wallet?.currency?.code }}
    />
  );
}
