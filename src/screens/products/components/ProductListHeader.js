import React, { Component } from 'react';
import { View, Text } from 'components';
import context from 'components/context';

class WalletListHeader extends Component {
  render() {
    const { colors, design } = this.props;
    return (
      <View p={1} bC={design.app.surface ? 'transparent' : colors.header}>
        <View>
          <Text
            t="o"
            c={design.app.surface ? colors.font : colors.headerContrast}>
            HEADER SMALL
          </Text>
        </View>
        <View fD="row" jC="space-between">
          <View>
            <Text
              t="h4"
              c={design.app.surface ? colors.primary : colors.headerContrast}>
              HEADER LARGE
            </Text>
          </View>
          <View p={0.25} jC="flex-end">
            <Text t="b1" c="positive">
              header %
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default context(WalletListHeader);
