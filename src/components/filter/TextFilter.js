import React from 'react';
import { View } from 'components/layout/View';
import { TextField } from 'components/inputs/TextField';
import { useTheme } from 'contexts/ThemeContext';

export default function TextFilter(props) {
  const { setFilters, filters, id } = props;

  const { colors } = useTheme();

  const value = filters?.[id] ?? '';

  function handleChange(value) {
    setFilters({
      ...filters,
      [id]: value,
    });
  }

  return (
    <View>
      <TextField
        tintColor={colors?.primary ?? '#5D48F8'}
        field={{ value, name: 'value' }}
        value={value}
        onChangeText={handleChange}
      />
    </View>
  );
}
