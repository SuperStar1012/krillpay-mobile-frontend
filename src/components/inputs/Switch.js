import React from 'react';
import { Switch as _switch, StyleSheet } from 'react-native';

import { View } from '../layout/View';
import Text from '../outputs/Text';
import { useTheme } from 'contexts/ThemeContext';

const Switch = props => {
  const { colors } = useTheme();
  const { color, label, ...restProps } = props;
  const { viewStyleContainerSwitch, viewStyleText, viewStyleSwitch } = styles;
  return (
    // <View style={[viewStyleContainer]}>
    <View style={viewStyleContainerSwitch}>
      {label && (
        <Text style={viewStyleText}>
          <Text t="s2">{label} </Text>
        </Text>
      )}
      <View style={viewStyleSwitch}>
        <_switch
          trackColor={{
            false: colors.font,
            true: colors[color ? color : 'primary'],
          }}
          thumbColor={colors.tertiary}
          {...restProps}
        />
      </View>
    </View>
    //   {/* {error ? (
    //     <View>
    //       <Text style={textStyleRequired}>{error}</Text>
    //     </View>
    //   ) : null} */}
    // {/* </View> */}
  );
};

const styles = StyleSheet.create({
  viewStyleContainer: {
    margin: 8,
    padding: 8,
    borderRadius: 5,
  },
  viewStyleContainerSwitch: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 8,
    padding: 8,
  },
  viewStyleSwitch: {
    margin: 4,
    justifyContent: 'center',
  },
  viewStyleText: {
    flex: 1,
    paddingRight: 8,
    justifyContent: 'center',
    paddingTop: 4,
  },
  viewStyleTextLink: {
    flexWrap: 'wrap',
    marginRight: 16,
    padding: 2,
    paddingLeft: 8,
  },
});
export { Switch };

/*
TODO:
1. Add error
2. Check styling
3. Add left/right prop

*/
