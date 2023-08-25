import React from 'react';

import { StyleSheet } from 'react-native';
import { View } from '../layout/View';
import { Button } from '../inputs/Button';
import Text from './Text';
import StatusIcon from './StatusIcon';

export default function IconListItem(props) {
  let { status, label, context, onPress, ns, id } = props;

  status = (typeof status === 'function'
    ? status(context)
    : typeof status === 'string'
    ? status
    : ''
  ).toLowerCase();

  function checkStatus(status) {
    if (!status || (status && status.toLowerCase() === 'pending')) {
      return '';
    } else if (status && status.toLowerCase() === 'verified') {
      return 'positive';
    } else {
      return 'negative';
    }
  }

  return (
    <Button onPress={onPress}>
      <View style={styles.container} mh={1} pt={0.5} pb={1}>
        <View style={styles.iconView} pr={1}>
          <StatusIcon {...props} status={checkStatus(status)} padded />
        </View>
        <View style={styles.labelView}>
          {/* <Output label={label} value={value ? value : 'Not yet provided'} /> */}
          <Text c="fontLight" fW="500" id={label} ns={ns} />
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  options: {
    marginBottom: 8,
    borderRadius: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 2,
  },
  optionsText: {
    fontSize: 8,
  },
  icon: {
    height: 28,
    width: 28,
    marginRight: 8,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
