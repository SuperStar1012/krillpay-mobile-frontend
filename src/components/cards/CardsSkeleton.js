import React from 'react';
import { View } from '../../components';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';

export default function CardsSkeleton(props) {
  const { noBorder, mb } = props;

  return (
    <View
      fD={'row'}
      aI={'center'}
      jC={'space-between'}
      style={{
        ...(noBorder
          ? {}
          : { borderWidth: 1, borderColor: 'lightgray', borderRadius: 20 }),
        padding: noBorder ? 8 : 17,
        paddingHorizontal: noBorder ? 0 : 9,
        marginBottom: mb ? 20 : 0,
      }}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={40} height={40} borderRadius={50} />

          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={120}
              height={15}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={80}
              height={10}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item alignItems="flex-end">
          <SkeletonPlaceholder.Item width={80} height={15} borderRadius={4} />
          <SkeletonPlaceholder.Item
            marginTop={6}
            width={50}
            height={10}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
}
