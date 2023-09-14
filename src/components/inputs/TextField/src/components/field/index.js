import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { get } from 'lodash';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Platform,
  ViewPropTypes,
  I18nManager,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import RN from 'react-native/package.json';
import * as Clipboard from 'expo-clipboard';

import Line from '../line';
import Label from '../label';
import Affix from '../affix';
import Helper from '../helper';
import Counter from '../counter';
import { useToast } from 'contexts/ToastContext';
import Text from 'components/outputs/Text';
import { useTranslation } from 'react-i18next';
import { TextInputPropTypes } from 'deprecated-react-native-prop-types';
import { PasswordSupportiveText } from '../helper/PasswordSupportiveText';

export default class TextField extends PureComponent {
  static defaultProps = {
    underlineColorAndroid: 'transparent',
    disableFullscreenUI: true,
    // autoCapitalize: 'sentences',
    containerBackgroundColor: 'transparent',
    editable: true,

    animationDuration: 225,

    fontSize: 16,
    helperFontSize: 12,
    labelFontSize: 12,
    labelHeight: 14,
    labelPadding: 4,
    inputContainerPadding: 12,

    tintColor: 'rgb(0, 145, 234)',
    textColor: 'rgba(0, 0, 0, .87)',
    baseColor: '#777777',
    selectionColor: 'rgba(0, 0, 0, .15)',

    errorColor: 'rgb(213, 0, 0)',

    lineWidth: StyleSheet.hairlineWidth,
    activeLineWidth: 2,

    disabled: false,
    disabledLineType: 'dotted',
    disabledLineWidth: 1,
  };

  static propTypes = {
    ...TextInputPropTypes,

    animationDuration: PropTypes.number,

    fontSize: PropTypes.number,
    helperFontSize: PropTypes.number,
    labelFontSize: PropTypes.number,
    labelHeight: PropTypes.number,
    labelPadding: PropTypes.number,
    inputContainerPadding: PropTypes.number,

    labelTextStyle: Text.propTypes.style,
    helperTextStyle: Text.propTypes.style,
    affixTextStyle: Text.propTypes.style,

    tintColor: PropTypes.string,
    textColor: PropTypes.string,
    baseColor: PropTypes.string,
    selectionColor: PropTypes.string,

    label: PropTypes.string.isRequired,
    helper: PropTypes.string,

    characterRestriction: PropTypes.number,

    error: PropTypes.string,
    errorColor: PropTypes.string,

    lineWidth: PropTypes.number,
    activeLineWidth: PropTypes.number,

    disabled: PropTypes.bool,
    disabledLineType: Line.propTypes.type,
    disabledLineWidth: PropTypes.number,

    renderAccessory: PropTypes.func,
    onClear: PropTypes.func,

    format: PropTypes.func,
    parse: PropTypes.func,

    // shrink: PropTypes.boolean,

    prefix: PropTypes.string,
    suffix: PropTypes.string,

    containerStyle: (ViewPropTypes || View.propTypes).style,
    inputContainerStyle: (ViewPropTypes || View.propTypes).style,
  };

  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onPress = this.focus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.onFocusAnimationEnd = this.onFocusAnimationEnd.bind(this);

    this.inputRef = React.createRef();

    this.updateRef = this.updateRef.bind(this, 'input');
    this.inputRef = React.createRef();

    let { value, error, fontSize } = this.props;

    this.mounted = false;
    this.state = {
      text: value,

      focus: new Animated.Value(this.focusState(error, false)),
      focused: false,
      receivedFocus: false,

      error: error,
      errored: !!error,

      height: fontSize * 1.5,
      secureTextEntry: false,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let { error } = this.state;

    if (null != props.value) {
      this.setState({ text: props.value });
    }

    if (props.error && props.error !== error) {
      this.setState({ error: props.error });
    }

    if (props.error !== this.props.error) {
      this.setState({ errored: !!props.error });
    }
  }

