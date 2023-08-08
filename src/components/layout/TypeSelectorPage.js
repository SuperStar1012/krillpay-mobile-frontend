import React from 'react';

import { View, Text } from 'components';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { Button } from 'components/inputs/Button';
import { standardizeString, cryptoCodeToType } from 'utility/general';

export default function TypeSelectorPage(props) {
  const { setType, context, config = {}, handleType } = props;
  let { title, description, options } = config;
  if (typeof options === 'function') options = options(context);

  return (
    <View bC={'surfaceCard'} pt={0.1}>
      {/* <Text id={title} t="h3" tA="center" /> */}
      {Boolean(description) && <Text tA="center">{description}</Text>}
      {options.map(item => (
        <Button key={item} onPress={() => handleType(item)}>
          <View
            aI={'center'}
            style={{ paddingRight: 16 }}
            // bR={10}
            // c="grey2"
            fD="row"
            // p={1}
            mv={1}>
            <View pr={1.5}>
              <CurrencyBadge text={item} radius={20} />
            </View>
            <Text s={18} fW="500">
              {standardizeString(item)}
            </Text>
          </View>
        </Button>
      ))}
    </View>
  );
}
