import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import Text from '../outputs/Text';
import Modal from 'react-native-modal';
import context from '../context';
import { Spinner } from '../outputs/Spinner';
import { CardActions } from '../card/CardActions';
import { View } from './View';
import { Button } from '../inputs/Button';
import { Icon } from 'components/outputs/Icon';

const _PopUpGeneral = props => {
  const {
    containerStyle,
    viewStyleTitleContainer,
    viewStyleTitle,
    textStyleTitle,
    textStyleSubtitle,
    iconStyleTitleRight,
    viewStyleFooter,
    viewStyleContent,
    bottomModal,
    textStyleContent,
    modalStyle,
    iconStyleTitleLeft,
    textStyleError,
  } = styles;

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  let {
    title,
    subtitle,
    iconTitleRight,
    onPressTitleRight,
    iconTitleLeft,
    titleIconContent,
    onPressTitleLeft,
    modalActionOne,
    textActionOne,
    onPressActionOne,
    modalActionTwo,
    textActionTwo,
    onPressActionTwo,
    loading,
    children,
    content,
    contentText,
    visible,
    onDismiss,
    errorText,
    colorTitleText,
    colors,
    design,
    contentExtra,
    docked,
    modal,
    actionOne,
    actionTwo,
    scrollView,
    buttonActions,
    type,
    titleColor = 'primary',
    titleBold,
    showClose,
    ns,
    containerStyle: containerStyleProps = {},
    textLangContext = {},
  } = props;

  if (showClose && !iconTitleRight) {
    iconTitleRight = 'close';
    onPressTitleRight = onDismiss;
  }

  if (modal) {
    ({
      title,
      subtitle,
      errorText,
      visible,
      contentText,
      content,
      type,
      loading,
      onDismiss,
      actionOne,
      actionTwo,
    } = modal);

    modalActionOne = actionOne;
    modalActionTwo = actionTwo;
  }

  if (textActionOne && !modalActionOne) {
    modalActionOne = {
      ...modalActionOne,
      label: textActionOne,
      onPress: onPressActionOne,
    };
  }

  if (textActionTwo && !modalActionTwo) {
    modalActionTwo = {
      ...modalActionTwo,
      label: textActionTwo,
      onPress: onPressActionTwo,
      type: 'text',
    };
  }

  const ButtonActions = () => {
    return (
      <View fD={'column'} pt={1} w="100%">
        {buttonActions.map((button, index) => (
          <View f={1} key={index} w="100%">
            <Button wide {...button} id={button.text ?? button.id} />
          </View>
        ))}
      </View>
    );
  };

  if (!visible) return null;
  const showTitleContainer = !!(
    title ||
    subtitle ||
    iconTitleRight ||
    iconTitleLeft
  );

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      style={docked ? bottomModal : modalStyle}
      coverScreen
      avoidKeyboard
      propagateSwipe={scrollView}
      onBackdropPress={onDismiss}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      hideModalContentWhileAnimating>
      <View
        style={[
          containerStyle,
          { borderRadius: design.popUp.cornerRadius, flex: 0 },
          docked
            ? {
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                margin: 0,
                maxHeight: '95%',
              }
            : {},
          contentExtra
            ? {
                paddingTop: 0,
                paddingHorizontal: 0,
              }
            : {},
          containerStyleProps,
        ]}>
        <View style={{ position: 'relative' }}>
          {showTitleContainer ? (
            <View resizeMode="cover" style={viewStyleTitleContainer}>
              <View style={{ minWidth: 36 }}>
                {!!iconTitleLeft && (
                  <View style={iconStyleTitleLeft}>
                    <Button onPress={onPressTitleLeft || onDismiss}>
                      <Icon
                        set={'MaterialIcons'}
                        style={{ alignItems: 'flex-start' }}
                        name={iconTitleLeft}
                        size={26}
                        color="textDark"
                      />
                    </Button>
                  </View>
                )}
              </View>
              <View>
                {!!titleIconContent && (
                  <View style={{ marginLeft: 2, marginRight: 8 }}>
                    {titleIconContent}
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {title ? (
                  <Text
                    s={20}
                    c={titleColor}
                    fW={titleBold ? '500' : '400'}
                    tA={props.titleTextAlign || 'center'}
                    style={[textStyleTitle]}
                    id={title}
                    ns={ns}
                  />
                ) : null}
                {subtitle ? (
                  <Text
                    ns={ns}
                    style={[
                      textStyleSubtitle,
                      {
                        color: colorTitleText ? colorTitleText : colors.font,
                      },
                    ]}
                    id={subtitle}></Text>
                ) : null}
              </View>
              <View style={{ minWidth: 36 }}>
                {!!iconTitleRight && (
                  <View style={iconStyleTitleRight}>
                    <Button onPress={onPressTitleRight}>
                      <Icon
                        set={'MaterialIcons'}
                        // style={{ alignItems: 'flex-start' }}
                        name={iconTitleRight}
                        size={20}
                        color="#434343"
                      />
                    </Button>
                  </View>
                )}
              </View>
            </View>
          ) : null}

          <ScrollView>
            <View
              style={[
                viewStyleContent,
                { marginTop: showTitleContainer ? 44 : 0 },
              ]}>
              {contentText ? (
                <Text
                  style={textStyleContent}
                  fW={'400'}
                  id={contentText}
                  context={textLangContext}
                />
              ) : null}
              {children ? children : null}
              {content ? content : null}
              {errorText ? (
                <Text style={[textStyleError, { color: colors.error }]}>
                  {errorText}
                </Text>
              ) : null}
            </View>
            {Boolean(modalActionOne || modalActionTwo || buttonActions) && (
              <View style={viewStyleFooter}>
                {modalActionOne || modalActionTwo ? (
                  <View w="100%">
                    {loading ? (
                      <Spinner
                        size="small"
                        containerStyle={{ width: '100%' }}
                      />
                    ) : (
                      <CardActions
                        pt={0}
                        type="vertical"
                        actionOne={modalActionTwo}
                        actionTwo={modalActionOne}
                        buttonActions={buttonActions}
                      />
                    )}
                  </View>
                ) : buttonActions ? (
                  ButtonActions()
                ) : null}
              </View>
            )}
          </ScrollView>
          {contentExtra ? contentExtra : null}
          {/* {scrollView ? <ScrollView>{InnerContent}</ScrollView> : InnerContent} */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#fff',
    // borderRadius: 6,
    overflow: 'hidden',
    margin: 8,
    paddingBottom: 15,
    paddingTop: 25,
  },
  modalStyle: {
    margin: 8,
  },
  bottomModal: {
    marginTop: 12,
    justifyContent: 'flex-end',
    margin: 0,
    marginBottom: 0,
    bottom: 0,
  },
  viewStyleTitleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    // alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    zIndex: 9999,
    width: '100%',
    position: 'absolute',
    top: 0,
    paddingHorizontal: 14,
  },
  textStyleTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    // textAlign: 'center',,
  },
  textStyleSubtitle: {
    opacity: 0.8,
    fontSize: 12,
  },
  viewStyleContent: { paddingHorizontal: 20 },
  textStyleContent: {
    fontSize: 16,
    marginTop: 16,
    // padding: 8,
    // paddingHorizontal: 16,
    textAlign: 'center',
  },
  textStyleError: {
    padding: 8,
    paddingBottom: 0,
    fontSize: 14,
    // color: Colors.error,
  },
  iconStyleTitleRight: {
    right: 16,
    top: 0,
    margin: 0,
    position: 'absolute',
  },
  // iconStyleTitleLeft: {
  //   left: 0,
  //   top: 0,
  //   margin: 0,
  //   position: 'absolute',
  // },
  viewStyleFooter: {
    paddingTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
});

const PopUpGeneral = context(_PopUpGeneral);

export { PopUpGeneral };
