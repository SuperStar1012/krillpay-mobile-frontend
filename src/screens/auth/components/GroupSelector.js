import React from 'react';
// import PropTypes from 'prop-types';
import { Card, Content, View, Text } from 'components';
import { FlatList } from 'react-native';
import { useTheme } from 'components/context';
import { CardTitle } from 'components/card/CardTitle';
import { standardizeString } from 'utility/general';
import DropdownSelector from 'components/inputs/DropdownSelector';

const GroupSelector = props => {
  const { items, onSuccess, item, setItem } = props;

  const { design } = useTheme();
  const dropdown = items.length > 1;

  if (!item) {
    return null;
  }

  if (dropdown) {
    return (
      <View pt={0.5}>
        <DropdownSelector
          borderRadius={30}
          style={{ paddingBottom: 12 }}
          data={items}
          item={item}
          onValueChange={setItem}
          renderItem={item => (
            <GroupSelectorItem
              item={item}
              design={design}
              // onPressContent={() => onSuccess()}
            />
          )}
          keyExtractor={item => item.name}
        />
        <View pt={1}>
          <Text tA="center" id={item.description}></Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      // contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps={'handled'}
      data={items}
      renderItem={({ item, index }) => (
        <GroupCard
          item={item}
          design={design}
          onPressContent={() => {
            setItem(item);
            onSuccess();
          }}
        />
      )}
      keyExtractor={item => item.name}
    />
  );
};

const availableIcons = ['merchant', 'supplier'];

const GroupCard = props => {
  const { item, ...restProps } = props;
  const { name, label, description, icon } = item;
  const title = {
    title: label ? label : standardizeString(name),
    customIcon: icon
      ? icon
      : availableIcons.includes(name)
      ? name
      : name === 'business'
      ? 'merchant'
      : 'user',
    subtitle: '',
    onPress: () => {},
    titleScale: 'h5',
    textStyleTitle: { fontWeight: '500' },
  };

  return (
    <Card
      containerStyle={{
        // padding: 8,
        marginHorizontal: 0,
        padding: 0,
        marginBottom: 27,
        borderRadius: 30,
      }}
      {...restProps}>
      <CardTitle
        containerStyle={{ paddingTop: 0 }}
        iconSize={30}
        iconPadded={false}
        {...title}
      />
      {!!item.description && (
        <View p={0.5}>
          <Text id={description} />
        </View>
      )}
    </Card>
  );
};

const GroupSelectorItem = props => {
  const { item, ...restProps } = props;
  const { name, label } = item;
  const title = {
    title: label ? label : standardizeString(name),
    customIcon: availableIcons.includes(name) ? name : 'user',
    subtitle: '',
    onPress: () => {},
    iconSize: 30,
    titleScale: 'h5',
    textStyleTitle: { fontWeight: '500' },
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingLeft: 8,
        width: '100%',
        margin: 8,
      }}
      {...restProps}>
      <View w={'100%'}>
        <CardTitle
          iconPadded={false}
          containerStyle={{ paddingTop: 0 }}
          {...title}
        />
      </View>
    </View>
  );
};

export default GroupSelector;
