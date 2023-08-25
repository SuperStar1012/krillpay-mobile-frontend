import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import ErrorOutput from 'components/outputs/ErrorOutput';
import React from 'react';

export default function WebViewDisclaimerLayout(props) {
  const { config = {}, onPress, loading } = props;
  const navigation = useNavigation();

  const { description, name, image } = config;
  return (
    <View screen>
      <HeaderNew navigation={navigation} title="" />
      <View pv={1} aI="center" ph={1.5}>
        {typeof image === 'object' && image}
        <View pv={2}>
          <Text
            options={{ boldColor: 'primary' }}
            tA="center"
            id={description}
          />
        </View>
        {typeof onPress === 'function' ? (
          <Button
            id="continue_to_redirect"
            context={{ provider: name }}
            wide
            onPress={onPress}
            loading={loading}
            disabled={loading}
          />
        ) : (
          <ErrorOutput id="something_went_wrong" />
        )}
      </View>
    </View>
  );
}
