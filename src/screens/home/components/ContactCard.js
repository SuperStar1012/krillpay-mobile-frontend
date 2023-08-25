/* BUTTON */
/* Component | Stateless | Styled */
/* This is the main button component. Takes props to adjust it's size, type, color etc */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text } from 'components';
import context from 'components/context';

class _ContactCard extends Component {
  render() {
    const { item, onContentPress } = this.props;
    const { profile, first_name, last_name } = item;

    return (
      <TouchableOpacity
        onPress={() => onContentPress(item)}
        // disabled={disabled}
      >
        <View w={80} p={0.5} fD={'column'}>
          <View>
            {profile ? (
              <Image
                style={{ height: 56, width: 56, borderRadius: 28 }}
                source={{
                  uri: profile,
                  // cache: 'only-if-cached',
                }}
              />
            ) : (
              <Image
                source={require('./assets/icons/profile.png')}
                style={{ height: 56, width: 56 }}
              />
            )}
          </View>

          <View jC={'center'} p={0.25}>
            {first_name || last_name ? (
              <Text t={'o'} tA={'center'}>
                {first_name}
                {'\n'}
                {last_name}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const ContactCard = context(_ContactCard);

export { ContactCard };
