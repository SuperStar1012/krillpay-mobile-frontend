import React from 'react';
import { Pressable } from 'react-native';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import { View, Text } from 'components';

import { CustomImage } from 'components/outputs/CustomImage';
import { FlatGrid } from 'react-native-super-grid';

export default function FullPageTileSelector(props) {
  const { onValueSelect, loading, options } = props;

  return (
    <FlatGrid
      // itemDimension={130}
      data={loading ? [1, 2, 3, 4] : options}
      spacing={30}
      renderItem={({ item }) =>
        loading ? (
          <TileSkeleton key={item} />
        ) : (
          <TileItem item={item} onValueSelect={onValueSelect} />
        )
      }
      maxItemsPerRow={2}
    />
  );
}

function TileItem(props) {
  const { item, onValueSelect } = props;
  return (
    <Pressable
      key={item}
      onPress={() =>
        item.disabled || typeof onValueSelect !== 'function'
          ? {}
          : onValueSelect(item)
      }>
      <View h={170} w="100%" bC="white" bR={25} aI="center">
        <View
          bR={100}
          h={60}
          w={60}
          // p={0.5}
          // mr={1}
          mt={1.5}
          mb={1.5}
          fD="column"
          jC="center"
          aI="center"
          style={{ borderWidth: 1, borderColor: '#DDDDDD' }}>
          <CustomImage name={item?.icon} color="white" width={30} />
        </View>
        <Text
          s={14}
          fW="500"
          id={item?.label ?? item?.id ?? item ?? ''}
          tA="center"
        />
      </View>
    </Pressable>
  );
}

function TileSkeleton(props) {
  return (
    <View mb={1} h={170} w="100%" bC="white" bR={25} aI="center">
      <View mv={1} mb={2}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={60} height={60} borderRadius={30} />
        </SkeletonPlaceholder>
      </View>

      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={100} height={14} borderRadius={5} />
      </SkeletonPlaceholder>
    </View>
  );
}
