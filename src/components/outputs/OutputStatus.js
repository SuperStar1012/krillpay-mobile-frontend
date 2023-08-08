import React, { Component } from 'react';

import { Platform } from 'react-native';
import context from '../context';
import { View } from '../layout/View';
import { Output } from './Output';
import { Button } from '../inputs/Button';
import { Icon } from './Icon';
import Text from './Text';

class _OutputStatus extends Component {
  state = {
    color: '#707070',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { colors } = nextProps;
    const { status = '' } = nextProps;
    let color;
    if (status && status.toLowerCase() === 'pending') {
      color = colors.font;
    } else if (status && status.toLowerCase() === 'verified') {
      color = colors.positive;
    } else {
      color = colors.negative;
    }

    return { color };
  }

  iconConfig() {
    const { status = '' } = this.props;
    if (status && status.toLowerCase() === 'pending') {
      return {
        icon: 'hourglass-empty',
        color: 'grey3',
      };
    } else if (status && status.toLowerCase() === 'verified') {
      return {
        icon: 'done',
        color: 'success',
      };
    } else {
      return {
        icon: 'exclamation-thick',
        color: '#CC2538',
      };
    }
  }

  render() {
    const { label, value, status, note, onPress, colors } = this.props;
    const iconConfig = this.iconConfig();
    return (
      <Button onPress={onPress}>
        <View
          style={[
            styles.options,

            // { backgroundColor: colors.surfaceCard },
          ]}>
          <View style={styles.optionsElement}>
            <View style={{ flex: 1 }}>
              <Text tA="left">{label}</Text>
              <Text tA="left" s={11} c={'#777777'} style={{ lineHeight: 15 }}>
                {value ? value : 'Not yet provided'}
              </Text>
              {note && !['pending', 'verified'].includes(status) && (
                <Text
                  tA="left"
                  s={11}
                  style={{ lineHeight: 15 }}
                  c={iconConfig?.color}>
                  {note}
                </Text>
              )}
              {/* <Output
                label={label}
                value={value ? value : 'Not yet provided'}
              /> */}
            </View>
            {status && (
              <Icon
                // style={{ paddingTop: Platform.OS === 'ios' ? 4 : 0 }}
                size={25}
                name={iconConfig?.icon}
                set={
                  iconConfig?.icon === 'exclamation-thick'
                    ? 'MaterialCommunityIcons'
                    : 'MaterialIcons'
                }
                color={iconConfig?.color}
              />
            )}
          </View>
          {/* <View h={2} bC={'grey2'} w={'100%'} /> */}
        </View>
      </Button>
    );
  }
}

const styles = {
  options: {
    marginBottom: 8,
    // marginHorizontal: 16,
    borderRadius: 4,
  },
  optionsElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
};

const OutputStatus = context(_OutputStatus);

export { OutputStatus };

/*
TODO:
1. Simplify to func comp & useContext
2. Rename?!

*/
