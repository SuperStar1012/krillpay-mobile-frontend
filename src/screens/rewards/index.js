import React, { Component } from 'react';

import { View } from '../../components';
import RewardsLists from './components/RewardsLists';
import { get } from 'lodash';

class RewardsScreen extends Component {
  static navigationOptions = {
    title: 'Rewards',
  };

  render() {
    const { navigation, route } = this.props;

    const params = route?.params ?? {};

    return (
      <View screen hC="header">
        <RewardsLists {...params} navigation={navigation} />
      </View>
    );
  }
}

export default RewardsScreen;
