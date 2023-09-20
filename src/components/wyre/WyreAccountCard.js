import React from 'react';
import Text from 'components/outputs/Text';
import { Card } from 'components/card/Card';
import { View } from 'components';
import {
  getWyreAccountTitle,
  getWyreAccountSubtitle,
} from 'extensions/wyre/util';
import { useQuery } from 'react-query';
import { getWyrePaymentMethod } from 'utility/rehive';
import Images from 'components/images';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import { standardizeString, statusToColor } from 'utility/general';

export default function WyreAccountCard(props) {
  const { onPress, item } = props;

  function handlePress() {
    onPress(item);
  }

  return (
    <Card
      design={{}}
      containerStyle={{ margin: 0, marginBottom: 20, height: 76 }}
      onPressContent={handlePress}>
      <WyreAccountCardContent {...props} />
    </Card>
  );
}

export function WyreAccountCardContent(props) {
  const { item, color = 'font', context } = props;
  const { wyreAccount } = context;

  const title = getWyreAccountTitle(item);
  const subtitle = getWyreAccountSubtitle(item);
  const accountId = wyreAccount?.item?.id;
  const paymentMethodId = item?.id;
  const institution_id = item?.institution_id;

  const { data: paymentMethod, isLoading: loadingPaymentMethod } = useQuery(
    ['institution', institution_id],
    () =>
      getWyrePaymentMethod({
        accountId,
        paymentMethodId,
        filters: { expand: 'institution_metadata' },
      }),
    {
      enabled: !!accountId && !!paymentMethodId && !!institution_id,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );
  const logo = paymentMethod?.institution_metadata?.logo;
  const image = logo ? `data:image/png;base64,${logo}` : 'bank';

  const status = standardizeString((item?.status ?? '')?.toLowerCase());

  return (
    <View fD={'row'} jC={'flex-start'} bC={'transparent'}>
      <View jC={'center'} style={{ paddingRight: 16, maxWidth: 54 }} h={36}>
        {loadingPaymentMethod ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={38}
              height={38}
              borderRadius={40}
            />
          </SkeletonPlaceholder>
        ) : (
          <Images
            width={image === 'bank' ? 28 : 40}
            height={image === 'bank' ? 28 : 40}
            name={image}
            containerStyle={{
              borderRadius: 20,
              padding: image === 'bank' ? 6 : 0,
            }}
            // padded={image === 'bank'}
          />
        )}
      </View>
      <View fD={'column'} f={1}>
        <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
          <View fD={'column'} f={1} pr={2}>
            <Text
              c={color}
              s={14}
              fW={'500'}
              numberOfLines={1}
              ellipsizeMode="clip">
              {title}
            </Text>
          </View>
        </View>
        <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
          {!!subtitle ? (
            <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
              <View fD={'column'} f={1} pr={2}>
                <Text s={11} fW={'400'} c={color}>
                  {subtitle}
                </Text>
              </View>
            </View>
          ) : (
            <View />
          )}
          <Text s={14} c={statusToColor(status)} id={status} />
        </View>
      </View>
    </View>
  );
}
