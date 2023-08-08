import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '../../layout/View';
import { Icon } from '../../outputs/Icon';
import { Button } from '../../inputs/Button';

export default function ModalHeaderActions(props) {
  const { viewStyleContainer, viewStyleActions, iconStyleClose } = styles;

  let { onDismiss, action, action2 } = props;

  return (
    <View style={viewStyleContainer} pl={1.25} pr={0.5} pv={0.5}>
      <TouchableOpacity onPress={() => onDismiss()} style={iconStyleClose}>
        <Icon set={'MaterialIcons'} name={'close'} size={24} color={'font'} />
      </TouchableOpacity>
      <View style={viewStyleActions}>
        {action2 && (action2.label || action2.id) ? (
          <Button
            {...action2}
            type={'text'}
            size="normal"
            containerStyle={{ margin: 0 }}
            buttonStyle={{ margin: 0 }}
            style={{ margin: 0 }}
          />
        ) : null}
        {action && (action.label || action.id) ? (
          <Button
            {...action}
            type={'text'}
            size="normal"
            containerStyle={{
              margin: 0,
              padding: 0,
              minHeight: 0,
              height: 'auto',
            }}
            buttonStyle={{
              // marginTop: 2,
              margin: 0,
              padding: 0,
              minHeight: 0,
              height: 'auto',
            }}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyleClose: {
    // marginTop: -10,
    // paddingVer: 12,
    // marginLeft: 8,
  },
  viewStyleFooter: {
    flexDirection: 'row',
    height: 52,
    width: '100%',
    alignItems: 'center',
  },
  viewStyleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 32,
  },
  actionStyle: {
    justifyContent: 'center',
    color: '#777',
    // paddingRight: 24,
  },
});
