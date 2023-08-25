import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import _Text from '../outputs/Text';
import { View as _View } from '../layout/View';
import context from '../context';

import { Spinner } from '../outputs/Spinner';
import { Icon } from 'components/outputs/Icon';
import { normalizeFontSize } from 'utility/general';
import { useIsRTL } from 'hooks/general';

const _FullScreenForm = props => {
  const {
    viewStyleContainer,
    viewStyleHeader,
    viewStyleContent,
    viewStyleFooter,
    textStyleAction,
  } = styles;

  const {
    iconHeaderLeft,
    onPressHeaderLeft,
    textHeaderRight,
    textHeaderRightSize = 16,
    onPressHeaderRight,
    textFooterLeft,
    onPressFooterLeft,
    textFooterRight,
    onPressFooterRight,
    textHeaderLeft,
    loading,
    colors,
    type,
    headerStyle = {},
  } = props;
  const isRTL = useIsRTL();

  const color = _contrastColor(colors, type);

  return (
    <View
      style={[
        viewStyleContainer,
        { backgroundColor: _backgroundColor(colors, type) },
      ]}>
      {loading ? (
        <Spinner size="large" />
      ) : (
        <View style={{ flex: 1 }}>
          {iconHeaderLeft || textHeaderRight || textHeaderLeft ? (
            <View style={{ ...viewStyleHeader, ...headerStyle }}>
              {iconHeaderLeft ? (
                <TouchableOpacity
                  onPress={onPressHeaderLeft}
                  style={{
                    width: 'auto',
                    maxWidth: 72,
                    alignItems: 'flex-start',
                    paddingLeft: 8,
                  }}>
                  <Icon
                    set={'Feather'}
                    // style={{ width: 'a' }}
                    name={isRTL ? 'chevron-right' : 'chevron-left'}
                    size={normalizeFontSize(26)}
                    color={'font'}
                  />
                </TouchableOpacity>
              ) : textHeaderLeft ? (
                <TouchableOpacity onPress={onPressHeaderLeft}>
                  <_View ml={1}>
                    <_Text
                      s={16}
                      c={'primary'}
                      fW={'500'}
                      style={{ textDecorationLine: 'underline' }}
                      id={textHeaderLeft}></_Text>
                  </_View>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {textHeaderRight ? (
                <TouchableOpacity onPress={onPressHeaderRight}>
                  <_View mr={1}>
                    <_Text
                      s={16}
                      c={'primary'}
                      id={textHeaderRight}
                      fW={'500'}
                      style={{ textDecorationLine: 'underline' }}></_Text>
                  </_View>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          ) : null}

          <View style={viewStyleContent}>{props.children}</View>

          {textFooterRight || textFooterLeft ? (
            <View style={viewStyleFooter}>
              {textFooterLeft ? (
                <TouchableOpacity onPress={onPressFooterLeft}>
                  <Text style={[textStyleAction, { color }]}>
                    {textFooterLeft}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {textFooterRight ? (
                <TouchableOpacity onPress={onPressFooterRight}>
                  <Text
                    style={[
                      textStyleAction,
                      {
                        color,
                        textAlign: 'right',
                      },
                    ]}>
                    {textFooterRight}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  viewStyleHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    minHeight: 64,
    zIndex: 0,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  viewStyleContent: {
    flex: 1,
    flexDirection: 'column',
    zIndex: 1,
  },
  viewStyleFooter: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 64,
    paddingBottom: 16,
    zIndex: 0,
    alignItems: 'center',
  },
  iconStyleHeaderLeft: {
    margin: 16,
  },
  textStyleAction: {
    fontSize: 18,
    padding: 16,
    minHeight: 56,
  },
};

const FullScreenForm = context(_FullScreenForm);

export { FullScreenForm };

const _backgroundColor = (colors, type) => {
  return colors[type + 'Screen'];
};

const _contrastColor = (colors, type) => {
  return colors[type + 'ScreenContrast'];
};
