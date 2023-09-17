import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useToast } from 'contexts/ToastContext';
import * as Clipboard from 'expo-clipboard';

export default function DetailList(props) {
  const { items = [], ...restProps } = props;
  const { showToast } = useToast();
 
  function copy(value) {
    console.log(items);
    Clipboard.setString(value);
    showToast({ id: 'copied_to_clipboard' });
  }

  const valueContent = item => (
    <Text
      s={14}
      c={'primary'}
      tA="right"
      style={{ flex: 1, flexWrap: 'wrap', lineHeight: 18, paddingLeft: 8 }}
      id={item?.noId ? '' : item.value}
      capitalize={!item.sentenceCase}>
      {item?.noId ? item.value : ''}
    </Text>
  );

  return (
    <View {...restProps}>
      {items?.map(item => (
        <View key={item?.label} fD={'row'} jC={'space-between'} mv={0.5}>
          <Text
            s={14}
            style={{ flexWrap: 'wrap', lineHeight: 18 }}
            id={item?.label ?? item?.id}
            capitalize
          />
          <View fD="column" f={1}>
            {item.copy ? (
              <TouchableOpacity onPress={() => copy(item.value)}>
                {valueContent(item)}
              </TouchableOpacity>
            ) : (
              valueContent(item)
            )}
            {Boolean(item?.value2) && (
              <Text
                s={10}
                c={'fontLight'}
                tA="right"
                id={item?.value2}
                capitalize
              />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
