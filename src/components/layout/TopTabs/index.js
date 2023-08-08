import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Animated,
  View,
  Dimensions,
  findNodeHandle,
} from 'react-native';
import TabBar from './TabBar';
import TabScene from './TabScene';
import Constants from 'expo-constants';
const { width, height } = Dimensions.get('screen');

export default function TopTabs(props) {
  const { routes = [], config = {}, ...restProps } = props;

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = useRef();
  const onItemPress = React.useCallback(itemIndex => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    });
  });

  const data = routes.map(i => ({
    ...i,
    ref: React.createRef(),
  }));

  const { hideTabBar } = config;

  if (hideTabBar && routes?.length === 1) {
    return <TabScene route={routes?.[0] ?? {}} {...restProps} />;
  }

  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems?.length === 1) {
      setIndex(viewableItems?.[0]?.index);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        horizontal
        ref={ref}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        // scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        keyExtractor={item => item?.key}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width,
                height,
                paddingTop: 20,
                paddingBottom: 80,
                flex: 1,
              }}>
              <TabScene route={item} {...restProps} />
            </View>
          );
        }}
      />
      <TabBar
        scrollX={scrollX}
        data={data}
        onItemPress={onItemPress}
        index={index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
});
