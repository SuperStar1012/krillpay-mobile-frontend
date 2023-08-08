import React from 'react';
import { Text as _text } from 'react-native';
import PropTypes from 'prop-types';
import { normalizeFontSize, standardizeString } from 'utility/general';
import { useTheme } from 'contexts/ThemeContext';
import { useLanguage } from 'contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useRehiveContext } from 'contexts/RehiveContext';
import { merge } from 'lodash';
// import { localeKeys } from 'utility/i18n/locales';

function mergeContexts(context = {}, contextProps = {}) {
  try {
    if (context?.company?.name?.length < 1) {
      context.company.name = standardizeString(context?.company?.id);
    }
  } catch (e) {}

  return merge(context, contextProps);
}

export default function Text(props) {
  let {
    children,
    id,
    adjustsFontSizeToFit,
    context: contextProps = {},
    text,
    options = {},
    c = 'font',
    // ns = 'common',
  } = props;
  const {
    standardize,
    capitalize = props.capitalize,
    lowercase,
    boldColor = c,
  } = options;

  const { colors, design } = useTheme();
  const { lang } = useLanguage();
  let { context = {} } = useRehiveContext() ?? {};

  const { t } = useTranslation(['common']);

  if (id) {
    const i18nString = t(id, mergeContexts(context, contextProps));
    if (i18nString) children = i18nString;
    else {
      const langEntry = lang?.en?.[id] ?? lang?.[id];
      if (typeof langEntry === 'function') {
        children = langEntry(context);
      } else if (typeof langEntry === 'string') {
        children = langEntry;
      } else {
        children = standardizeString(id);
      }
    }
  } else if (text) {
    children = text;
  }
  if (capitalize && typeof children === 'string') {
    children = children.toUpperCase();
  }
  if (lowercase && typeof children === 'string') {
    children = children.toLowerCase();
  }
  if (standardize) {
    children = standardizeString(children);
  }

  function typography(typeScale) {
    let fontSize = 16;
    let fontStyle = 'normal';
    let fontFamily = familyForFontWeight();
    let fontWeight = 'normal';
    let letterSpacing = 0.5;
    let lineHeight;
    switch (typeScale) {
      case 'h1':
        fontSize = 48;
        fontWeight = '300';
        fontFamily = familyForFontWeight('300');
        letterSpacing = -1.5;
        break;
      case 'h2':
        fontSize = 34;
        letterSpacing = -0.5;
        break;
      case 'h3':
        fontSize = 28;
        letterSpacing = 0;
        // lineHeight = 40;
        break;
      case 'h4':
        fontSize = 24;
        letterSpacing = 0.25;
        break;
      case 'h5':
        fontSize = 21;
        fontFamily = familyForFontWeight('500');
        letterSpacing = 0;
        break;
      case 'h6':
        fontSize = 19;
        // fontWeight = '700';
        fontFamily = familyForFontWeight('500');
        letterSpacing = 0.15;
        break;
      case 's1':
        fontSize = 14;
        letterSpacing = 0.15;
        // fontStyle = 'italic';
        break;
      case 's2':
        fontSize = 12;
        letterSpacing = 0.1;
        // fontStyle = 'italic';
        break;
      case 'b1':
        fontSize = 16;
        // lineHeight = 22;
        fontFamily = familyForFontWeight('500');
        break;
      case 'b2':
        fontSize = 14;
        letterSpacing = 0.25;
        lineHeight = 21;
        break;
      case 'bu':
        fontSize = 14;
        lineHeight = 18;
        // letterSpacing = 1.25;
        fontWeight = design.buttons.bold ? '700' : '500';
        fontFamily = design.buttons.bold
          ? familyForFontWeight('700')
          : familyForFontWeight('500');
        break;
      case 'c':
        fontSize = 12;
        letterSpacing = 0.4;
        break;
      case 'o':
        fontSize = 10;
        letterSpacing = 1.5;
        break;
      case 'bold':
        fontFamily = familyForFontWeight('500');
      default:
        break;
    }
    if (
      !lineHeight &&
      !adjustsFontSizeToFit &&
      props?.s < 20 &&
      children?.length > 30
    ) {
      lineHeight = fontSize * 1.35;
    }
    return {
      fontSize,
      fontStyle,
      fontWeight,
      letterSpacing,
      fontFamily,
      lineHeight,
    };
  }

  function textStyle() {
    const {
      s,
      m,
      p,
      o,
      c,
      t,
      tA,
      f,
      lH,
      rem,
      style,
      w,
      fW,
      paragraph,
      lS,
      adjustsFontSizeToFit = true,
    } = props;

    const temp = typography(t);

    let styles = [
      temp,
      {
        color: colors[c] ? colors[c] : c === 'font' ? '#434343' : c,
        margin: m * rem,
        padding: p * rem,
        opacity: o,
        textAlign: tA,
      },
      {
        fontSize:
          s && adjustsFontSizeToFit
            ? normalizeFontSize(s)
            : temp.fontSize && adjustsFontSizeToFit
            ? normalizeFontSize(temp.fontSize)
            : typeof s === 'number'
            ? s
            : normalizeFontSize(16),
      },
      lH ? { lineHeight: lH } : {},
      f ? { flex: f } : {},
      w ? { width: w } : {},
      lS ? { letterSpacing: lS } : {},
      fW ? { fontFamily: familyForFontWeight(fW) } : {},
      paragraph ? { paddingBottom: 8 } : {},
    ];
    if (style?.length > 0) return [...styles, ...style];
    else return [...styles, style];
  }

  function familyForFontWeight(weight) {
    switch (weight) {
      case '300':
        return 'Roboto_300Light';
      case '500':
        return 'Roboto_500Medium';
      case '700':
      case 'bold':
        return 'Roboto_700Bold';
      case '400':
      default:
        return 'Roboto_400Regular';
    }
  }

  const style = textStyle();
  if (!children) return null;

  try {
    if (typeof children === 'string') {
      const splits = children.split('**');
      if (splits?.length > 1) {
        return (
          <_text {...props} style={style}>
            {splits.map((item, index) => (
              <_text
                key={item}
                {...props}
                style={[
                  ...style,
                  {
                    fontFamily: familyForFontWeight(
                      index % 2 == 0 ? '400' : '700',
                    ),
                    color:
                      colors?.[index % 2 !== 0 ? boldColor : c] ?? '#434343',
                  },
                ]}>
                {item}
              </_text>
            ))}
          </_text>
        );
      }
    }
    return (
      <_text {...props} style={style}>
        {children}
      </_text>
    );
  } catch (e) {
    console.log('Text -> e', e);
    return (
      <_text {...props} style={style}>
        {children}
      </_text>
    );
  }
}

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]), // string passed to RN <Text />
  s: PropTypes.number, // fontSize
  m: PropTypes.number, // margin
  p: PropTypes.number, // padding
  o: PropTypes.number, // opacity
  t: PropTypes.string, // type scale
  c: PropTypes.string, // color
  colors: PropTypes.object, // colors object from context
  rem: PropTypes.number, // rem value,
  tA: PropTypes.string, // textAlign
  lH: PropTypes.number, // lineHeight
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // TODO: TextPropTypes.style, // override text style
};

Text.defaultProps = {
  children: [''], // empty
  s: 0,
  m: 0, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  p: 0, // 0-8: 0|0.25|0.5|1|2|4|8|16|32 rem
  o: 1, // 0-1
  t: 'b1', // h1:heading1, h2, h3, s1:subtitle1, s2, b1:body1, b2, bu: button, c:caption, o:overline.
  c: 'font', // see colors object
  colors: {}, // from context
  rem: 16, // rem value TODO: explain
  tA: 'left',
  lH: null,
  style: null,
  fW: '400',
};

/*
TODO:
1. Add Roboto font family
2. SIMPLIFY

*/
