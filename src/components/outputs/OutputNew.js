import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Spinner } from './Spinner';
import { useTheme } from 'contexts/ThemeContext';
import { useToast } from 'contexts/ToastContext';
import Text from './Text';
import * as Clipboard from 'expo-clipboard';

export default function Output(props) {
  const {
    label,
    values,
    value,
    value2,
    copy,
    edit,
    editAction,
    link,
    right,
    valueBold,
    valueColor,
    labelColor,
    labelBold,
    fontSize,
    horizontal,
    placeholder,
    centered,
    loading,
    goTo,
    gotoAddress,
    onPress,
    viewStyleContainer,
    wrap,
    count,
  } = props;
  const { colors } = useTheme();
  const { showToast } = useToast();

  function renderOutput() {
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
            ? { textAlign: 'right', width: '100%', paddingLeft: 12 }
            : {},
          fontSize && { fontSize },
          centered ? { textAlign: 'center', width: '100%' } : {},
          wrap ? { flexWrap: 'wrap' } : {},
        ]}>
        {value ? value : placeholder}
      </Text>
    );

    return loading ? (
      <Spinner align="right" size={20} />
    ) : (
      <View
        style={[viewStyleContent, right ? { justifyContent: 'flex-end' } : {}]}>
        <View style={horizontal ? viewStyleRow : viewStyleColumn}>
          {Boolean((value || values || placeholder) && label) && (
            <View
              style={horizontal ? viewStyleLabelHorizontal : viewStyleLabel}>
              <Text>
                <Text
                  tA={centered ? 'center' : 'left'}
                  style={[
                    horizontal ? textStyleLabelHorizontal : textStyleLabel,
                    {
                      color: labelColor ? labelColor : colors.font,
                      // opacity: 1,
                    },
                    labelBold ? { fontWeight: '600' } : {},
                  ]}
                  id={label}
                />
                {!!count && (
                  <Text
                    tA={centered ? 'center' : 'left'}
                    style={[
                      horizontal ? textStyleLabelHorizontal : textStyleLabel,
                      {
                        color: labelColor ? labelColor : colors.font,
                        // opacity: 1,
                      },
                      labelBold ? { fontWeight: '600' } : {},
                    ]}>
                    {' ' + count}
                  </Text>
                )}
              </Text>
            </View>
          )}

          <View
            style={[
              viewStyleValue,
              wrap ? { flex: 1 } : {},
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
                  horizontal ? { textAlign: 'right' } : {},
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

  async function _handlePressButtonAsync(link) {
    let result = await WebBrowser.openBrowserAsync(link);
    // this.setState({ result });
  }

  const { _viewStyleContainer } = styles;

  const combinedViewStyleContainer = {
    ..._viewStyleContainer,
    ...viewStyleContainer,
  };

  return (
    <View style={combinedViewStyleContainer}>
      {goTo ? (
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={0.2}
          onPress={() => goTo(gotoAddress, label)}>
          {renderOutput()}
        </TouchableHighlight>
      ) : copy ? (
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={0.2}
          onPress={() => {
            Clipboard.setString(value);
            showToast({
              id: 'copied_to_clipboard',
              text: '\n' + value,
              variant: 'success',
            });
          }}>
          {renderOutput()}
        </TouchableHighlight>
      ) : onPress ? (
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={0.2}
          onPress={() => onPress()}>
          {renderOutput()}
        </TouchableHighlight>
      ) : link ? (
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={0.2}
          onPress={() => _handlePressButtonAsync(link)}>
          {renderOutput()}
        </TouchableHighlight>
      ) : (
        renderOutput()
      )}
    </View>
  );
}

const styles = {
  _viewStyleContainer: {
    flexDirection: 'column',
    borderBottomWidth: 0,
    marginVertical: 8,
    // flex: 1,
    width: '100%',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    // maxWidth: '90%',
    // paddingRight: 8,
    // flex: 1, // TODO: check if this was used
  },
  textStyleLabelHorizontal: {
    fontSize: 16,
    // color: 'black',
    // opacity: 0.87,
  },
  textStyleLabel: {
    fontSize: 12,
    color: 'black',
    opacity: 0.7,
  },
  textStyleValue: {
    paddingLeft: 0,
    // minHeight: 20,
    // paddingTop: 2,
    paddingTop: 6,
    fontWeight: 'normal',
    // flex: 1,
    fontSize: 16,
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
