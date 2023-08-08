import React from 'react';
import { View, Text } from 'components';
import { TouchableOpacity, Dimensions } from 'react-native';
import Images from './images';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CategoryCard(props) {
  const { item, navigation, setFilters, filters } = props;

  if (!item) {
    return null;
  }

  const { name = '', image } = item ?? {};

  return (
    <TouchableOpacity
      onPress={() => setFilters({ ...filters, categories: [item?.id] })}>
      <View
        // fD="column"
        // f={1}
        p={1}
        pb={0.25}
        bR={15}
        bC="grey1"
        aI="center"
        style={{
          marginRight: 16, //index % 2 === 0 ? 16 : 12,
          marginLeft: 16, //index % 2 === 0 ? 12 : 16,
          marginBottom: 8,
          // minHeight: 100,
          // minWidth: 200,
        }}
        w={SCREEN_WIDTH / 2 - 40}>
        <Images size={100} name={name.toLowerCase()} />
        <Text p={0.5}>{name}</Text>
        {/* <View style={{ zIndex: 10 }} pv={0.5}>
        
          {Boolean(priceString) && (
            <>
              <View h={4} />
              <Text c="primary" fW="600" s={18}>
                {priceString}
              </Text>
            </>
          )}
        </View> */}
      </View>
    </TouchableOpacity>
  );
}
