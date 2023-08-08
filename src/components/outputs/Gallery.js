import React, { useState } from 'react';
import { get } from 'lodash';
import { Dimensions, View, FlatList, TouchableOpacity } from 'react-native';
import Image from 'components/outputs/Image';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 48;

const padded = 27 * 2 + 18;

export default function Gallery(props) {
  const { items, layout = 'horizontal' } = props;
  const [index, setIndex] = useState(0);

  const isSingle = Boolean(get(items, 'length', 0) === 1);
  const isHorizontal = layout === 'horizontal';

  const Thumbnails = (
    <FlatList
      data={items}
      renderItem={({ item, index }) =>
        item ? (
          <View
            style={
              isHorizontal
                ? {
                    // paddingRight: 8,
                    paddingTop: index === 0 ? 0 : 8,
                    paddingBottom: index === items.length - 1 ? 0 : 8,
                  }
                : {
                    paddingBottom: 0,
                    paddingTop: 32,
                    paddingLeft: index === 0 ? 0 : 8,
                    paddingRight: index === items.length - 1 ? 0 : 8,
                  }
            }
            key={item.id}>
            <TouchableOpacity onPress={() => setIndex(index)}>
              <Image
                width={(SCREEN_WIDTH - padded) / 3 - 4}
                height={(SCREEN_WIDTH - padded) / 3 - 4}
                src={item.file}
              />
            </TouchableOpacity>
          </View>
        ) : null
      }
      keyExtractor={item => item.id}
      scrollEnabled
      horizontal={!isHorizontal}
    />
  );

  const uri = items[index].file;

  return (
    <View
      onStartShouldSetResponder={() => true}
      style={{
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      {isSingle ? (
        <Image
          width={SCREEN_WIDTH - PADDING}
          height={SCREEN_WIDTH - PADDING}
          src={items[0].file}
        />
      ) : isHorizontal ? (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              paddingRight: 24,
              height: ((SCREEN_WIDTH - padded) / 3) * 2 + 8,
            }}>
            {Thumbnails}
          </View>
          <Image
            width={((SCREEN_WIDTH - padded) / 3) * 2 + 8}
            height={((SCREEN_WIDTH - padded) / 3) * 2 + 8}
            src={uri}
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'column' }}>
          <View>
            <Image
              width={SCREEN_WIDTH - PADDING}
              height={SCREEN_WIDTH / 1.5}
              src={items[index].file}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH - PADDING }}>{Thumbnails}</View>
        </View>
      )}
    </View>
  );
}
