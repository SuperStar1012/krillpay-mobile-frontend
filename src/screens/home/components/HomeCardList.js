import React from 'react';
import { View } from 'components';
import { getProducts, getCampaigns } from 'utility/rehive';
import NotificationList from './NotificationList';
import FeaturedSection from './FeaturedSection';

export default function CombinedComponent(props) {
  const { data, ...restProps } = props;

  return (
    <View ph={1} pt={1} f={1}>
      {!!data?.find(
        x => !['featured_products', 'featured_rewards'].includes(x?.type),
      ) && <NotificationList {...props} />}

      {/* {!!data?.find(x => x?.type === 'featured_products') && (
        <FeaturedSection
          {...restProps}
          id={'featured_products'}
          section={'Products'}
          dataFunction={() => getProducts('?page_size=2')}
        />
      )}
      {!!data?.find(x => x?.type === 'featured_rewards') && (
        <FeaturedSection
          {...restProps}
          id={'featured_rewards'}
          section={'Rewards'}
          dataFunction={() => getCampaigns('?page_size=2')}
        />
      )} */}
    </View>
  );
}
