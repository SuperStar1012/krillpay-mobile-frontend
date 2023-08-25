/* PIN INPUT */
/*
Component that request the user to input a pin if pin has been set or 
to scan fingerprint if fingerprint has been set.
*/
import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';

import context from '../context';

import { verifyMFA, deliverTokenForMFA } from 'utility/rehive';
import { HeaderButton } from '../inputs/HeaderButton';
import { CodeInput } from '../inputs/CodeInput';
import Text from '../outputs/Text';
import Images from 'components/images';

class _MultiFactorAuthentication extends Component {
  state = {
    hasGAuth: false,
    hasAuthy: false,
    error: '',
    loading: false,
    activeChallenge: this.props.challenges?.[0], // when verifying login MFA
    authenticator: this.props.authenticator, // when setting MFA
  };

  async verifyMFA(code) {
    const { activeChallenge, authenticator } = this.state;
    try {
      await verifyMFA({
        token: code,
        [authenticator ? 'authenticator' : 'challenge']: authenticator
          ? authenticator.id
          : activeChallenge.id,
      });
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

  resendSMS = async () => {
    const { activeChallenge, authenticator } = this.state;
    await deliverTokenForMFA({
      [authenticator ? 'authenticator' : 'challenge']: authenticator
        ? authenticator.id
        : activeChallenge.id,
    });
    this.props?.showToast({
      id: 'mfa_sms_new_code_sent',
    });
  };

  render() {
    let { colors, codeLength, authScreen, mobile } = this.props;
    const { error, activeChallenge, authenticator } = this.state;
    const { textStyle } = styles;
    const isToken = authenticator
      ? authenticator.type === 'totp'
      : activeChallenge?.authenticator_types?.includes('totp');

    return (
      <View>
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
            style={[textStyle]}
            id={isToken ? 'mfa_token_verification' : 'mfa_sms_verification'}
            context={{ mobile: mobile ? '' : 'your number' }}
          />
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

          {isToken ? (
            <View style={{ padding: 8 }} />
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
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = {
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
