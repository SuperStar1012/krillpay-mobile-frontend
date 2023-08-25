import React from 'react';
import { getProductCategories } from 'utility/rehive';
import { useQuery } from 'react-query';
import { useRehiveContext } from 'contexts/RehiveContext';
import { Text, View } from 'components';
import { FlatList, Pressable } from 'react-native';

export default function PoSProductCategoryChips(props) {
  const {
    context: { company },
  } = useRehiveContext();

  const { data } = useQuery(
    [company?.id, 'product-categories'],
    getProductCategories,
    null,
  );
  const categories = data?.results ?? [];
  if (categories?.length > 0)
    return (
      <View pt={0.5}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          style={{ paddingBottom: 16 }}
          horizontal
          data={categories}
          renderItem={({ item, index }) => (
            <CategoryChip
              {...props}
              item={item}
              index={index}
              length={categories?.length}
            />
          )}
        />
      </View>
    );
  return null;
}

function CategoryChip(props) {
  const { item, setCategory, category } = props;
  const selected = item?.id === category;
  return (
    <Chip
      {...props}
      selected={selected}
      onPress={() => setCategory(selected ? '' : item?.id)}>
      {item?.name}
    </Chip>
  );
}

function Chip(props) {
  const { children, onPress, selected, index, length } = props;

  return (
    <Pressable onPress={onPress}>
      <View
        bR={100}
        p={0.25}
        ml={index === 0 ? 1.5 : 0}
        mr={index === length - 1 ? 1.5 : 0}
        c={selected ? 'primary' : '#848484'}
        mh={0.25}
        // aI="center"
        style={{ minWidth: 70 }}
        ph={0.5}>
        <Text
          tA="center"
          s={12}
          c={selected ? 'primary' : '#848484'}
          fW={selected ? '500' : '400'}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}
