import React from 'react';

import { View } from 'components';
import { useRehiveContext } from 'contexts/RehiveContext';
import { Image, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SplashScreen(props) {
  const {
    context: { company },
  } = useRehiveContext();

  const uri = company?.logo ?? company?.icon;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flex: 1,
        }}>
        <Image
          source={uri ? { uri } : require('../../../assets/icons/splash.png')}
          resizeMode="contain"
          style={{
            width: '100%',
            maxWidth: uri ? (SCREEN_WIDTH / 3) * 2 : '100%',
            maxHeight: uri ? (SCREEN_WIDTH / 3) * 2 : '100%',
            height: '100%',
            // height: '100%',
          }}
        />
      </View>

      {/* {updated ? (
      <View
        p={2}
        w={'100%'}
        aI="center"
        style={{ position: 'absolute', bottom: 0 }}>
        <Text tA={'center'} fW={'500'} style={{ paddingBottom: 8 }}>
          App updated!
        </Text>
        <Button label="Restart app" onPress={() => Updates.reloadAsync()} />
      </View>
    ) : (
      <View p={2} w={'100%'} style={{ position: 'absolute', bottom: 0 }}>
        <View mb={0.5}>
          <ActivityIndicator />
        </View>
        <Text tA={'center'} fW={'500'}>
          Fetching the latest update...
        </Text>
        <Text tA={'center'}>Please wait while it is installed</Text>
      </View>
    )} */}
    </View>
  );
}
