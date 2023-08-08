import React, { useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text, View, Spinner } from 'components';
import { standardizeString } from 'utility/general';
import { updateNotification } from 'utility/rehive';
import { useTheme } from 'contexts/ThemeContext';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NotificationManageListItem(props) {
  const { item, disabledHook, dataHook, showToast } = props;
  const [disabled, setDisabled] = disabledHook;
  const [data, setData] = dataHook;
  const [loading, setLoading] = useState(false);

  const callUpdateNotification = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setDisabled(true);
    const resp = await updateNotification(item.id, {
      enabled: !item.enabled,
    });
    if (resp.status === 'success') {
      showToast({
        text: 'Notification preference successfully updated',
        variant: 'success',
      });
    } else {
      showToast({
        text: 'Unable to update notification preference ',
        variant: 'error',
      });
    }

    const newData = [...data];
    var foundIndex = newData.findIndex(x => x.id === resp.data.id);
    newData[foundIndex] = resp.data;
    setData(newData);
    setLoading(false);
    setDisabled(false);
  }, [data, item.enabled, item.id, loading, setData, setDisabled]);

  return (
    <View fD={'row'}>
      <View f={1} pv={0.5}>
        <Text>{standardizeString(item.name)}</Text>
      </View>
      {loading ? (
        <Spinner
          size="small"
          containerStyle={{ paddingLeft: 0, paddingRight: 10, marginTop: 1 }}
        />
      ) : (
        <CheckBox
          value={item.enabled}
          disabled={disabled}
          setValue={() => callUpdateNotification()}
        />
      )}
    </View>
  );
}

const CheckBox = props => {
  const { value, setValue, disabled } = props;
  const { colors } = useTheme();
  return (
    <MaterialIcons
      style={{ padding: 8, paddingVertical: SCREEN_WIDTH / 50 }}
      onPress={() => (disabled ? {} : setValue(!value))} //value ? {this.setState({ value })} : 'square-outline'}
      name={value ? 'check-box' : 'check-box-outline-blank'}
      size={22}
      color={value && !disabled ? colors.primary : 'lightgrey'}
    />
  );
};
