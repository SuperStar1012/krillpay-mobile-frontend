import React from 'react';
import { View, Text } from 'components';
import { standardizeString } from 'utility/general';

const findColor = status => {
  switch (status) {
    case 'available':
    case 'Available':
    case 'accepted':
    case 'complete':
    case 'Complete':
    case 'redeemed':
    case 'Redeemed':
      return 'positive';
    default:
      return 'font';
  }
};

const StatusOutput = props => {
  const { children } = props;
  const color = findColor(children);

  return (
    <Text c={color} s={12} p={0.25}>
      {standardizeString(children)}
    </Text>
  );
};

// StatusOutput.propTypes = {};

// StatusOutput.defaultProps = {};

export default StatusOutput;
