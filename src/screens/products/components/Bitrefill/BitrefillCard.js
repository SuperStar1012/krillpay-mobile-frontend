import React from 'react';
import { View } from 'components';

import { Image, Dimensions, Pressable } from 'react-native';
import { useCompany } from 'contexts/CompanyContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BitrefillCard(props) {
  const { navigation, loading } = props;
  const { company: client } = useCompany();
  if (client?.bitrefill)
    return (
      <Pressable onPress={() => navigation.navigate('Bitrefill')}>
        <View aI={'center'} mb={1}>
          <Image
            source={require('../../../../../assets/icons/bitrefill.png')}
            resizeMode="contain"
            style={{
              maxWidth: SCREEN_WIDTH / 2,
              height: loading ? 0 : 40,
              margin: 8,
            }}
          />
        </View>
      </Pressable>
    );
  return null;
}
