import React from 'react';
import { Text, View } from 'components';
import { FlatList, Pressable, Image as RNImage } from 'react-native';
import Images from 'components/images';

export default function DepositList(props) {
  const items = [
    { id: 'manual', title: 'manual_deposit', image: 'bank' },
    { id: 'plaid', to: 'wyre' },
  ];
  return (
    <View>
      <Text s={20} fW={'700'} lH={38} tA={'center'} id="deposit_method" />
      <Text s={16} lH={24} tA={'center'} id="deposit_method_description" />
      <FlatList
        data={items}
        renderItem={({ item, index }) => <ListItem {...props} item={item} />}
      />
    </View>
  );
}

function ListItem(props) {
  const { item, send } = props;
  const { id, image = id, title = id, to = id } = item;

  function handlePress() {
    send(to.toUpperCase());
  }

  return (
    <View w="100%" ph={0.5} pv={0.75}>
      <Pressable onPress={handlePress}>
        <View fD="row" w="100%" aI="center" jC="space-between">
          <View fD="row" f={1} aI="center" pl={1}>
            {image === 'plaid' ? (
              <RNImage
                source={require('./plaid.jpeg')}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <Images name={image} width={40} />
            )}
            <View fD="column" pl={1} aI="center">
              <Text s={20} fW="500" id={title} />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
