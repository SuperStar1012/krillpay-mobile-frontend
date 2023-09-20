import React from 'react';
import CartListItem from './CartListItem';
import { EmptyListMessage, View, Spinner } from 'components';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';

export default function CartList(props) {
  const { items, loadingItems } = props;

  return (
    <View>
      {loadingItems && !items?.length ? (
        <CartListItemSkeleton />
      ) : items.length > 0 ? (
        items.map(item => <CartListItem {...props} key={item.id} item={item} />)
      ) : (
        <EmptyListMessage id="cart" />
      )}
    </View>
  );
}

function CartListItemSkeleton() {
  return (
    <View ph={1.5} pv={0.5}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={95} height={95} marginRight={16} />

          <SkeletonPlaceholder.Item
            flexDirection="column"
            justifyContent="center">
            <SkeletonPlaceholder.Item
              width={150}
              height={16}
              borderRadius={50}
              marginBottom={8}
            />
            <SkeletonPlaceholder.Item
              width={70}
              height={14}
              borderRadius={50}
              marginBottom={8}
            />
            <SkeletonPlaceholder.Item
              width={90}
              height={16}
              borderRadius={50}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
}
