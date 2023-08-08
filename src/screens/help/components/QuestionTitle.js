import React from 'react';
import { Text } from 'components';

export default function QuestionTitle(props) {
  const { id } = props;
  return <Text id={id} s={18} fW="700" paragraph />;
}
