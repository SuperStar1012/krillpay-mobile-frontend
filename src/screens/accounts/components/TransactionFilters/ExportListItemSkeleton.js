import React from 'react';
import { View } from 'components';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';

export default function ExportListItemSkeleton(props) {
  return (
    <View f={1} aI="space-between" fD="row">
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width="60%" height={20} borderRadius={50} />
      </SkeletonPlaceholder>
      <View fD="row" f={1} mr={2}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={20} height={20} borderRadius={50} />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={20} height={20} borderRadius={50} />
        </SkeletonPlaceholder>
      </View>
    </View>
  );
}
