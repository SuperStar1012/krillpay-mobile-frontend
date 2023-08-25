import React from 'react';

import { View } from 'components';
import CampaignCard from '../components/CampaignCard';
import RewardCard from '../components/RewardCard';
import {
  getRewards,
  getCampaigns,
  getCampaign,
  getReward,
} from 'utility/rehive';
import Page from 'components/containers/Page';

const config = {
  id: 'rewards',
  defaultPage: 'available',
  variant: 'tabs', // TODO: add isBusiness logic here
  pages: {
    available: {
      props: { numColumns: 2 },
      variant: 'list',
      type: 'campaign',
      fetchData: () => getCampaigns('?available=true'),
      fetchItem: getCampaign,
      renderItem: CampaignCard,
    },
    claimed: {
      props: { numColumns: 2 },
      variant: 'list',
      type: 'reward',
      fetchData: () => getRewards('?status=pending'),
      fetchItem: getReward,
      renderItem: RewardCard,
    },
    earned: {
      props: { numColumns: 2 },
      variant: 'list',
      type: 'reward',
      fetchData: () => getRewards('?status__in=accepted,rejected'),
      fetchItem: getReward,
      renderItem: RewardCard,
    },
  },
};

export default function RewardsLists(props) {
  return (
    <View screen hC="header">
      <Page {...props} config={config} />
    </View>
  );
}
