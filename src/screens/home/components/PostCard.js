import React from 'react';
import { Pressable } from 'react-native';
import { View, Text, CustomImage, Button } from 'components';
import * as Linking from 'expo-linking';
import Image from 'components/outputs/Image';

export default function PostCard(props) {
  const {
    title,
    description,
    image,
    dismissible,
    dismiss,
    handleDismiss,
    redirectURL,
  } = props;

  let style = {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  };

  if (image)
    style = {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E0E0E0',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    };

  const Content = (
    <View>
      {!!image && (
        <View h={170}>
          {!image.includes('http') ? (
            <CustomImage
              name={image}
              height={170}
              containerStyle={{
                backgroundColor: 'transparent',
                ...style,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopWidth: 1,
                borderBottomWidth: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
          ) : (
            <Image
              src={image}
              resizeMode={'cover'}
              width="100%"
              style={{
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                // borderWidth: 1,
                height: 170,
                width: '100%',
              }}
            />
          )}
        </View>
      )}
      <View p={1} style={style}>
        <Text s={18} fW={'500'} id={title} />
        {Boolean(description) && (
          <View mt={0.75}>
            <Text c={'grey4'} numberOfLines={3} id={description} />
          </View>
        )}
        {/* {(dismissible || dismiss) && (
        <View fD={'row'} jC={'flex-end'} mt={'0.5'} w={'100%'}>
          <Button
            label={'Dismiss'}
            onPress={() => handleDismiss && handleDismiss()}
          />
        </View>
      )} */}
      </View>
    </View>
  );
  if (redirectURL)
    return (
      <Pressable onPress={() => Linking.openURL(redirectURL)}>
        {Content}
      </Pressable>
    );
  return Content;
}
