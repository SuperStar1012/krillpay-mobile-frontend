import React, { useEffect } from 'react';
import { get } from 'lodash';

import { Icon } from '../outputs/Icon';

import RadioSelector from './RadioSelector';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import { Pressable } from 'react-native';

const addTo = (toAdd, items) => {
  let temp = [...items, toAdd];
  return temp;
};

const removeFrom = (toRemove, items) => {
  return items.filter(item => item !== toRemove);
};

const isOpen = ({ checked, open, value }) =>
  checked || Boolean(open.findIndex(item => item === value.id) !== -1);

const childCheck = ({ value, values, items }) => {
  const childItem = items.find(x => x.id === values?.[0]);

  return (
    childItem?.parent?.id === value?.id ||
    childItem?.parent?.parent?.id === value?.id
  );
};

export default function RadioMultiList(props) {
  const { items, values, parent, setOpen, setValue } = props;

  const parentCategories = items?.filter(item => item.parent === null);
  const isSingleParent = parentCategories?.length === 1;
  useEffect(() => {
    if (isSingleParent) {
      setOpen([parentCategories?.[0]?.id]);
    }
  }, [isSingleParent]);

  if (parentCategories?.length === items?.length)
    return (
      <RadioSelector
        handleChange={value => setValue([value])}
        value={values?.[0]}
        items={items}
        responsive
      />
    );

  const filteredItems = items
    .filter(
      item =>
        (!parent && !item.parent) || (item.parent && item.parent.id === parent),
    )
    .map(item => {
      return {
        label: item.name,
        value: item,
        checked:
          values?.findIndex(value => (value?.id ?? value) === item.id) !== -1,
      };
    });

  return (
    <View>
      {filteredItems.map(item => (
        <RadioMultiListItem
          key={get(item, ['value', 'id'])}
          {...item}
          {...props}
          hideIcon={isSingleParent}
        />
      ))}
    </View>
  );
}

const RadioMultiListItem = props => {
  const { items, values, value, checked, setValue, open = [] } = props;

  const childChecked = childCheck({ value, values, items });

  const opened = childChecked || isOpen({ checked, value, open });
  const children = items?.filter(x => x.parent?.id === value?.id);

  function handleSelect(value) {
    setValue([value]);
  }

  const selected =
    items?.find(x => x.parent && values.includes(x.id))?.id ?? {};

  return (
    <View key={value.id}>
      <OpenIcon
        isOpen={opened}
        disabled={false} //checked || childChecked}
        {...props}
      />

      {opened && (
        <RadioSelector
          handleChange={handleSelect}
          value={selected}
          items={children}
          size="small"
          responsive
        />
      )}
    </View>
  );
};

const OpenIcon = props => {
  const { setValue, setOpen, value, items, isOpen, openable, disabled, label } =
    props;
  const { id } = value;

  const showOpen =
    openable &&
    items.findIndex(item => get(item, ['parent', 'id']) === id) !== -1;

  if (!showOpen) {
    return null;
  }

  function handleOpen() {
    setOpen(isOpen ? [] : [id]);
    setValue([]);
  }

  const iconProps = { size: 12, color: 'font', disabled };

  return (
    <Pressable onPress={handleOpen} disabled={disabled}>
      <View fD="row" pv={0.25}>
        <View f={1}>
          <Text fW="500" c={isOpen ? 'primary' : 'font'} s={16}>
            {label}
          </Text>
        </View>
        {openable && isOpen ? (
          <Icon name={'caret-up'} {...iconProps} />
        ) : (
          <Icon name={'caret-down'} {...iconProps} />
        )}
      </View>
    </Pressable>
  );
};
