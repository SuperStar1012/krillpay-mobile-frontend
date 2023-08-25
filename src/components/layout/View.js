/* BUTTON */
/* Component | Stateless | Styled */
/* This is the main button component. Takes props to adjust it's size, type, color etc */
import React, { Component } from 'react';
import {
  View as _view,
  KeyboardAvoidingView,
  // ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import context from '../context';
import PropTypes from 'prop-types';
const SCREEN_WIDTH = Dimensions.get('window').width;

class _View extends Component {
  renderScrollView() {
    const { p, rem, refreshControl, dismiss, scrollView } = this.props;

    let scrollViewProps = {
      style: { padding: p * rem },
      keyboardDismissMode: 'interactive',
      keyboardShouldPersistTaps: dismiss ? 'handled' : 'always',
      ...(this.props?.scrollViewProps ?? {}),
    };
    if (refreshControl) {
      scrollViewProps.refreshControl = refreshControl;
    }
    if (typeof scrollView === 'object') {
      scrollViewProps.ref = scrollView;
    }
    return (
      <ScrollView {...scrollViewProps} showsVerticalScrollIndicator={false}>
        {this.props.children}
      </ScrollView>
    );
  }

  viewStyle() {
    const {
      f,
      bC,
      m,
      mt,
      mb,
      mr,
      ml,
      mv,
      mh,
      p,
      pl,
      pr,
      pt,
      pb,
      pv,
      ph,
      o,
      h,
      w,
      fD,
      fG,
      c,
      aI,
      jC,
      bR,
      pos,
      screen,
      header,
      scrollView,
      screenWidthPadding,
    } = this.props;
    const { colors, rem, style } = this.props;

    return [
      screen
        ? {
            flex: 1,
            backgroundColor: colors?.surface ?? '#FFFFFF',
          }
        : {},
      screen && !header
        ? {
            paddingTop: Constants.statusBarHeight,
          }
        : {},
      {
        margin: m * rem,
        padding: p * rem,
        opacity: o,
        height: h,
        width: w,
      },
      pb ? { paddingBottom: pb * rem } : {},
      pt ? { paddingTop: pt * rem } : {},
      pl ? { paddingLeft: pl * rem } : {},
      pr ? { paddingRight: pr * rem } : {},
      scrollView ? { flex: 1, padding: 0 } : {},
      bC ? { backgroundColor: colors[bC] ? colors[bC] : bC } : {},
      bR
        ? {
            borderRadius: bR,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors?.[c] ?? (c ? c : 'transparent'),
          }
        : {},
      fD ? { flexDirection: fD } : {},
      fG ? { flexGrow: fG } : {},
      aI ? { alignItems: aI } : {},
      jC ? { justifyContent: jC } : {},
      mb ? { marginBottom: mb * rem } : {},
      mr ? { marginRight: mr * rem } : {},
      ml ? { marginLeft: ml * rem } : {},
      mt ? { marginTop: mt * rem } : {},
      mv ? { marginVertical: mv * rem } : {},
      mh ? { marginHorizontal: mh * rem } : {},
      pv ? { paddingVertical: pv * rem } : {},
      ph ? { paddingHorizontal: ph * rem } : {},
      f ? { flex: f } : {},
      pos ? { position: pos } : {},
      screenWidthPadding
        ? {
            width: SCREEN_WIDTH - screenWidthPadding * rem,
          }
        : {},
      style,
    ];
  }

  render() {
    const {
      keyboardAvoiding,
      keyboardAvoidingProps,
      scrollView,
      behavior,
      screen,
      header,
      colors,
      bC,
      hC,
      design,
      onLayout = () => {},
      onStartShouldSetResponderCapture = () => false,
      onMoveShouldSetResponder = () => false,
      onResponderGrant = () => {},
      onResponderTerminate = () => {},
    } = this.props;

    const viewProps = {
      ...(behavior ? { behavior } : { behavior: 'padding' }),
      // : Platform.OS !== 'ios' ? { behavior: 'padding' } : {}),
      keyboardVerticalOffset: behavior === 'position' ? -90 : 0,
      ...keyboardAvoidingProps,
    };

    if (keyboardAvoiding && Platform.OS === 'ios') {
      return (
        <KeyboardAvoidingView
          {...viewProps}
          keyboardShouldPersistTaps={'always'}
          style={this.viewStyle()}>
          {scrollView ? this.renderScrollView() : this.props.children}
        </KeyboardAvoidingView>
      );
    }
    return (
      <_view
        style={this.viewStyle()}
        onLayout={onLayout}
        onMoveShouldSetResponder={onMoveShouldSetResponder}
        onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
        onResponderGrant={onResponderGrant}
        onResponderTerminate={onResponderTerminate}>
        {/* {fade ? (
          <_view>
            <_view
              style={[
                styles.fadeStyle,
                {
                  top: 0,
                  backgroundColor: colors.surface,
                  opacity: 0.75,
                },
              ]}
            />
            <_view
              style={[
                styles.fadeStyle,
                {
                  top: 2,
                  backgroundColor: colors.surface,
                  opacity: 0.5,
                },
              ]}
            />
            <_view
              style={[
                styles.fadeStyle,
                {
                  top: 4,
                  backgroundColor: colors.surface,
                  opacity: 0.3,
                },
              ]}
            />
            <_view
              style={[
                styles.fadeStyle,
                {
                  top: 6,
                  backgroundColor: colors.surface,
                  opacity: 0.15,
                },
              ]}
            />
          </_view>
        ) : null} */}
        {scrollView ? this.renderScrollView() : this.props.children}
      </_view>
    );
  }
}

_View.propTypes = {
  keyboardAvoiding: PropTypes.bool,
  scrollView: PropTypes.bool,

  behavior: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]), // string passed to RN <Text />
  f: PropTypes.number, // flex
  h: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // height
  w: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // width
  m: PropTypes.number, // margin
  mv: PropTypes.number, // margin vertical
  mh: PropTypes.number, // margin horizontal
  p: PropTypes.number, // padding
  pv: PropTypes.number, // padding vertical
  ph: PropTypes.number, // padding horizontal
  o: PropTypes.number, // opacity
  bC: PropTypes.string, // backgroundColor
  hC: PropTypes.string, // headerColor
  bR: PropTypes.number, // borderRadius
  colors: PropTypes.object, // colors object from context
  rem: PropTypes.number, // rem value
  fD: PropTypes.string, // flexDirection
  aI: PropTypes.string, // alignItems
  jC: PropTypes.string, // justifyContent
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // TODO: ViewPropTypes.style, // override text style
  header: PropTypes.bool, // TODO: ViewPropTypes.style, // override text style
};

_View.defaultProps = {
  keyboardAvoiding: false,
  scrollView: false,
  behavior: '',
  children: [], // empty
  f: 0,
  h: null,
  w: null,
  m: 0, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  mh: null, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  mv: null, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  p: 0, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  ph: null, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  pv: null, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  o: 1, // 0-1
  bC: null, // backgroundColor
  bR: 0,
  colors: {}, // from context
  rem: 16, // rem value
  fD: 'column', // flexDirection
  aI: null, // alignItems
  jC: null, // justifyContent
  style: null,
  header: false, // if header is present - hides to statusbar
  hC: null, // statusbar colour
};

const View = context(_View);

export { View };
