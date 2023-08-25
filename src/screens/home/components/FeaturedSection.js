import React from 'react';
import { Pressable } from 'react-native';
import { useQuery } from 'react-query';
import { View, Text } from 'components';
import FeaturedProductCard from './FeaturedProductCard';
import FeaturedRewardCard from './FeaturedRewardCard';

export default function FeaturedSection(props) {
  const {
    id,
    company,
    section = '',
    dataFunction = () => {},
    itemCount = 2,
    fetching,
    navigation,
    wallet,
  } = props;

  const dataQuery = useQuery([id, company?.id], dataFunction, {
    enabled: Boolean(company?.id),
  });

  const loading = !dataQuery || dataQuery?.isLoading;

  const { results = [], count = 0 } = dataQuery?.data?.data ?? {};
  const isSingle = count === 1;
  const title = (isSingle ? section.slice(0, -1) : section).toLowerCase();

  const onMorePress = () => navigation.navigate(section);

  function renderItem(props) {
    const { index } = props;

    let Component;

    switch (section.toLowerCase()) {
      case 'rewards':
        Component = FeaturedRewardCard;
        break;
      case 'products':
      default:
        Component = FeaturedProductCard;
        break;
    }

    return (
      <View
        w={'50%'}
        pb={1}
        mb={1}
        pr={index % 2 === 0 ? 0.5 : 0}
        pl={index % 2 === 0 ? 0 : 0.5}>
        <Component {...{ ...props, navigation, loading }} />
      </View>
    );
  }

  const content = (
    <View w={'100%'}>
      {!loading && results?.length && (
        <View mb={0.25} fD={'row'} aI={'center'} jC={'space-between'}>
          <Text fW={'700'} s={18}>
            Featured {title}
          </Text>
          {!!onMorePress && count > 2 && (
            <Pressable onPress={onMorePress}>
              <Text fW={'500'} c={'primary'} s={14}>
                View more
              </Text>
            </Pressable>
          )}
        </View>
      )}
      <View fD={'row'} aI={'center'} style={{ flexWrap: 'wrap' }}>
        {(results ?? new Array(itemCount).fill(0))?.map((item, index) =>
          renderItem({
            item,
            index,
            wallet,
            layout: isSingle ? 'row' : '',
          }),
        )}
      </View>
    </View>
  );

  return (!loading && !results?.length) || fetching ? null : content;
}
