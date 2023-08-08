import React, { Component } from 'react';
import { osVersion } from 'expo-device';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  StyleSheet,
  AppState,
  ViewPropTypes,
  Platform,
} from 'react-native';
import _ from 'lodash';
import { TextField } from './TextField';
import * as Clipboard from 'expo-clipboard';

const isLowend = Platform.OS === 'android' && parseFloat(osVersion) < 8;

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

class CodeInput extends Component {
  static propTypes = {
    codeLength: PropTypes.number,
    compareWithCode: PropTypes.string,
    inputPosition: PropTypes.string,
    size: PropTypes.number,
    space: PropTypes.number,
    className: PropTypes.string,
    cellBorderWidth: PropTypes.number,
    activeColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    ignoreCase: PropTypes.bool,
    autoFocus: PropTypes.bool,
    codeInputStyle: TextInput.propTypes.style,
    containerStyle: viewPropTypes.style,
    onFulfill: PropTypes.func,
  };

  static defaultProps = {
    codeLength: 5,
    inputPosition: 'center',
    autoFocus: true,
    size: 40,
    className: 'border-box',
    cellBorderWidth: 1,
    activeColor: 'rgba(255, 255, 255, 1)',
    inactiveColor: 'rgba(255, 255, 255, 0.2)',
    space: 8,
    compareWithCode: '',
    ignoreCase: false,
  };
  constructor(props) {
    super(props);

    this.codeInputRefs = [];
  }

  state = {
    codeArr: new Array(this.props.codeLength).fill(''),
    currentIndex: 0,
    appState: AppState.currentState,
    timer: null,
    submitting: false,
    copiedFromSms: false,
  };

