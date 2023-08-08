import React, { useState } from 'react';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { View } from '../layout/View';
import { Output } from '../outputs/Output';

const DateInput = props => {
  const { value, label, setValue } = props;
  const [open, setOpen] = useState(false);
  const date = new Date(value);

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <View aI={'center'} fD={'row'} jC={'flex-end'}>
          <View f={1}>
            <Output label={value ? label : ''} value={value ? value : label} />
          </View>
          <Icon
            name="chevron-down"
            size={20}
            color={'grey3'}
            style={{ paddingBottom: 4 }}
          />
        </View>
      </TouchableOpacity>
      <DateTimePicker
        textColor={'black'}
        isVisible={open}
        date={date}
        mode={'date'}
        onConfirm={value => {
          setValue(moment(value).format('YYYY-MM-DD'));
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

export default DateInput;
