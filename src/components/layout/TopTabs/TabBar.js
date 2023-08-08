import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  I18nManager,
  FlatList,
  Platform,
} from 'react-native';
import Indicator from './Indicator';
import TabBarItem from './TabBarItem';

const { width, height } = Dimensions.get('screen');

export default function TabBar(props) {
  const { data, scrollX, onItemPress, config = {}, index } = props;
  const { showIndicator } = config ?? {};
  const containerRef = useRef();
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    let m = [];
    data.forEach(item => {
      item?.ref?.current?.measureLayout(
        containerRef?.current,
        (x, y, width, height) => {
          m.push({ x, y, width, height });
          if (m?.length === data?.length) setMeasures(m);
        },
      );
    });
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'white',
        top: 0,
        width,
      }}>
      <FlatList
        ref={containerRef}
        data={data}
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{
          justifyContent: 'space-evenly',
          flex: 1,
          flexDirection: 'row',
        }}
        renderItem={({ item: t, index: i }) => {
          return (
            <TabBarItem
              selected={
                index ===
                (I18nManager.isRTL && Platform.OS === 'ios'
                  ? data?.length - 1 - i
                  : i)
              }
              key={t.key}
              item={t}
              ref={t.ref}
              onItemPress={() =>
                onItemPress(
                  I18nManager.isRTL && Platform.OS === 'android'
                    ? data?.length - 1 - i
                    : i,
                )
              }
            />
          );
        }}
      />

      {measures?.length > 0 && showIndicator && (
        <Indicator measures={measures} scrollX={scrollX} />
      )}
    </View>
  );
}
