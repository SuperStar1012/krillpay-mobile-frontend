import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import context from '../context';
import { View } from '../layout/View';
import Text from '../outputs/Text';

class _Checkbox extends Component {
  render() {
    const {
      toggleValue,
      value,
      title,
      link,
      linkText,
      linkAction,
      link2,
      linkText2,
      link2Action,
      description,
      centerAlign,
      error,
      colors,
      extra,
      containerStyle,
      context,
    } = this.props;

    const {
      textStyleRequired,
      viewStyleContainer,
      viewStyleText,
      viewStyleCheckbox,
    } = styles;
    return (
      <TouchableOpacity
        style={[viewStyleContainer, containerStyle]}
        onPress={() => toggleValue(!value)}>
        <View f={1} fD={'row'} aI={centerAlign ? 'center' : 'flex-start'}>
          <View style={viewStyleCheckbox}>
            <MaterialIcons //value ? {this.setState({ value })} : 'square-outline'}
              name={value ? 'check-box' : 'check-box-outline-blank'}
              size={23}
              color={value ? colors.primary : 'lightgrey'}
            />
          </View>
          {title || description || link || link2 ? (
            <View style={viewStyleText}>
              {title ? <Text t="h6" id={title} context={context} /> : null}
              <Text style={{ justifyContent: 'center' }} lH={21}>
                {description ? (
                  <Text
                    c="#9D9D9D"
                    t="s2"
                    s={14}
                    id={description}
                    context={context}
                  />
                ) : null}{' '}
                {link ? (
                  <Text
                    t="s2"
                    c="primary"
                    o={0.8}
                    s={14}
                    id={linkText ? linkText : link}
                    onPress={() => WebBrowser.openBrowserAsync(link)}
                  />
                ) : null}
                {link2 ? (
                  <React.Fragment>
                    <Text t="s2" c="#9D9D9D" s={14} id="and_" />
                    <Text
                      t="s2"
                      c="primary"
                      o={0.8}
                      s={14}
                      onPress={() => {
                        linkAction && linkAction();
                        WebBrowser.openBrowserAsync(link2);
                      }}
                      id={linkText2 ? linkText2 : link2}
                    />
                  </React.Fragment>
                ) : null}
              </Text>
              {extra && extra.length && extra.length > 0 ? (
                <View pv={0.25}>
                  <Text t="s2" id="as_well_as"></Text>
                  <View ph={0.25}>
                    {extra.map(extraTerm => (
                      <Text
                        key={extraTerm.id}
                        t="s2"
                        c="blue"
                        o={0.8}
                        onPress={() => {
                          link2Action && link2Action();
                          WebBrowser.openBrowserAsync(extraTerm.link);
                        }}>
                        {extraTerm.description}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {error ? (
          <View>
            <Text style={textStyleRequired}>{error}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = {
  viewStyleContainer: {
    flexDirection: 'row',
    borderRadius: 5,
  },
  viewStyleCheckbox: {
    flexWrap: 'wrap',
    marginRight: 9,
    marginTop: 4,
  },
  viewStyleText: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    // justifyContent: 'center',
    paddingLeft: 4,
    // paddingTop: 16,
  },
  textStyleRequired: {
    color: 'red',
    padding: 8,
    paddingTop: 4,
  },
};

// make component available to other parts of app

const Checkbox = context(_Checkbox);

export { Checkbox };

/*
TODO:
1. Rename to "TermsAndConditions"
2. Move Auth section
3. Check all uses and update to use "Simple" component
4. Remove from index js / update to simple

*/
