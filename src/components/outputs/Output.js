import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';

import context from '../context';
import { Spinner } from './Spinner';
import Text from './Text';

class _Output extends Component {
  renderOutput() {
    const {
      label,
      values,
      value,
      value2,
      copy,
      edit,
      editAction,
      link,
      colors,
      right,
      valueBold,
      valueColor,
      labelColor,
      labelBold,
      id,
      fontSize,
      horizontal,
      placeholder,
      centered,
      loading,
      textStyleValue: textStyleValueProps,
    } = this.props;

    const {
      viewStyleContent,
      viewStyleLabel,
      viewStyleLabelHorizontal,
      textStyleLabel,
      textStyleLabelHorizontal,
      viewStyleValue,
      textStyleValue,
      textStyleValue2,
      viewStyleRow,
      viewStyleColumn,
    } = styles;

    const TextComponent = (value, index) => (
      <Text
        width="auto"
        key={index}
        style={[
          textStyleValue,
          {
            color: !value
              ? '#CECECE'
              : valueColor
              ? colors.primary
              : colors.font,
          },
          valueBold ? { fontWeight: '600' } : {},
          horizontal
            ? {
                textAlign: 'right',
                width: '100%',
                paddingLeft: 12,
                paddingTop: 0,
              }
            : {},
          fontSize && { fontSize },
          centered ? { textAlign: 'center', width: '100%' } : {},
          textStyleValueProps,
        ]}
        id={value ? value : placeholder}
      />
    );

    return loading ? (
      <Spinner align="right" size={20} />
    ) : (
      <View
        style={[viewStyleContent, right ? { justifyContent: 'flex-end' } : {}]}>
        <View style={horizontal ? viewStyleRow : viewStyleColumn}>
          {Boolean((value || values || placeholder) && (label || id)) && (
            <View
              style={horizontal ? viewStyleLabelHorizontal : viewStyleLabel}>
              <Text
                tA={centered ? 'center' : 'left'}
                id={id ?? label}
                style={[
                  horizontal ? textStyleLabelHorizontal : textStyleLabel,
                  {
                    color: labelColor ? labelColor : colors.font,
                    opacity: labelColor ? 1 : 0.7,
                  },
                  labelBold ? { fontWeight: '600' } : {},
                ]}
              />
            </View>
          )}

          <View
            style={[
              viewStyleValue,
              // { marginLeft: (edit || link || copy) && centered ? 28 : 0 },
            ]}>
            {values && values.length && values.length > 0
              ? values.map((value, index) => TextComponent(value, index))
              : TextComponent(value, 0)}

            {value2 ? (
              <Text
                style={[
                  textStyleValue2,
                  { color: colors.font },
                  horizontal ? { textAlign: 'right', paddingTop: 0 } : {},
                  centered ? { textAlign: 'center' } : {},
                ]}>
                {value2}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
    {
      /* 
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}><View>
              {edit ? (
                <Icon
                  name="circle-edit-outline"
                  size={20}
                  color={'black'}
                  onPress={editAction}
                />
              ) : null}
              {copy && (
                <Icon
                  name="content-copy"
                  size={20}
                  color={'black'}
                  style={{ marginLeft: 9 }}
                />
              )}
              {link ? (
                <Icon
                  name="open-in-new"
                  size={20}
                  color={'black'}
                  style={{ paddingLeft: 12 }}
                />
              ) : null}
            </View>
            </View> */
    }
  }

  _handlePressButtonAsync = async link => {
    const canOpenURL = await Linking.canOpenURL(link);
    if (canOpenURL) {
      let result = await Linking.openURL(link);
      this.setState({ result });
    }
  };

  render() {
    const {
      goTo,
      gotoAddress,
      label,
      value,
      copy,
      onPress,
      link,
      viewStyleContainer,
      showToast,
    } = this.props;

    const { _viewStyleContainer } = styles;

    const combinedViewStyleContainer = {
      ..._viewStyleContainer,
      ...viewStyleContainer,
    };

    function handleCopy() {
      Clipboard.setString(value);
      typeof showToast === 'function' &&
        showToast({
          id: 'copied_to_clipboard',
          text: '\n' + value,
          variant: 'success',
        });
    }

    return (
      <View style={combinedViewStyleContainer}>
        {goTo ? (
          <TouchableHighlight
            underlayColor={'white'}
            activeOpacity={0.2}
            onPress={() => goTo(gotoAddress, label)}>
            {this.renderOutput()}
          </TouchableHighlight>
        ) : copy ? (
          <TouchableHighlight
            underlayColor={'white'}
            activeOpacity={0.2}
            onPress={handleCopy}>
            {this.renderOutput()}
          </TouchableHighlight>
        ) : onPress ? (
          <TouchableHighlight
            underlayColor={'white'}
            activeOpacity={0.2}
            onPress={() => onPress()}>
            {this.renderOutput()}
          </TouchableHighlight>
        ) : link ? (
          <TouchableHighlight
            underlayColor={'white'}
            activeOpacity={0.2}
            onPress={() => this._handlePressButtonAsync(link)}>
            {this.renderOutput()}
          </TouchableHighlight>
        ) : (
          this.renderOutput()
        )}
      </View>
    );
  }
}

const styles = {
  _viewStyleContainer: {
    flexDirection: 'column',
    borderBottomWidth: 0,
    marginVertical: 8,
    // flex: 1,
    width: '100%',
    flexWrap: 'wrap',
  },
  viewStyleContent: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    // justifyContent: 'center',
  },
  viewStyleColumn: {
    // flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  viewStyleRow: {
    justifyContent: 'space-between',
    // flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    width: '100%',
  },
  viewStyleLabelHorizontal: {
    flexDirection: 'row',
    // flex: 1,
    // width: '100%',
  },
  viewStyleLabel: {
    justifyContent: 'center',
  },
  viewStyleValue: {
    flexDirection: 'column',

    // width: '100%',
    // maxWidth: '90%',
    // paddingRight: 8,
    flex: 1, // TODO: check if this was used, it was - why was it removed -_-
  },
  textStyleLabelHorizontal: {
    fontSize: 16,
    color: 'black',
    opacity: 0.87,
  },
  textStyleLabel: {
    fontSize: 12,
    color: 'black',
    opacity: 0.7,
  },
  textStyleValue: {
    paddingLeft: 0,
    // minHeight: 20,
    paddingTop: 6,
    fontWeight: 'normal',
    // flex: 1,
    fontSize: 16,
    flexWrap: 'wrap',
  },
  textStyleValue2: {
    paddingLeft: 0,
    paddingTop: 2,
    fontWeight: 'normal',
    // flex: 1,
    opacity: 0.87,
    fontSize: 12,
  },
};

const Output = context(_Output);

export { Output };

/*
TODO:
1. Break apart horizontal / vertical outputs
2. Simplify to func comp & useContext
3. Handle variants better

*/
