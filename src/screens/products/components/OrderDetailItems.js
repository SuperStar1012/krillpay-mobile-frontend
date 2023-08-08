import React from 'react';
import { View } from 'components';
import OrderItemsImages from '../components/OrderItemsImages';
import { FlatList, Pressable } from 'react-native';
import { Icon } from 'components/outputs/Icon';
import { useIsRTL } from 'hooks/general';

export default function OrderDetailItems(props) {
  const { item: order, items, setShowItems } = props;
  const isRTL = useIsRTL();

  return (
    <View fD="column">
      {typeof setShowItems === 'function' && (
        <Pressable
          onPress={() => setShowItems(false)}
          style={{
            width: 'auto',
            maxWidth: 72,
            alignItems: 'flex-start',
            marginLeft: -8,
            paddingBottom: 4,
          }}>
          <Icon
            set={'MaterialIcons'}
            // style={{ width: 'a' }}
            name={isRTL ? 'chevron-right' : 'chevron-left'}
            size={24}
            color={'font'}
          />
        </Pressable>
      )}
      <FlatList
        data={items}
        keyExtractor={item => item?.id}
        renderItem={({ item }) => (
          <View bC="background" mb={1} ph={1.5} p={1} f={1}>
            <OrderItemsImages items={[item]} order={order} showDetail />
          </View>
        )}
      />
    </View>
  );
}
