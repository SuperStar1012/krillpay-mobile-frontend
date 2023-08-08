import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { Card, View, Text } from 'components';
import { useTheme } from 'contexts/ThemeContext';

const RecipientCard = props => {
  const { name, image } = props;
  const { viewStyleImage, viewStyleName } = styles;
  const { design } = useTheme();

  return (
    <Card onPressContentDisabled design={design.wallets}>
      <View p={1} fD={'row'} jC={'flex-start'} f={1}>
        <Image
          style={viewStyleImage}
          source={
            image
              ? {
                  uri: image,
                  cache: 'only-if-cached',
                }
              : require('./assets/icons/profile.png')
          }
          radius={24}
        />
        <View style={viewStyleName}>
          <View fD={'column'}>
            <Text t="h6">{name}</Text>
            {/* <Text t="s2">{account_name}</Text> */}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  viewStyleImage: { paddingRight: 16, height: 48, borderRadius: 24, width: 48 },
  viewStyleName: {
    // justifyContent: 'space-between',
    justifyContent: 'center',
    paddingLeft: 16,
  },
});

export default RecipientCard;