  componentDidMount() {
    this.mounted = true;
    const { type } = this.props;
    if (type === 'password') {
      this.togglePasswordVisibility();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillUpdate(props, state) {
    let { error, animationDuration: duration } = this.props;
    let { focus, focused } = this.state;

    if (props.error !== error || focused ^ state.focused) {
      let toValue = this.focusState(props.error, state.focused);

      Animated.timing(focus, {
        toValue,
        duration,
        useNativeDriver: false,
      }).start(this.onFocusAnimationEnd);
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  focusState(error, focused) {
    return error ? -1 : focused ? 1 : 0;
  }

  focus() {
    let { disabled, editable } = this.props;

    if (!disabled && editable && this.inputRef?.current?.focus) {
      try {
        this.inputRef.current.focus();
      } catch (e) {}
    }
  }

  blur() {
    try {
      this.inputRef.current.blur();
    } catch (e) {}
  }

  clear() {
    const { onClear } = this.props;
    try {
      this.inputRef.current.clear();
    } catch (e) {}

    /* onChangeText is not triggered by .clear() */
    this.onChangeText('');
    if (typeof onClear === 'function') onClear();
  }

  value() {
    let { text, receivedFocus } = this.state;
    let { value, defaultValue } = this.props;

    return receivedFocus || null != value || null == defaultValue
      ? text
      : defaultValue;
  }

  isFocused() {
    try {
      return this.inputRef.current.isFocused();
    } catch (e) {}
  }

  isRestricted() {
    let { characterRestriction } = this.props;
    let { text = '' } = this.state;

    return characterRestriction < text.length;
  }

  onFocus(event) {
    let { onFocus, clearTextOnFocus } = this.props;

    if ('function' === typeof onFocus) {
      onFocus(event);
    }

    if (clearTextOnFocus) {
      this.clear();
    }

    this.setState({ focused: true, receivedFocus: true });
  }

  onBlur(event) {
    let { onBlur } = this.props;

    if ('function' === typeof onBlur) {
      onBlur(event);
    }

    this.setState({ focused: false });
  }

  onChange(event) {
    let { onChange, multiline } = this.props;

    if ('function' === typeof onChange) {
      onChange(event);
    }

    /* XXX: onContentSizeChange is not called on RN 0.44 and 0.45 */
    if (multiline && 'android' === Platform.OS) {
      if (/^0\.4[45]\./.test(RN.version)) {
        this.onContentSizeChange(event);
      }
    }
  }

  onChangeText(text) {
    let { onChangeText, type, parse } = this.props;
    if (parse) {
      text = parse(text);
    } else {
      switch (type) {
        case 'currency':
          text = text.replace(/,/g, '.');
          break;
        case 'mobile_custom':
          text = text.replace(/[.,+]/g, '');
          break;
      }
    }

    this.setState({ text });

    if ('function' === typeof onChangeText) onChangeText(text);
  }

  onContentSizeChange(event) {
    let { onContentSizeChange, fontSize } = this.props;
    let { height } = event.nativeEvent.contentSize;

    if ('function' === typeof onContentSizeChange) {
      onContentSizeChange(event);
    }

    this.setState({
      height: Math.max(
        fontSize * 1.5,
        Math.ceil(height) + Platform.select({ ios: 5, android: 1 }),
      ),
    });
  }

  onFocusAnimationEnd() {
    if (this.mounted) {
      this.setState((state, { error }) => ({ error }));
    }
  }

  // renderAccessory() {
  //   let { renderAccessory } = this.props;

  //   if ('function' !== typeof renderAccessory) {
  //     return null;
  //   }

  //   return <View style={styles.accessory}>{renderAccessory()}</View>;
  // }

  togglePasswordVisibility() {
    this.setState(({ secureTextEntry }) => ({
      secureTextEntry: !secureTextEntry,
    }));
  }

  renderAccessory(type) {
    switch (type) {
      case 'mobile_custom':
        return (
          <View style={styles.accessory}>
            <MaterialIcons
              size={24}
              name={'clear'}
              color="#9D9D9D"
              onPress={() => this.clear()}
              // suppressHighlighting
            />
          </View>
        );
      case 'id_number':
        const { toggleVisibility, visibility } = this.props;
        return (
          <View style={styles.accessory}>
            <Ionicons
              size={24}
              name={!visibility ? 'md-eye' : 'md-eye-off'}
              color="#9D9D9D"
              onPress={() => toggleVisibility(!visibility)}
              // suppressHighlighting
            />
          </View>
        );
      case 'password':
        const { secureTextEntry } = this.state;
        return (
          <View style={styles.accessory}>
            <Ionicons
              size={24}
              name={secureTextEntry ? 'md-eye' : 'md-eye-off'}
              color="#9D9D9D"
              onPress={() => this.togglePasswordVisibility()}
              // suppressHighlighting
            />
          </View>
        );
      case 'copy':
        return (
          <View style={styles.accessory}>
            <RenderCopy value={this.props?.value} />
          </View>
        );
      case 'optional':
        return (
          <Text style={{ fontSize: 11, color: '#9D9D9D' }} id="optional" />
        );
      default:
        return null;
    }
  }

  renderAffix(type, active, focused) {
    let {
      [type]: affix,
      fontSize,
      baseColor,
      animationDuration,
      affixTextStyle,
    } = this.props;

    if (null == affix) {
      return null;
    }

    let props = {
      type,
      active,
      focused,
      fontSize,
      baseColor,
      animationDuration,
    };

    return (
      <Affix style={affixTextStyle} {...props}>
        {affix}
      </Affix>
    );
  }

  render() {
    let {
      receivedFocus,
      focus,
      focused,
      error,
      errored,
      height,
      secureTextEntry,
      text = '',
    } = this.state;
    let {
      style: inputStyleOverrides,
      label,
      helper,
      value,
      defaultValue,
      characterRestriction: max,
      editable,
      disabled,
      disabledLineType,
      disabledLineWidth,
      animationDuration,
      fontSize,
      helperFontSize,
      labelFontSize,
      labelHeight,
      labelPadding,
      inputContainerPadding,
      labelTextStyle,
      helperWrapperStyle,
      helperTextStyle,
      tintColor,
      baseColor,
      selectionColor,
      textColor,
      errorColor,
      lineWidth,
      activeLineWidth,
      containerStyle,
      inputContainerStyle: inputContainerStyleOverrides,
      clearTextOnFocus,
      containerBackgroundColor,
      type,
      shrink,
      min,
      hideHelper,
      format,
      noMargin,
      required,
      ...props
    } = this.props;

    if (props.multiline && props.height) {
      /* Disable autogrow if height is passed as prop */
      height = props.height;
    }

    let defaultVisible = !(
      receivedFocus ||
      null != value ||
      null == defaultValue
    );

    if (format) {
      text = format(text);
    } else {
      switch (type) {
        case 'amount':
          text = text => text.toString();
      }
    }
    value = defaultVisible ? defaultValue : format ? format(text) : text;

    let active = !!value; // || props.placeholder);
    let count = value ? value.length : 0;
    let restricted = max + 5 < count;

    let textAlign = I18nManager.isRTL ? 'right' : 'left';

    let borderBottomColor = restricted
      ? errorColor
      : focus.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [errorColor, baseColor, tintColor],
        });

    let borderBottomWidth = restricted
      ? activeLineWidth
      : focus.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [activeLineWidth, lineWidth, activeLineWidth],
        });

    let inputContainerStyle = {
      paddingTop: labelHeight + (props.multiline ? 10 : 0),
      paddingBottom: inputContainerPadding - (props.multiline ? 10 : 0),
      paddingHorizontal: 0,

      ...(disabled
        ? { overflow: 'hidden' }
        : { borderBottomColor, borderBottomWidth }),

      ...(props.multiline
        ? {
            height:
              Platform.OS === 'web'
                ? 'auto'
                : labelHeight +
                  inputContainerPadding +
                  height *
                    (focused &&
                    Platform.OS === 'android' &&
                    get(props, ['placeholder', 'length'], 0) > 30 &&
                    text.length === 0
                      ? 1.5
                      : 1),
          }
        : {
            height: labelHeight + inputContainerPadding + fontSize * 1.5,
          }),
    };

    let inputStyle = {
      fontSize,
      textAlign,

      color: disabled || defaultVisible ? baseColor : textColor,

      ...(props.multiline
        ? {
            height: fontSize * 1.5 + height,

            ...Platform.select({
              ios: { top: -1 },
              android: { textAlignVertical: 'top' },
            }),
          }
        : { height: fontSize * 1.5 }),
    };

    let errorStyle = {
      color: errorColor,

      opacity: focus.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [1, 0, 0],
      }),

