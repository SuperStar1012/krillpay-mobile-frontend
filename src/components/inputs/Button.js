/* BUTTON */
/* Component | Stateless | Styled */
/* This is the main button component. Takes props to adjust it's size, type, color etc */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import context from '../context';
import { View } from '../layout/View';
import { safe } from 'utility/general';
import { Spinner } from '../outputs/Spinner';
import Text from '../outputs/Text';
import { CustomIcon } from '../outputs/CustomIcon';
import { omit } from 'lodash';

const _Button = props => {
  const {
    onPress,
    label,
    reference,
    animation,
    disabled,
    size,
    icon,
    iconSet,
    iconSize,
    containerStyle,
    design,
    loading,
    wide,
    customIcon,
    children,
    type,
    inverted,
    color,
    id,
    capitalize,
    ns,
    context,

    round,
    buttonStyle,
    colors,
    textStyle,
    ...restProps
  } = props;

  function _buttonStyle() {
    let backgroundColor = 'transparent';
    if (disabled && type !== 'text' && type !== 'outlined') {
      backgroundColor = colors['grey3'];
    } else if (type === 'contained') {
      backgroundColor = colors[color + (inverted ? 'Contrast' : '')]
        ? colors[color + (inverted ? 'Contrast' : '')]
        : color;
    }
    return {
      ...styles._buttonStyle,
      ...(type === 'outlined'
        ? {
            borderWidth: 1,
            borderColor: disabled ? colors['grey3'] : colors[color],
          }
        : {}),
      backgroundColor:
        type === 'outlined'
          ? 'white'
          : loading && type !== 'text'
          ? colors.grey3
          : backgroundColor,
      height:
        size === 'large'
          ? 44
          : size === 'medium'
          ? 36
          : size === 'small'
          ? 30
          : size === 'tiny'
          ? 26
          : 36,
      borderRadius:
        design.buttons.rounded || round
          ? size === 'large'
            ? 22
            : size === 'medium'
            ? 18
            : size === 'small'
            ? 15
            : size === 'tiny'
            ? 12
            : 18
          : 2.5,
      // shadowRadius: design.buttons.shadow,
      flex: wide ? 1 : 0,
      paddingHorizontal: wide ? 4 : 12,
      ...buttonStyle,
      ...(size === 'tiny'
        ? { paddingTop: type === 'outlined' ? 5 : 6 }
        : !size
        ? { paddingTop: 10 }
        : {}),
    };
  }

  function _textStyle() {
    return {
      color:
        loading && type === 'text'
          ? 'transparent'
          : disabled && type === 'outlined'
          ? colors['grey3']
          : fontColor(),
      fontSize:
        size === 'large'
          ? 18
          : size === 'medium'
          ? 14
          : size === 'small'
          ? 12
          : size === 'tiny'
          ? 10
          : 14,
      lineHeight: 14,
      ...textStyle,
    };
  }

  function fontColor() {
    let temp = safe(colors, color, color);
    if (type === 'contained') {
      temp = colors[color + (inverted ? '' : 'Contrast')];
      if (!temp) {
        temp = '#F0F0F0';
      }
    }
    return temp;
  }

  const { _containerStyle } = styles;
  const sizeInt =
    size === 'large' ? 32 : size === 'small' ? 18 : size === 'tiny' ? 14 : 22;
  if (children) {
    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}
        {...restProps}>
        {children}
      </TouchableOpacity>
    );
  }
  if (customIcon) {
    return (
      <TouchableOpacity
        style={[_containerStyle, containerStyle]}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}
        {...restProps}>
        <View w="100%" fD="row" aI="center">
          <CustomIcon name={customIcon} size={sizeInt * 1.5} />
          <View pl={1}>
            <Text
              id={id}
              o={disabled ? 0.85 : 1}
              tA="left"
              t="h4"
              ns={ns}
              context={context}>
              {label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const wideProps = wide ? { f: 1 } : {};

  return (
    <Animatable.View
      ref={reference}
      style={[
        _containerStyle,
        // { elevation: design.buttons.elevation },
        containerStyle,
      ]}
      animation={animation}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={_buttonStyle()}>
        <React.Fragment>
          <View fD={'row'} aI={'center'} jC={'center'} {...wideProps}>
            {icon ? (
              <Icon
                name={icon}
                iconSet={iconSet}
                size={iconSize ?? sizeInt}
                color={fontColor()}
              />
            ) : null}
            {label || id ? (
              <View {...wideProps}>
                {!wide && loading && (
                  <View pos="absolute" w="100%" style={{ top: -10 }}>
                    <Spinner color={'primary'} size="small" />
                  </View>
                )}
                <Text
                  context={context}
                  // adjustsFontSizeToFit
                  textBreakStrategy="simple"
                  id={id}
                  ns={ns}
                  tA="center"
                  numberOfLines={1}
                  capitalize={type !== 'text' || capitalize}
                  t="bu"
                  w="100%"
                  fW={'500'}
                  s={_textStyle()?.fontSize}
                  o={disabled ? 0.85 : 1}
                  style={omit(_textStyle(), 'fontSize')}>
                  {label}
                </Text>
              </View>
            ) : null}
          </View>
          {loading && wide ? (
            <View pos={'absolute'}>
              <Spinner color={'primary'} size="small" />
            </View>
          ) : null}
        </React.Fragment>
      </TouchableOpacity>
    </Animatable.View>
  );
};

_Button.propTypes = {
  label: PropTypes.string, // Text displayed on button
  reference: PropTypes.func, // For animations
  animation: PropTypes.string, // Animation type
  disabled: PropTypes.bool, // Disable touchable component
  onPress: PropTypes.func, // Function to execute on press
  icon: PropTypes.string, // Icon displayed on left of button
  size: PropTypes.string, // Size of button (small / default or '' / large)
  type: PropTypes.string, // Type of button (text, contained, TODO: outlined)
  backgroundColor: PropTypes.string, // Button color
  textColor: PropTypes.string, // Text color
  round: PropTypes.bool, // Rounded corners
  buttonStyle: PropTypes.object, // override button style
  containerStyle: PropTypes.object, // override container style
  textStyle: PropTypes.object, // override text style
  color: PropTypes.string, // main color
  colors: PropTypes.object, // colors from context
  design: PropTypes.object, // design from context
  wide: PropTypes.bool,
  loading: PropTypes.bool,
};

_Button.defaultProps = {
  label: '',
  reference: () => {},
  animation: '',
  disabled: false,
  onPress: () => {},
  icon: '',
  iconSet: 'MaterialIcons',
  size: '',
  type: 'contained',
  round: false,
  buttonStyle: {},
  containerStyle: {},
  color: 'primary',
  design: {},
  wide: false,
  loading: false,
};

const styles = {
  _containerStyle: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  _buttonStyle: {
    flexDirection: 'row',
    minWidth: 64,
    padding: 8,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginVertical: 0,
  },
};

const Button = context(_Button);

export { Button };

/*
TODO:
1. Convert to func component
2. useContext

Tests:
1. Renders with label
2. Renders with children - is this even needed? Safer to use Touchable directly
3. onClick fires off onPress function
*/
