import React from 'react';
import momentTz from 'moment-timezone';

import SearchModal from './SearchModal';

const TimezoneInput = props => {
  const { value, setValue } = props;

  const items = momentTz.tz.names().map(item => {
    return { value: item, id: item };
  });

  const searchModalProps = {
    label: 'Timezone',
    items,
    value,
    setValue: value => setValue(value),
  };

  return <SearchModal {...searchModalProps} />;
};

export default TimezoneInput;
