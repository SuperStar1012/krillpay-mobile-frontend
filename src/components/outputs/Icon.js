import React, { Component } from 'react';
import { Pressable } from 'react-native';
import { Text } from 'components/outputs/Text';
import { View } from 'components/layout/View';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Feather,
  SimpleLineIcons,
} from '@expo/vector-icons';
import context from '../context';
import { CustomIcon } from './CustomIcon';

class _Icon extends Component {
  color() {
    const { disabled, color, colors } = this.props;
    return disabled ? colors.grey2 : colors[color] ? colors[color] : color;
  }

  renderIcon() {
    const { name, size = 36, set } = this.props;
    const color = this.color();

    switch (set) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={name} size={size} color={color} />;
      case 'Custom':
        return <CustomIcon contained={false} color={color} {...this.props} />;
      case 'Feather':
        return <Feather contained={false} color={color} {...this.props} />;
      case 'FontAwesome':
        return <FontAwesome name={name} size={size} color={color} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={name} size={size} color={color} />;
      default:
        return <Ionicons name={name} size={size} color={color} />;
    }
  }
  renderText() {
    const { label, p = 0 } = this.props;

    if (label) {
      return (
        <Text style={[styles._textStyle, { color: this.color() }]}>
          {label.toUpperCase()}
        </Text>
      );
    }
    return null;
  }

  render() {
    const { onPress, ...restProps } = this.props;
    const component = (
      <View {...restProps} style={[styles._containerStyle, this.props.style]}>
        {this.renderIcon()}
        {this.renderText()}
      </View>
    );
    if (typeof onPress === 'function') {
      return <Pressable onPress={onPress}>{component}</Pressable>;
    }
    return component;
  }
}

const styles = {
  _containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 64,
  },
  _textStyle: {
    textAlign: 'center',
    fontSize: 9,
  },
};

const Icon = context(_Icon);

export { Icon };

/*
TODO:
1. Simplify to func comp & useContext
2. Merge with "CustomIcon" / have rehive icons as a subset of this


*/
