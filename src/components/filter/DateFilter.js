import React, { useState, useEffect } from 'react';
import Selector from 'components/inputs/Selector';
import { dateFilterMap, parseFilters, clearFilters } from 'utility/filters';
import DateInput from 'components/inputs/DateInput';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useTranslation } from 'react-i18next';

export default function DateFilter(props) {
  const { setFilters, items = [], filters, id } = props;

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
      ...dateFilterMap({
        type,
        value,
        value2,
      }),
    });
  }, [type, value, value2]);

  const hasToDate = type === 'between';

  function handleChange(name, value) {
    if (name === 'value2') setValue2(value);
    else setValue(value);
  }
  const { t } = useTranslation('common');

  const localizedItems = items.map(item => ({
    ...item,
    label: t(item?.label),
  }));

  return (
    <View>
      <Selector
        label={'date'}
        items={localizedItems}
        value={type}
        onValueChange={value => setType(value)}
      />
      <View fD="row" f={1} w="100%" aI="center">
        <View w={hasToDate ? '45%' : '100%'}>
          <DateInput
            field={{ value, name: 'value' }}
            setFieldValue={handleChange}
          />
        </View>
        {hasToDate && (
          <View w="50%" fD="row" aI="center">
            <Text
              width={'auto'}
              style={{ paddingLeft: 8, paddingRight: 8 }}
              id="to"
            />
            <View w="90%">
              <DateInput
                field={{ value: value2, name: 'value2' }}
                setFieldValue={handleChange}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
