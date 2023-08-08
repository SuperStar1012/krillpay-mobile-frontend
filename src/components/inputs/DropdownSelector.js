import React, { useState } from 'react';
import Popover from 'react-native-popover-view';
import Constants from 'expo-constants';

import { Button } from './Button';
import { View, FlatList, I18nManager } from 'react-native';
import { Icon } from '../outputs/Icon';
import { shiftToStart } from 'utility/general';

const DropdownSelector = props => {
  let {
    data,
    item,
    renderItem,
    onValueChange,
    keyExtractor,
    ...restProps
  } = props;
  const [valueDimensions, setValueDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  let { x, y, width, height } = valueDimensions;
  const [open, setOpen] = useState(false);

  function handleLayout(event) {
    setValueDimensions(event.nativeEvent.layout);
  }
  data = shiftToStart(data, 'name', item.name);
  const { length } = data;
  const offset = ((length - 1) / 2) * height;
  const offsetLimit = 100 - Constants.statusBarHeight * 2;

  return (
    <View {...restProps}>
      <Button onPress={() => setOpen(!open)} onLayout={handleLayout}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'lightgray',
            // margin: 8,
            borderRadius: 200,
            paddingVertical: 8,
            flexDirection: 'row',
            paddingRight: 12,
          }}>
          <View style={{ flex: 1 }}>{renderItem(item)}</View>

          <Icon
            style={{ paddingTop: 4 }}
            name={'chevron-' + (open ? 'up' : 'down')}
            size={24}
            set={'MaterialCommunityIcons'}
            color={'font'}
          />
        </View>
      </Button>
      <Popover
        isVisible={open}
        onRequestClose={() => setOpen(false)}
        popoverStyle={{
          width: width - 16,
          borderRadius: 12,
          marginTop: offset > offsetLimit ? offsetLimit : offset,
          maxHeight: 245,
          marginLeft: I18nManager.isRTL ? 64 : 0,
        }}>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={data}
          style={{
            paddingVertical: 8,
            paddingBottom: 16,
          }}
          ListFooterComponent={<View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <Button
              onPress={() => {
                onValueChange(item);
                setOpen(false);
              }}>
              {renderItem(item)}
            </Button>
          )}
          keyExtractor={item => (keyExtractor ? keyExtractor(item) : item.id)}
        />
      </Popover>
    </View>
  );
};

export default DropdownSelector;
