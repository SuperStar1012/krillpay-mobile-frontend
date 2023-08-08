import React, { Component } from 'react';
import * as ExpoLocalAuthentication from 'expo-local-authentication';

import PropTypes from 'prop-types';
import context from '../context';
import { Button } from '../inputs/Button';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import { CodeInput } from '../inputs/CodeInput';
import { CustomImage } from '../outputs/CustomImage';
import { Spinner } from '../outputs/Spinner';

class _LocalAuthenticationSet extends Component {
  state = {
    state: '',
    code: '',
    error: '',
    modalVisible: false,
    types: [],
    biometrics: false,
    compatible: false,
  };

  async componentDidMount() {
    let compatible = await ExpoLocalAuthentication.hasHardwareAsync();
    let biometrics = await ExpoLocalAuthentication.isEnrolledAsync();
    let types =
      await ExpoLocalAuthentication.supportedAuthenticationTypesAsync();

    this.setState({ state: 'landing', compatible, biometrics, types });
  }

  _onSetPinComplete(code) {
    if (!this.state.code) {
      this.setState({ code, error: '' });
      this._pinInput && this._pinInput.clear();
    } else if (this.state.code === code) {
      this.props.handleLocalAuthSet('pin', code);
    } else {
      this._pinInput && this._pinInput.clear();
      this.setState({
        code: '',
        error: 'Pin and confirm do not match, please try again',
      });
    }
  }

  async _activateFingerprint() {
    let result = await ExpoLocalAuthentication.authenticateAsync();
    this.setState({ modalVisible: false });

    if (!result.success) {
      this.props.handleLocalAuthSet('biometrics');
    } else {
      this.setState({
        error: 'Unable to authenticate with biometrics, please try again',
      });
      // this.props.pinFail('');
    }
  }

  _showFingerprintModal = () => {
    // if (Platform.OS === 'android') {
    //   this.setState({ modalVisible: true });
    // }
    this._activateFingerprint();
  };

  renderPin() {
    const { code, error } = this.state;
    const { buttonsContainer, viewStyleInput } = styles;

    return (
      <View style={buttonsContainer} keyboardAvoiding f={1}>
        <CustomImage name={'pin'} width={120} />
        <View style={viewStyleInput} pb={0.5}>
          <Text
            tA="center"
            id={code ? 'please_confirm_pin' : 'please_enter_pin'}
          />

          <View pb={0.75} pt={0.5}>
            <Text tA="center" c="error">
              {error}
            </Text>
          </View>
          <CodeInput
            ref={component => (this._pinInput = component)}
            secureTextEntry
            activeColor="gray"
            autoFocus
            inactiveColor="lightgray"
            className="border-box"
            codeLength={4}
            space={14}
            size={30}
            inputPosition="center"
            containerStyle={{ marginTop: 0, paddingBottom: 24 }}
            onFulfill={code => this._onSetPinComplete(code)}
          />
        </View>
        <Button
          id="back"
          color="authScreenContrast"
          type="text"
          reference={input => {
            this.pin = input;
          }}
          wide
          onPress={() =>
            this.setState({ state: 'landing', code: '', error: '' })
          }
          // animation="slideInRight"
        />
      </View>
    );
  }

  renderLanding() {
    const { buttonsContainer } = styles;
    const { error, types } = this.state;

    const hasFaceId = types?.findIndex(item => item === 2) !== -1;
    const hasFingerprint = types?.findIndex(item => item === 1) !== -1;
    const hasBiometrics = types?.length > 0;

    return (
      <View style={buttonsContainer}>
        <CustomImage
          name={hasFaceId ? 'faceId' : hasFingerprint ? 'localAuth' : 'pin'}
          width={150}
        />
        <View pv={1.5}>
          <Text
            tA={'center'}
            id={hasBiometrics ? 'local_auth_set_biometrics' : 'local_auth_set'}
          />
        </View>
        {hasBiometrics && (
          <Button
            id={
              hasFaceId
                ? 'use_face_id'
                : hasFingerprint
                ? 'use_fingerprint'
                : ''
            }
            color="primary"
            reference={input => {
              this.fingerprint = input;
            }}
            wide
            onPress={() => this._showFingerprintModal()}
            // animation="slideInRight"
          />
        )}
        {error ? (
          <Text tA="center" c="error">
            {error}
          </Text>
        ) : null}
        <Button
          id="use_pin"
          color="authScreenContrast"
          type={hasBiometrics ? 'text' : 'contained'}
          reference={input => {
            this.pin = input;
          }}
          buttonStyle={{ marginTop: 12 }}
          wide
          onPress={() => this.setState({ state: 'pin', error: '' })}
          // animation="slideInRight"
        />
      </View>
    );
  }

  // renderModal() {
  //   // const { loading } = this.props;
  //   const { modalVisible } = this.state;

  //   const contentText = 'Please scan your fingerprint';
  //   const textActionOne = 'CANCEL';
  //   const onPressActionOne = () => {
  //     if (Platform.os !== 'ios') {
  //       ExpoLocalAuthentication.cancelAuthenticate();
  //     }
  //     this.setState({ modalVisible: false });
  //   };

  //   return (
  //     <PopUpGeneral
  //       visible={modalVisible}
  //       contentText={contentText}
  //       textActionOne={textActionOne}
  //       onPressActionOne={onPressActionOne}
  //       onDismiss={onPressActionOne}
  //       // loading={loading}
  //       // errorText={updateError}
  //     >
  //       <CustomImage name={'biometrics'} width={120} />
  //     </PopUpGeneral>
  //   );
  // }

  render() {
    const { state } = this.state;

    return (
      <React.Fragment>
        {state === 'pin' ? (
          this.renderPin()
        ) : state === 'biometrics' ? (
          this.renderFingerprint()
        ) : state === 'landing' ? (
          this.renderLanding()
        ) : (
          <Spinner />
        )}
        {/* {this.renderModal()} */}
      </React.Fragment>
    );
  }
}

_LocalAuthenticationSet.propTypes = {
  pin: PropTypes.string, // Required pin
  biometrics: PropTypes.bool, // Required fingerprint
  modalVisible: PropTypes.bool, // Required fingerprint
  handleLocalAuthSet: PropTypes.func, // Function if pin/fingerprint success
  onDismiss: PropTypes.func, // Function to execute on dismiss
  attempts: PropTypes.number,
  modal: PropTypes.bool,
  colors: PropTypes.object,
  backgroundColor: PropTypes.string,
  type: PropTypes.string,
};

_LocalAuthenticationSet.defaultProps = {
  pin: '',
  biometrics: false,
  modalVisible: false,
  handleLocalAuthSet: () => {},
  onDismiss: () => {},
  attempts: 1,
  modal: false,
  backgroundColor: 'white',
  type: '',
};

const styles = {
  viewStyleInput: {
    width: '100%',
    justifyContent: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignSelf: 'flex-end',
  },
};

const LocalAuthenticationSet = context(_LocalAuthenticationSet);

export { LocalAuthenticationSet };
