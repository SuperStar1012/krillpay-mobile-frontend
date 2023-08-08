/* PIN INPUT */
/*
Component that request the user to input a pin if pin has been set or 
to scan fingerprint if fingerprint has been set.
*/
import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { maybeOpenURL } from 'react-native-app-link';
// import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

import context from '../context';

import { verifyMFA, sendAuthSMS } from 'utility/rehive';
import { HeaderButton } from '../inputs/HeaderButton';
import { CodeInput } from '../inputs/CodeInput';
import Text from '../outputs/Text';
import Images from 'components/images';

class _MultiFactorAuthentication extends Component {
  state = { hasGAuth: false, hasAuthy: false, error: '', loading: false };

  async verifyMFA(code) {
    try {
      await verifyMFA(code);
      // this.props?.showToast({
      //   text: 'Two-factor authentication successful',
      // });
      const { onSuccess, setMfaStepCompleted } = this.props;
      typeof setMfaStepCompleted === 'function'
        ? setMfaStepCompleted(true)
        : onSuccess();
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      this._pinInput && this._pinInput.clear();
      this.setState({ error: e.message, loading: false });
    }
  }

  handleVerify(code) {
    if (!this.state.loading) {
      this.setState({ loading: true });
      this.verifyMFA(code);
    }
  }

  _onInputPinComplete(code) {
    const { pin, onSuccess, setMfaStepCompleted } = this.props;
    let error = '';
    if (pin === code) {
      typeof setMfaStepCompleted === 'function'
        ? setMfaStepCompleted(true)
        : onSuccess();
    } else {
      this._pinInput && this._pinInput.clear();
      error = 'Incorrect pin, please try again';
    }
    this.setState({ error });
  }

  async _openAuthenticator(type) {
    const { issuer, account, secret, authScreen } = this.props;

    let url =
      'otpauth://totp/' +
      issuer +
      ':' +
      account +
      +'?digits=6&issuer:' +
      issuer +
      (secret ? '&secret=' + secret : '');
    let appName = '';
    let appStoreId = '';
    let playStoreId = '';
    // let check = Linking.canOpenURL(url);
    if (type === 'GAuth') {
      appStoreId = '388497605';
      playStoreId = 'com.google.android.apps.authenticator2';
      url = 'otpauth://' + (authScreen ? 'open/' : url);
      appName = 'Google Authenticator';
    } else if (type === 'Authy') {
      appStoreId = '494168017';
      playStoreId = 'com.authy.authy';
      url = 'authy://open/' + (authScreen ? '' : issuer);
      appName = 'Authy';
    }
    maybeOpenURL(url, { appName, appStoreId, playStoreId })
      .then(() => {
        console.log('g auth opened');
      })
      .catch(err => {
        console.log(err);
      });
  }

  resendSMS = async () => {
    await sendAuthSMS();
    this.props?.showToast({
      id: 'mfa_sms_new_code_sent',
    });
  };

  render() {
    let { colors, type, codeLength, authScreen, mobile } = this.props;
    const { error } = this.state;
    const { viewStyleContainer, textStyle } = styles;
    const isToken = type === 'token';

    return (
      <View style={viewStyleContainer}>
        {authScreen ? (
          <HeaderButton
            text={'Logout'}
            onPress={() => this.props.logoutUser()}
            color={'authScreenContrast'}
          />
        ) : null}
        <Images
          containerStyle={{ padding: 16 }}
          name={isToken ? 'mfa' : 'otp'}
          width={70}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <Text
            tA="center"
            style={[
              textStyle,
              // authScreen ? { color: colors.authScreenContrast } : {},
            ]}
            id={isToken ? 'mfa_token_verification' : 'mfa_sms_verification'}
            context={{ mobile: mobile ? '' : 'your number' }}></Text>
          {Boolean(mobile) && !isToken && (
            <Text
              p={0.75}
              style={[textStyle, { paddingBottom: 0 }]}
              tA="center"
              w="100%"
              c="primary">
              {mobile}
            </Text>
          )}
          {Boolean(error) && (
            <Text style={[textStyle, { color: colors.error }]}>{error}</Text>
          )}

          <CodeInput
            ref={component => (this._pinInput = component)}
            secureTextEntry={false}
            activeColor="gray"
            autoFocus
            inactiveColor="lightgray"
            className="border-box"
            codeLength={codeLength ? codeLength : 6}
            space={14}
            size={30}
            inputPosition="center"
            containerStyle={{ marginTop: 24 }}
            onFulfill={code => this.verifyMFA(code)}
          />

          {type === 'token' ? (
            <View
              style={{
                padding: 8,
              }}>
              {/* <Button
              label="OPEN GOOGLE AUTHENTICATOR"
              color="secondary"
              reference={input => {
                this.login = input;
              }}
              onPress={() => this._openAuthenticator('GAuth')}
              // animation="fadeInUpBig"
            /> */}
              {/* <View>
              <Button
                label="OPEN AUTHY"
                textColor={colors.secondaryContrast}
                backgroundColor={colors.secondary}
                reference={input => {
                  this.login = input;
                }}
                onPress={() => this._openAuthenticator('Authy')}
                // animation="fadeInUpBig"
              />
            </View> */}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: 14,
              }}>
              <View>
                <Text
                  t={'b2'}
                  tA={'center'}
                  id="did_not_receive_the_code"></Text>
              </View>
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={() => this.resendSMS()}>
                <Text
                  t={'b2'}
                  c={'primary'}
                  fW={'500'}
                  id="resend"
                  context={{ time: '' }}
                />
              </TouchableHighlight>
              {/* <Button
              color="primary"
              noPadding
              type="text"
              label="Resend"
              size="small"
              onPress={() => this.resendSMS()}
            /> */}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    // flex: 1,
    // padding: 8,
    // justifyContent: 'flex-start',
  },
  textStyle: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
};

const MultiFactorAuthentication = context(_MultiFactorAuthentication);

export { MultiFactorAuthentication };
