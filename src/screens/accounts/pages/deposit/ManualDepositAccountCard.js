import React from 'react';
import { View } from 'components/layout/View';
import { Card } from 'components/card/Card';
import Text from 'components/outputs/Text';
import Images from 'components/images';

export default function ManualDepositAccountCard({ account, onAccountSelect }) {
  function handleAccountSelect() {
    onAccountSelect(account);
  }

  return (
    <Card
      design={{}}
      containerStyle={{ margin: 0, marginBottom: 20, height: 76 }}
      onPressContent={handleAccountSelect}>
      <View fD={'row'} jC={'flex-start'} bC={'transparent'}>
        <View jC={'center'} style={{ paddingRight: 16, maxWidth: 54 }} h={36}>
          <Images
            width={28}
            height={28}
            name="bank"
            containerStyle={{
              borderRadius: 20,
              padding: 6,
            }}
          />
        </View>
        <View fD={'column'} f={1}>
          <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
            <View fD={'column'} f={1} pr={2}>
              <Text
                c="font"
                s={14}
                fW={'500'}
                numberOfLines={1}
                ellipsizeMode="clip">
                {account.name}
              </Text>
            </View>
          </View>
          <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
            <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
              <View fD={'column'} f={1} pr={2}>
                <Text s={11} fW={'400'} c="font">
                  {account.bank_name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
