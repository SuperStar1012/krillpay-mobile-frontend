import React from 'react';

import { standardizeString, concatAddress } from 'utility/general';
import { OutputStatus } from 'components';

const AddressProfileDisplay = props => {
  const { items, type, navigation } = props;

  let addresses = [];
  let address = null;
  let status = 'incomplete';

  addresses = items.filter(
    item => item.type === type && item.status === 'verified',
  );
  if (addresses.length === 0) {
    addresses = items.filter(item => item.type === type);
  }
  if (addresses.length > 0) {
    address = addresses[0];
  }

  return (
    <OutputStatus
      label={standardizeString(type + ' address')}
      value={concatAddress(address, true)}
      status={address && address.status ? address.status : status}
      onPress={() => navigation.navigate('Addresses')}
    />
  );
};

export default AddressProfileDisplay;
