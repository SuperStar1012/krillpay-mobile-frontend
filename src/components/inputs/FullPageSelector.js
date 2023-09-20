import React from 'react';
import { FlatList } from 'react-native';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import { View, Button, Text } from 'components';
import { Icon } from 'components/outputs/Icon';

export default function FullPageSelector(props) {
  const { onValueSelect, loading, options } = props;
  const { viewStyleContainer } = styles;

  return loading ? (
    [1, 2, 3].map(x => (
      <View key={x} mb={1}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={44}
              height={44}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item
              style={{ flexGrow: 1, flex: 1, marginLeft: 10 }}
              marginLeft={18}
              height={20}
              width={200}
              borderRadius={50}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    ))
  ) : (
    <View style={viewStyleContainer} w="100%" f={1} scrollView>
      <FlatList
        style={{
          width: '100%',
          borderRadius: 5,
        }}
        data={options}
        renderItem={({ item }) => (
          <Button
            key={item}
            onPress={() => (item.disabled ? {} : onValueSelect(item))}>
            <View aI={'center'} style={{ paddingRight: 16 }} fD="row" mv={0.75}>
              <View bC={item?.color ?? 'primary'} bR={100} p={0.5} mr={1}>
                <Icon
                  name={item?.icon ?? 'perm-contact-calendar'}
                  set={item?.set ?? 'MaterialIcons'}
                  color="white"
                  size={24}
                />
              </View>
              <Text
                s={18}
                fW="500"
                id={item?.label ?? item?.id ?? item ?? ''}
              />
            </View>
          </Button>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = {
  viewStyleContainer: {
    // flex: 1,
  },
};
