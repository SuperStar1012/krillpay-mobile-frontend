import React, { Component } from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';

class InputContainer extends Component {
  render() {
    const { reference, children, refreshControl } = this.props;

    const { containerStyle } = styles;

    return (
      <KeyboardAvoidingView
        style={containerStyle}
        behavior={'padding'}
        keyboardVerticalOffset={5}>
        <ScrollView
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          ref={reference}
          refreshControl={refreshControl}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: 'white',
    // backgroundColor: '#00000000',
    // paddingVertical: 10,
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
};

export { InputContainer };