  componentDidMount() {
    const { compareWithCode, codeLength, inputPosition } = this.props;
    if (compareWithCode && compareWithCode.length !== codeLength) {
      console.error(
        'Invalid props: compareWith length is not equal to codeLength',
      );
    }

    if (
      _.indexOf(['center', 'left', 'right', 'full-width'], inputPosition) === -1
    ) {
      console.error(
        'Invalid input position. Must be in: center, left, right, full',
      );
    }

    try {
      if (this.codeInputRefs.lowEnd) this.codeInputRefs.lowEnd.focus();
      else if (this.codeInputRefs[0]) this.codeInputRefs[0].focus();
    } catch (e) {}

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._getClipboard();
    }
    this.setState({ appState: nextAppState });
  };

  _getClipboard = async () => {
    var content = await Clipboard.getStringAsync();
    if (content?.length === this.props?.codeLength) {
      this._handleFulfill(content);
    }
  };

  clear() {
    this.setState({
      codeArr: new Array(this.props.codeLength).fill(''),
      currentIndex: 0,
      submitting: false,
    });
    this._setFocus(0);
  }

  _setFocus(index) {
    if (!this.state.copiedFromSms) {
      this.codeInputRefs?.[index]?.focus();
    }
  }

  _blur(index) {
    this.codeInputRefs?.[index]?.blur();
  }

  _onFocus(index) {
    let newCodeArr = _.clone(this.state.codeArr);
    const currentEmptyIndex = _.findIndex(newCodeArr, c => !c);
    if (!this.state.copiedFromSms) {
      if (currentEmptyIndex !== -1 && currentEmptyIndex < index) {
        return this._setFocus(currentEmptyIndex);
      }
      for (const i in newCodeArr) {
        if (i >= index) {
          newCodeArr[i] = '';
        }
      }

      this.setState({
        codeArr: newCodeArr,
        currentIndex: index,
      });
    }
  }

  _isMatchingCode(code, compareWithCode, ignoreCase = false) {
    if (ignoreCase) {
      return code.toLowerCase() == compareWithCode.toLowerCase();
    }
    return code == compareWithCode;
  }

  _getContainerStyle(size, position) {
    switch (position) {
      case 'left':
        return {
          justifyContent: 'flex-start',
          height: size,
        };
      case 'center':
        return {
          justifyContent: 'center',
          height: size,
        };
      case 'right':
        return {
          justifyContent: 'flex-end',
          height: size,
        };
      default:
        return {
          justifyContent: 'space-between',
          height: size,
        };
    }
  }

  _getInputSpaceStyle(space) {
    const { inputPosition } = this.props;
    switch (inputPosition) {
      case 'left':
        return {
          marginRight: space,
        };
      case 'center':
        return {
          marginRight: space / 2,
          marginLeft: space / 2,
        };
      case 'right':
        return {
          marginLeft: space,
        };
      default:
        return {
          marginRight: 0,
          marginLeft: 0,
        };
    }
  }

  _getClassStyle(className, active) {
    const { cellBorderWidth, activeColor, inactiveColor, space } = this.props;
    let classStyle = {
      ...this._getInputSpaceStyle(space),
      color: activeColor,
    };

    switch (className) {
      case 'clear':
        return _.merge(classStyle, { borderWidth: 0 });
      case 'border-box':
        return _.merge(classStyle, {
          borderWidth: cellBorderWidth,
          borderColor: active ? activeColor : inactiveColor,
          borderRadius: 4,
        });
      case 'border-circle':
        return _.merge(classStyle, {
          borderWidth: cellBorderWidth,
          borderRadius: 50,
          borderColor: active ? activeColor : inactiveColor,
        });
      case 'border-b':
        return _.merge(classStyle, {
          borderBottomWidth: cellBorderWidth,
          borderColor: active ? activeColor : inactiveColor,
        });
      case 'border-b-t':
        return _.merge(classStyle, {
          borderTopWidth: cellBorderWidth,
          borderBottomWidth: cellBorderWidth,
          borderColor: active ? activeColor : inactiveColor,
        });
      case 'border-l-r':
        return _.merge(classStyle, {
          borderLeftWidth: cellBorderWidth,
          borderRightWidth: cellBorderWidth,
          borderColor: active ? activeColor : inactiveColor,
        });
      default:
        return className;
    }
  }

  _onKeyPress(e) {
    if (e.nativeEvent.key === 'Backspace') {
      // Return if duration between previous key press and backspace is less than 20ms
      if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 20) return;

      const { currentIndex } = this.state;
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      this._setFocus(nextIndex);
    } else {
      // Record non-backspace key event time stamp
      this.lastKeyEventTimestamp = e.timeStamp;
    }
  }

  _handleFulfill(code) {
    this.props.onFulfill(code);
  }

  _onInputCode(character, index) {
    const { codeLength, onFulfill, compareWithCode, ignoreCase } = this.props;

    let newCodeArr = _.clone(this.state.codeArr);
    if (character.length > 1 || index === 100) {
      newCodeArr = character.split('');
      this.setState({
        codeArr: newCodeArr,
        currentIndex: character?.length - 1,
      });
      if (character.length === codeLength) {
        this._handleFulfill(character);
        this.setState({
          copiedFromSms: true,
        });
      }
    } else {
      if (!this.state.copiedFromSms) {
        newCodeArr[index] = character;

        if (index === codeLength - 1) {
          const code = newCodeArr.join('');

          if (compareWithCode) {
            const isMatching = this._isMatchingCode(
              code,
              compareWithCode,
              ignoreCase,
            );
            this._handleFulfill(code, isMatching);
            !isMatching && this.clear();
          } else {
            this._handleFulfill(code);
          }
          this._blur(this.state.currentIndex);
        } else {
          this._setFocus(this.state.currentIndex + 1);
        }

        this.setState(prevState => {
          return {
            codeArr: newCodeArr,
            currentIndex: prevState.currentIndex + 1,
          };
        });
      }
    }
  }

  render() {
    const {
      codeLength,
      codeInputStyle,
      containerStyle,
      inputPosition,
      autoFocus,
      className,
      size,
      activeColor,
    } = this.props;

    if (isLowend) {
      const value = this.state.codeArr.filter(item => item).join('');
      return (
        <TextField
          ref={ref => (this.codeInputRefs.lowEnd = ref)}
          style={{ textAlign: 'center' }}
          value={value}
          onChangeText={text => this._onInputCode(text, 100)}
          secureTextEntry
          autoFocus
          keyboardType={'numeric'}
          returnKeyType={'done'}
          error=""
        />
      );
    }

    const initialCodeInputStyle = {
      width: size,
      height: size,
    };
    let codeInputs = [];
    for (let i = 0; i < codeLength; i++) {
      const id = i;
      codeInputs.push(
        <TextInput
          key={id}
          ref={ref => (this.codeInputRefs[id] = ref)}
          style={[
            styles.codeInput,
            initialCodeInputStyle,
            this._getClassStyle(className, this.state.currentIndex == id),
            codeInputStyle,
          ]}
          underlineColorAndroid="transparent"
          selectionColor={activeColor}
          keyboardType={'numeric'}
          returnKeyType={'done'}
          {...this.props}
          autoFocus={autoFocus && id == 0}
          onFocus={() => this._onFocus(id)}
          value={
            this.state.codeArr[id] ? this.state.codeArr[id].toString() : ''
          }
          onChangeText={text => this._onInputCode(text, id)}
          onKeyPress={e => this._onKeyPress(e)}
          maxLength={Platform.OS === 'android' ? 1 : 10}
        />,
      );
    }

    return (
      <View
        style={[
          styles.container,
          this._getContainerStyle(size, inputPosition),
          containerStyle,
        ]}>
        {codeInputs}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 8,
  },
  codeInput: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingTop: 2,
  },
});

// function TextInput(props){

// }

export { CodeInput };

// import { View } from '../layout/View';
// import OTPInputView from '@twotalltotems/react-native-otp-input';

// const CodeInput = (props, ref) => {

// class CodeInput extends Component {
//   state = { code: '' };
//   clear() {
//     this.setState({
//       code: '',
//     });
//     // this._setFocus(0);
//   }
//   onCodeChange = code => {
//     this.setState({ code });
//   };
//   render() {
//     const {
//       secureTextEntry,
//       autoFocus = true,
//       codeLength,
//       size = 30,
//       containerStyle = {},
//       onFulfill,
//     } = this.props;
//     const { code } = this.state;

//     return (
//       <View fD={'column'} jC={'center'} aI="center">
//         <OTPInputView
//           code={code}
//           // clearInputs
//           onCodeChanged={code => {
//             this.onCodeChange(code);
//           }}
//           autoFocusOnLoad //={autoFocus}
//           pinCount={codeLength}
//           secureTextEntry={secureTextEntry}
//           codeInputFieldStyle={{
//             width: size,
//             height: 30,
//             color: 'black',
//             borderColor: '#ADADAD',
//             borderRadius: 3,
//           }}
//           clearInputs={code === ''}
//           onCodeFilled={code => onFulfill(code)}
//           style={{
//             height: 60,
//             maxWidth: 250,
//             ...containerStyle,
//           }}
//         />
//       </View>
//     );
//   }
// }

// export { CodeInput };

// import React, { Component } from 'react';
