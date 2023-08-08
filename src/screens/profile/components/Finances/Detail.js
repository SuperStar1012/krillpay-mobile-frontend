import React from 'react';
import { View, Button, Text } from 'components';
import lang from '../../config/profile_en.json';

export default function UploadMore(props) {
  const { onDismiss, onAccept } = props;

  const buttons = [
    {
      label: 'YES',
      color: 'primary',
      onPress: () => onAccept(),
      wide: true,
    },
    {
      label: 'NO',
      onPress: () => onDismiss(),
      wide: true,
      type: 'text',
    },
  ];
  const B = props => (
    <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
  );
  return (
    <View p={0.25}>
      <Text t="h5" tA={'center'} p={0.25}>
        <B>{lang.upload_more_title}</B>
      </Text>
      <View p={0.5} ph={1}>
        <Text tA={'center'}>{lang.upload_more_text}</Text>
      </View>
      <View p={0.5}>
        <Button {...buttons[0]} />
        <Button {...buttons[1]} />
      </View>
    </View>
  );
}
