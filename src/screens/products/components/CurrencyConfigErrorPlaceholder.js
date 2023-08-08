import React from 'react';
import { View, Text, Button } from 'components';
import EmptyListPlaceholder from 'components/images/empty';
import { useNavigation } from '@react-navigation/native';

export default function CurrencyConfigErrorPlaceholder(props) {
  const navigation = useNavigation();

  function navigateHome() {
    navigation.replace('Private', { screen: 'Home' });
  }

  return (
    <View screen p={1}>
      <View f={1} aI="center" jC="center">
        <View p={0.5}>
          <EmptyListPlaceholder name="products" size={100} />
        </View>
        <Text
          tA="center"
          paragraph
          s={20}
          lH={36}
          c="fontDark"
          fW="500"
          id="products_unavailable"
        />
        <Text
          c="fontLight"
          tA="center"
          lH={26}
          paragraph
          id="products_unavailable_description"
        />
      </View>
      <Button id="back_to_home" wide onPress={navigateHome} />
    </View>
  );
}
