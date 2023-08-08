import React from 'react';
import DetailList from 'components/outputs/DetailList';

const TransferConfirmDetails = props => {
  const { items } = props;

  return <DetailList items={items} />;
};

export default TransferConfirmDetails;
