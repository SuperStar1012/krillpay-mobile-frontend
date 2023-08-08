import React from 'react';
import { View, Text } from 'components';
import { Pressable } from 'react-native';

export default function LinkList(props) {
  const { config, id } = props;
  const { title = id, sections = [] } = config;

  return (
    <View pt={1.5} mh={1.5}>
      <Text fW="500" s={20} c="fontDark" id={title} paragraph />
      {sections?.length > 0 &&
        sections.map(item => (
          <LinkListItem {...props} key={item?.id} {...item} />
        ))}
    </View>
  );
}

function LinkListItem(props) {
  const { id, onSelect, condition, context } = props;
  function handlePress() {
    typeof onSelect === 'function' && onSelect(id);
  }
  if (typeof condition === 'function' && !condition(context)) return false;

  return (
    <View mv={0.5}>
      <Pressable onPress={handlePress}>
        <Text
          id={id}
          c="primary"
          style={{ textDecorationLine: 'underline' }}
          paragraph
        />
      </Pressable>
    </View>
  );
}
