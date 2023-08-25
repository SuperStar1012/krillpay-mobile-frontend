import React, { useState, useEffect } from 'react';
import Selector from 'components/inputs/Selector';
import { parseFilters, amountFilterMap, clearFilters } from 'utility/filters';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { TextField } from 'components/inputs/TextField';
import { useTranslation } from 'react-i18next';

export default function NumberFilter(props) {
  const { setFilters, items = [], filters, currency, id } = props;

  const urlValues = parseFilters(filters, id);

  const [type, setType] = useState(urlValues?.type ?? items?.[0]?.value);
  const [value, setValue] = useState(
    urlValues?.value ? parseInt(urlValues?.value) : new Date(),
  );
  const [value2, setValue2] = useState(
    urlValues?.value2 ? parseInt(urlValues?.value2) : new Date(),
  );

  useEffect(() => {
    const newFilters = clearFilters(filters, id);
    setFilters({
      ...newFilters,
      ...amountFilterMap({
        type,
        value,
        value2,
        currency,
      }),
    });
  }, [type, value, value2]);

  const hasToDate = type === 'between';
  const { t } = useTranslation('common');

  const localizedItems = items.map(item => ({
    ...item,
    label: t(item?.label),
  }));

  return (
    <View>
      <Selector
        label={'amount'}
        items={localizedItems}
        value={type}
        onValueChange={value => setType(value)}
      />
      <View fD="row" f={1} w="100%" aI="center">
        <View w={hasToDate ? '45%' : '100%'}>
          <TextField
            value={value}
            type="number"
            placeholder="0.00"
            onChangeText={value => setValue(value)}
          />
        </View>
        {hasToDate && (
          <View w="50%" fD="row" aI="flex-end">
            <Text width={'auto'} style={{ padding: 8, paddingBottom: 19 }}>
              and
            </Text>
            <View w="90%">
              <TextField
                type="number"
                value={value2}
                placeholder="0.00"
                onChangeText={value => setValue2(value)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
