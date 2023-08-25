import React from 'react';
import Text from 'components/outputs/Text';
import { Card } from 'components/card/Card';

export default function AddAccountCard(props) {
  const { onPress, title = 'add_new_account', style = {} } = props;

  return (
    <Card
      design={{}}
      containerStyle={{ margin: 0, height: 74, ...style }}
      onPressContent={onPress}>
      <Text tA="center" p={0.65} c="primary" fW="500" id={title} s={14} />
    </Card>
  );
}
