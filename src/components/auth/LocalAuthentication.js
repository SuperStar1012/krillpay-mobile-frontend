/* PIN INPUT */
/*
Component that request the user to input a pin if pin has been set or 
to scan biometrics if biometrics has been set.
*/
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import * as ExpoLocalAuthentication from 'expo-local-authentication';
import PropTypes from 'prop-types';
import context from '../context';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { Button } from '../inputs/Button';
import { CodeInput } from '../inputs/CodeInput';
import { CustomImage } from '../outputs/CustomImage';
import Text from '../outputs/Text';
import ErrorOutput from '../outputs/ErrorOutput';
const SCREEN_WIDTH = Dimensions.get('window').width;

class _LocalAuthentication extends Component {
  state = { contentText: '', errorText: '', attempt: 0, scanning: false };

  async componentDidMount() {
    const { localAuth, onSuccess } = this.props;
    const { pin, biometrics } = localAuth;

    if (biometrics) {
      let compatible = await ExpoLocalAuthentication.hasHardwareAsync();
      let biometrics = await ExpoLocalAuthentication.isEnrolledAsync();
      if (!biometrics && !compatible) {
        this.setState({ errorText: 'Unable to access local authentication' });
      } else {
        this.scanFingerprint();
      }
    } else if (!pin) {
      onSuccess();
    }
  }

  scanFingerprint = async () => {
    this.setState({ scanning: true });
    let result = await ExpoLocalAuthentication.authenticateAsync();
    if (result.success) {
      this.props.onSuccess();
    } else {
      this.handleFail();
    }
  };

  handleFail() {
    const { attempts, onDismiss, type, showToast } = this.props;
    let { attempt } = this.state;
    attempt = attempt + 1;
    if (attempt < attempts) {
      let errorText =
        '[' +
        attempt.toString() +
        '/' +
        attempts.toString() +
        '] ' +
        (type === 'confirm'
          ? 'Pin and confirm pin do not match, please try again'
          : 'Unable to authenticate, please try again');
      this.setState({ errorText, attempt, scanning: false });
    } else {
      showToast({ id: 'too_many_incorrect_attempts' });
      onDismiss();
    }
  }

  _onInputPinComplete(code) {
    const { localAuth, onSuccess } = this.props;
    const { pin } = localAuth;
    if (pin === 'set' || pin === code) {
      onSuccess(code);
      this._pinInput && this._pinInput.clear();
    } else {
      this._pinInput && this._pinInput.clear();
      this.handleFail();
    }
  }

  renderInput() {
    const { localAuth } = this.props;
    const { pin, biometrics } = localAuth;
    const { attempt, scanning } = this.state;

    if (pin) {
      return (
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
          onFulfill={code => this._onInputPinComplete(code)}
        />
      );
    } else if (biometrics && attempt > 0 && !scanning) {
      return (
        <Button
          id="try_again"
          color="primary"
          wide
          onPress={() => {
            this.scanFingerprint();
          }}
        />
      );
    }
    return <View />;
  }

  render() {
    const {
      modal,
      modalVisible,
      onDismiss,
      colors,
      localAuth,
      backgroundColor,
    } = this.props;

    const { viewStyleContainer, textStyle } = styles;

    const { errorText, scanning } = this.state;
    const { pin } = localAuth;

    // const showBiometricModal = biometrics && Platform.OS !== 'ios';

    const contentText = pin ? 'please_enter_pin' : '';

    return modal ? (
      <PopUpGeneral
        textStyleContent={{ align: 'center' }}
        visible={modalVisible && (contentText || errorText ? true : false)}
        contentText={contentText}
        buttonActions={[
          {
            id: 'cancel',
            type: 'text',
            onPress: onDismiss,
          },
        ]}
        errorText={errorText}
        onDismiss={onDismiss}>
        <React.Fragment>
          <CustomImage name={pin ? 'pin' : 'biometrics'} width={120} />
          {this.renderInput()}
        </React.Fragment>
      </PopUpGeneral>
    ) : contentText || errorText || pin ? (
      <View
        style={[
          viewStyleContainer,
          { backgroundColor: colors[backgroundColor] },
        ]}>
        <CustomImage
          name={pin ? 'pin' : 'biometrics'}
          width={SCREEN_WIDTH < 380 ? 80 : 120}
          // containerStyle={{ padding: 16 }}
        />
        {contentText ? (
          <Text t={'b2'} tA={'center'} p={0.5} id={contentText} />
        ) : null}
        <ErrorOutput>{!scanning && errorText}</ErrorOutput>

        {this.renderInput()}
      </View>
    ) : null;
  }
}

_LocalAuthentication.propTypes = {
  pin: PropTypes.string, // Required pin
  biometrics: PropTypes.bool, // Required biometrics
  modalVisible: PropTypes.bool, // Required fingerprint
  onSuccess: PropTypes.func, // Function if pin/fingerprint success
  onDismiss: PropTypes.func, // Function to execute on dismiss
  attempts: PropTypes.number,
  modal: PropTypes.bool,
  colors: PropTypes.object,
  backgroundColor: PropTypes.string,
  type: PropTypes.string,
  localAuth: PropTypes.object,
};

_LocalAuthentication.defaultProps = {
  pin: '',
  biometrics: false,
  modalVisible: false,
  onSuccess: () => {},
  onDismiss: () => {},
  attempts: 1,
  modal: false,
  backgroundColor: 'white',
  type: '',
};

const styles = {
  viewStyleContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
};

const LocalAuthentication = context(_LocalAuthentication);

export { LocalAuthentication };
