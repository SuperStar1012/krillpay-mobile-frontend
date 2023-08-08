import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function NotificationListSkeleton() {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="column" alignItems="center">
        <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={80}
          height={15}
          borderRadius={4}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item
        marginTop={15}
        marginBottom={15}
        width={'100%'}
        height={80}
        borderRadius={15}
      />
    </SkeletonPlaceholder>
  );
}
