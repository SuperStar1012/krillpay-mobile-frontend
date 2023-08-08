import React from 'react';
import { get } from 'lodash';
import { View } from '../layout/View';
import Checkbox from './CheckboxSimple';
import { Icon } from '../outputs/Icon';
import { Button } from './Button';
import Text from 'components/outputs/Text';

const addTo = (toAdd, items) => {
  let temp = [...items, toAdd];
  return temp;
};

const removeFrom = (toRemove, items) => {
  return items.filter(item => item !== toRemove);
};

const removeFromID = (toRemove, items) => {
  return items.filter(item => item.id !== toRemove.id);
};

const isOpen = ({ checked, open, value }) =>
  checked || Boolean(open.findIndex(item => item === value.id) !== -1);

const childCheck = ({ value, values, items }) => {
  let tempOpen = false;
  for (const temp of values) {
    const parent = temp.parent;
    if (parent) {
      if (parent.id === value.id) {
        tempOpen = true;
      } else if (parent.parent) {
        const parent2 = items.find(item => item.id === parent.id);
        if (get(parent2, ['parent', 'id']) === value.id) {
          tempOpen = true;
        }
      }
    }
  }

  return tempOpen;
};

const CheckboxMultiList = props => {
  const { items = [], values = [], parent } = props;

  const filteredItems = items
    ?.filter(item => (!parent && !item.parent) || item?.parent?.id === parent)
    ?.map(item => {
      return {
        label: item.name,
        value: item,
        checked: values?.findIndex(value => value?.id === item?.id) !== -1,
      };
    });

  return (
    <View style={styles.container}>
      {filteredItems.map(item => (
        <CheckboxMultiListItem
          key={get(item, ['value', 'id'])}
          {...item}
          {...props}
        />
      ))}
    </View>
  );
};

const CheckboxMultiListItem = props => {
  const {
    items,
    values,
    parent,
    value,
    label,
    checked,
    setValue,
    openable,
    open = [],
    setOpen,
  } = props;

  const childChecked = childCheck({ value, values, items });
  const opened = childChecked || isOpen({ checked, value, open });

  return (
    <View key={value.id}>
      <View fD={'row'} aI={'center'}>
        <View f={1}>
          {Boolean(parent) ? (
            <View style={{ left: -8 }}>
              <Checkbox
                label={label}
                name={value}
                value={checked}
                onPress={value => {
                  if (checked) {
                    setValue(removeFromID(value, values));
                  } else {
                    setValue(addTo(value, values));
                    setOpen(addTo(value.id, open));
                  }
                }}
              />
            </View>
          ) : (
            <Text fW="500">{label}</Text>
          )}
        </View>
        {openable && (
          <OpenIcon
            isOpen={opened}
            value={value}
            open={open}
            disabled={checked || childChecked}
            setOpen={setOpen}
            {...props}
          />
        )}
      </View>
      {opened && (
        <View pl={parent ? 0.55 : 0}>
          <CheckboxMultiList
            values={values}
            setValue={setValue}
            items={items}
            parent={value.id}
            openable={openable}
            open={open}
            setOpen={setOpen}
          />
        </View>
      )}
    </View>
  );
};

const OpenIcon = props => {
  const { open, setOpen, value, items, isOpen, openable, disabled } = props;
  const { id } = value;

  const showOpen =
    openable &&
    items.findIndex(item => get(item, ['parent', 'id']) === id) !== -1;

  if (!showOpen) {
    return null;
  }

  return (
    <Button
      containerStyle={{ padding: 8, marginRight: 8 }}
      onPress={() => setOpen(isOpen ? removeFrom(id, open) : addTo(id, open))}
      disabled={disabled}>
      {isOpen ? (
        <Icon
          name={'chevron-up'}
          size={22}
          set={'MaterialCommunityIcons'}
          color={'font'}
          disabled={disabled}
        />
      ) : (
        <Icon
          name={'chevron-down'}
          size={22}
          set={'MaterialCommunityIcons'}
          color={'font'}
          disabled={disabled}
        />
      )}
    </Button>
  );
};

const styles = {
  container: {
    flexDirection: 'column',
  },
  label: {
    flexDirection: 'row',
  },
};

export default CheckboxMultiList;
