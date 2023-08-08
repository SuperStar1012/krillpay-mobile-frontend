import React from 'react';
import Image from 'components/outputs/Image';
import { Pressable } from 'react-native';
import { View, Text } from 'components';

export default function AnnouncementCard(props) {
  const {
    title,
    description,
    image,
    dismissible,
    handleDismiss = () => {},
  } = props;

  return (
    <View>
      {!!image && (
        <View mb={1} h={100} w={'100%'}>
          <Image
            src={image}
            resizeMode={'cover'}
            height={100}
            width={'100%'}
            style={{ borderRadius: 10 }}
          />
        </View>
      )}
      <View ph={1}>
        <Text s={18} fW={'500'} tA={'center'} id={title} />
        {Boolean(description) && (
          <View ph={2} pt={1}>
            <Text tA={'center'} c={'grey4'} id={description} />
          </View>
        )}
      </View>
      {dismissible && (
        <View mt={1}>
          <Pressable onPress={handleDismiss}>
            <Text
              tA={'center'}
              c={'primary'}
              fW={'500'}
              s={14}
              id="tap_to_close"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
