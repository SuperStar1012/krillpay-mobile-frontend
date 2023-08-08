import React, { useState } from 'react';
import { Keyboard, TouchableOpacity, Platform } from 'react-native';
import { TextField } from '..';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { Button } from './Button';
import { View } from '../layout/View';
import { Icon } from '../outputs/Icon';
import moment from 'moment';

export default function DateInput(props) {
  const {
    field,
    setFieldValue,
    initialDate = '1990-01-01',
    ...restProps
  } = props;
  const { value, name, onBlur } = field;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const tempDate = initialDate ? new Date(initialDate) : new Date();

  return (
    <React.Fragment>
      <View style={{ position: 'relative', paddingBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(!showDatePicker)}
          disabled={field.disabled}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 100,
          }}
        />
        <TextField
          {...field}
          {...restProps}
          value={value && moment(value).format('DD/MM/YYYY')}
          editable={false}
        />
        <Icon
          name={'date-range'}
          set={'MaterialIcons'}
          size={20}
          color={'grey3'}
          style={{
            position: 'absolute',
            right: 0,
            margin: 'auto',
            top: 8,
            bottom: 8,
          }}
        />
      </View>

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          {...field}
          value={(value && moment(value).toDate()) || tempDate}
          mode="date"
          display={'spinner'}
          onChange={(event, date) => {
            setShowDatePicker(false);
            onBlur();
            if (date) setFieldValue(name, moment(date).format('YYYY-MM-DD'));
          }}
        />
      )}
      {Platform.OS === 'ios' && (
        <PopUpGeneral
          visible={showDatePicker}
          onDismiss={() => {
            Keyboard.dismiss();
            onBlur();
            setShowDatePicker(false);
          }}
          docked>
          <DateTimePicker
            {...field}
            value={(value && moment(value).toDate()) || tempDate}
            mode="date"
            display={'inline'}
            onChange={(event, date) => {
              setFieldValue(name, moment(date).format('YYYY-MM-DD'));
              // setShowDatePicker(false);
            }}
          />
          <Button
            label={'Done'}
            type="text"
            wide
            onPress={() => {
              Keyboard.dismiss();
              onBlur();
              setShowDatePicker(false);
            }}
          />
        </PopUpGeneral>
      )}
    </React.Fragment>
  );
}