      fontSize: helper
        ? helperFontSize
        : focus.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [helperFontSize, 0, 0],
          }),
    };

    let helperStyle = {
      color: baseColor,

      opacity: focus.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 1, 1],
      }),

      fontSize: helperFontSize,
    };

    let placeholderStyle = {
      // ...inputContainerStyle,
      // opacity: focus.interpolate({
      //   inputRange: [-1, 0, 1],
      //   outputRange: [1, 0, 0],
      // }),
      // opacity: 0.5,
      // opacity: focus.interpolate({
      //   inputRange: [-1, 0, 1],
      //   outputRange: [1, 0, 0],
      // }),
      // fontSize: helper
      //   ? fontSize
      //   : focus.interpolate({
      //       inputRange: [-1, 0, 1],
      //       outputRange: [fontSize, 0, 0],
      //     }),
    };

    let helperContainerStyle = {
      flexDirection: 'row',
      height: helper || min || max || error ? helperFontSize * 2 : 0,
      // paddingHorizontal: inputContainerPadding,
      // focus.interpolate({
      //     inputRange: [-1, 0, 1],
      //     outputRange: [helperFontSize * 2, 0, 8],
      //   }),
    };

    let containerProps = {
      style: [
        containerStyle,
        {
          marginVertical: 8,
          marginHorizontal: 0,
          backgroundColor: containerBackgroundColor,
          borderTopRightRadius: 4,
          borderTopLeftRadius: 4,
          overflow: 'hidden',
        },
      ],
      onStartShouldSetResponder: () => true,
      onResponderRelease: this.onPress,
      // pointerEvents: !disabled && editable ? 'auto' : 'none',
      pointerEvents: !disabled ? 'auto' : 'none',
    };

    let inputContainerProps = {
      useNativeDriver: false,
      style: [
        styles.inputContainer,
        inputContainerStyle,
        inputContainerStyleOverrides,
      ],
    };

    let lineProps = {
      type: disabledLineType,
      width: disabledLineWidth,
      color: baseColor,
    };

    let labelProps = {
      required,
      baseSize: labelHeight,
      basePadding: labelPadding,
      fontSize: labelTextStyle?.fontSize || fontSize,
      activeFontSize: labelFontSize,
      tintColor,
      baseColor,
      errorColor,
      animationDuration,
      active: active || shrink,
      focused,
      errored,
      restricted,
      style: labelTextStyle,
    };

    let counterProps = {
      baseColor,
      errorColor,
      count,
      min,
      max,
      fontSize: helperFontSize,
      style: helperTextStyle,
    };

    let keyboardType =
      type === 'email'
        ? 'email-address'
        : type === 'mobile' || type === 'mobile_custom'
        ? 'phone-pad'
        : type === 'currency' || type === 'number'
        ? 'numeric'
        : 'default';

    let autoCapitalize = type?.match(/email|password/)
      ? 'none'
      : type?.match(/currency|number/)
      ? 'words'
      : 'sentences';

    let autoCorrect =
      type === 'plain' || type === 'email' || type === 'password'
        ? false
        : true;

    const InputProps = {
      style: [
        styles.input,
        inputStyle,
        inputStyleOverrides,
        focused && props.placeholder ? placeholderStyle : null,
      ],
      selectionColor: selectionColor,
      keyboardType: keyboardType,
      secureTextEntry: secureTextEntry,
      autoCapitalize: autoCapitalize,
      autoCorrect: autoCorrect,
      ...props,
      editable: !disabled && editable,
      onChange: this.onChange,
      onChangeText: this.onChangeText,
      onContentSizeChange: this.onContentSizeChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      placeholder:
        focused || props.activeInputPlaceholder ? props.placeholder : '',
      value: value,
    };

    return (
      <View {...containerProps}>
        <Animated.View {...inputContainerProps}>
          {disabled && <Line {...lineProps} />}

          <Label {...labelProps}>{label}</Label>

          <View style={styles.row}>
            {this.renderAffix('prefix', active, focused)}
            {this.props.prefixComponent}
            {/* {type === 'currency' ? (
              <TextInputMask
                {...InputProps}
                type={'money'}
                value={value && parseFloat(value)}
                options={{
                  precision: this.props.currency?.divisibility ?? 2,
                  // precision: 2,
                  separator: '.',
                  delimiter: ',',
                  unit: '',
                }}
              />
            ) : (
              <TextInput {...InputProps} />
            )} */}

            <RenderInput
              {...InputProps}
              forwardRef={this.inputRef}
              type={type === 'currency' ? 'number' : type}
            />

            {this.renderAccessory(type)}
            {this.renderAffix('suffix', active, focused)}
          </View>
        </Animated.View>

        <Animated.View
          useNativeDriver={false}
          style={
            type === 'password'
              ? [
                  helperContainerStyle,
                  {
                    height: hideHelper
                      ? helper || min || max || error
                        ? helperFontSize * 2
                        : 0
                      : helper || min || max || error
                      ? helperFontSize * 11
                      : 0,
                  },
                ]
              : helperContainerStyle
          }>
          <View style={styles.flex}>
            <Helper
              style={[errorStyle, helperTextStyle, { color: errorColor }]}
              helperWrapperStyle={helperWrapperStyle}>
              {error}
            </Helper>
            {type === 'password' ? (
              helper ? (
                <PasswordSupportiveText
                  textColor={textColor}
                  value={value}
                  style={[helperStyle, helperTextStyle]}
                  hideHelper={hideHelper}
                />
              ) : null
            ) : (
              <Helper
                style={[helperStyle, helperTextStyle]}
                helperWrapperStyle={helperWrapperStyle}>
                {helper}
              </Helper>
            )}
          </View>

          <Counter {...counterProps} />
        </Animated.View>
      </View>
    );
  }
}

function RenderInput(props) {
  const { placeholder, error, forwardRef } = props;
  const { t } = useTranslation('common');

  return (
    <TextInput
      {...props}
      placeholder={t(placeholder)}
      error={t(error)}
      ref={forwardRef}
    />
  );
}

function RenderCopy(props) {
  const { showToast } = useToast();

  function copyContentToClipboard() {
    const { value } = props;
    Clipboard.setString(value);
    showToast({
      id: 'copied_to_clipboard',
      textStyle: { textAlign: 'center' },
    });
  }
  return (
    <MaterialIcons
      name="content-copy"
      size={24}
      color="#9D9D9D"
      onPress={() => copyContentToClipboard()}
    />
  );
}

const styles = {
  inputContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },

  input: {
    // top: 2,
    padding: 0,
    marginTop: 8,
    margin: 0,
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    // backgroundColor: 'purple',
  },

  flex: {
    flex: 1,
  },

  accessory: {
    // top: 0,
    // right: 8,
    paddingHorizontal: 4,
    // position: 'absolute',
    // backgroundColor: 'orange',
    // justifyContent: 'center',
    // alignSelf: 'flex-start',
  },
};
