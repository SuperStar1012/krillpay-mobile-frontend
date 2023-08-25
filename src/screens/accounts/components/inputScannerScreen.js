import React, { Component } from 'react';
import { get } from 'lodash';
import { View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Header from 'components/layout/header';
import { connect } from 'react-redux';
import { updateContactField } from '@redux/actions';
import { decodeQR } from 'utility/general';

import { EmptyListMessage } from 'components';

class InputScannerScreen extends Component {
  static navigationOptions = {
    title: 'Input scanner',
  };

  state = { hasCameraPermission: false, prop: '', onSuccess: () => {} };

  async componentDidMount() {
    const { prop, onSuccess } = this.props?.route?.params;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
      prop,
      onSuccess,
    });
  }

  _handleBarCodeRead = raw => {
    const data = decodeQR(raw.data);
    const { prop, onSuccess } = this.state;
    if (prop) {
      onSuccess(get(data, prop, ''));
    }
    onSuccess(data);

    // this.props.updateContactField({ prop, value: data.recipient });

    this.props.navigation.goBack();
  };

  render() {
    const { hasCameraPermission } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header navigation={this.props.navigation} back title="Input scanner" />
        {hasCameraPermission ? (
          <BarCodeScanner
            onBarCodeScanned={this._handleBarCodeRead}
            style={{ flex: 1 }}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          />
        ) : (
          <EmptyListMessage text="No access to camera" />
        )}
      </View>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, { updateContactField })(
  InputScannerScreen,
);
