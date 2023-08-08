import React from 'react';
import { connect } from 'react-redux';
import {
  fetchRewards,
  fetchCampaigns,
  fetchCampaignsNext,
  fetchRewardsNext,
} from '../redux/actions';

import { View } from 'components'; //CardList,
import CardList from 'components/card/CardListNew';
import { campaignsSelector, rewardsSelector } from '../redux/selectors';
import CampaignCard from './CampaignCardNew';
import RewardCard from './RewardCard';
// import InnerTabs from 'components/layout/InnerTabs';
// import RewardsBanner from './images/RewardsBanner';
// import ReferRewardBanner from './images/ReferRewardBanner';
import Tabs from 'components/layout/TopTabs';

import { useTheme } from 'components/contexts/ThemeContext';

export function CampaignList(props) {
  const {
    campaigns,
    onRefresh,
    onRefresh2,
    header,
    fetchNext,
    filters,
    colors,
    navigation,
    ...restProps
  } = props;

  const data = {
    ...campaigns,
    items: filters && filters.expired ? campaigns.data2 : campaigns.data,
  };
  // const dispatch = useDispatch();

  // function onRefresh() {
  //   dispatch(fetchCampaigns());
  // }
  // // useEffect(() => {
  // //   onRefresh();
  // // }, []);

  return (
    <React.Fragment>
      {/* <View aI="center">
        <ReferRewardBanner color={colors.primary} navigation={navigation} />
      </View> */}
      <CardList
        {...restProps}
        numColumns={2}
        header={header}
        data={data}
        type={'reward'}
        onRefresh={onRefresh}
        getNext={() => fetchNext()}
        renderItem={({ item, index }) => (
          <CampaignCard
            {...props}
            item={item}
            index={index}
            // detailObj={detailObj}
            pendingRewards={data.pendingRewards}
            onRefresh={() => {
              onRefresh();
              onRefresh2();
            }}
          />
        )}
        emptyListMessage={'No new campaigns'}
      />
    </React.Fragment>
  );
}

export function PendingList(props) {
  const { rewards, onRefresh, fetchNext, ...restProps } = props;

  const data = {
    ...rewards,
    items: rewards.data.filter(campaign => campaign.status === 'pending'),
  };

  return (
    <CardList
      {...restProps}
      numColumns={2}
      data={data}
      type={'reward'}
      onRefresh={onRefresh}
      getNext={() => fetchNext()}
      renderItem={({ item, index }) => (
        <View pb={1}>
          <RewardCard {...props} item={item} index={index} />
        </View>
      )}
      emptyListMessage={'No pending rewards'}
    />
  );
}

export function RewardList(props) {
  const { rewards, onRefresh, fetchNext, id, ...restProps } = props;

  const data = {
    ...rewards,
    items: rewards.data.filter(
      reward => reward.status === 'accepted' || reward.status === 'rejected',
    ),
  };

  return (
    <CardList
      {...restProps}
      numColumns={2}
      id={id}
      data={data}
      type={'reward'}
      onRefresh={onRefresh}
      getNext={() => fetchNext()}
      renderItem={({ item, index }) => (
        <View pb={1}>
          <RewardCard {...props} item={item} index={index} />
        </View>
      )}
      emptyListMessage={'No earned rewards'}
    />
  );
}

function RewardLists(props) {
  const { colors } = useTheme();
  // state = {
  //   filters: { expired: false },
  //   showFilters: false,
  // };
  // render() {
  const { rewards, campaigns, initialTab, navigation, ...restProps } = props;

  // const { filters, showFilters } = state;
  // const toggleFilters = () => setState({ showFilters: !showFilters });
  // const rightBadge = filters && filters.expired;
  // const tabs = ['Available', 'Claimed', 'Earned'];
  // const initialPage = tabs.findIndex(item => item === initialTab);

  const tabItems = [
    {
      key: 'rewards',
      component: CampaignList,
      props: {
        colors,
        navigation,
        campaigns,
        // filters,
        onRefresh: props.fetchCampaigns,
        onRefresh2: props.fetchRewards,
        fetchNext: props.fetchCampaignsNext,
        ...restProps,
      },
    },
    {
      key: 'pending',
      component: PendingList,
      props: {
        colors,
        rewards,
        navigation,
        onRefresh: props.fetchRewards,
        fetchNext: props.fetchRewardsNext,
        ...restProps,
      },
    },
    {
      component: RewardList,
      key: 'earned',
      props: {
        colors,
        rewards,
        navigation,
        onRefresh: props.fetchRewards,
        fetchNext: props.fetchRewardsNext,
        ...restProps,
      },
    },
  ];

  return (
    <React.Fragment>
      {/* <RewardsBanner primary={colors.primary} /> */}
      {/* <InnerTabs
        routes={tabItems}
        config={{ screenId: 'rewards' }}
        // initialPage={initialPage}
        // onChangeTab={handleChangeTab}
      /> */}
      <Tabs
        routes={tabItems}
        // initialPage={initialPage}
        // onChangeTab={handleChangeTab}
      />

      {/* <Filters
          toggleFilters={toggleFilters}
          showFilters={showFilters}
          items={[
            {
              label: 'Unavailable rewards',
              onClick: () =>
                setState({
                  filters: { ...filters, expired: !filters.expired },
                  claimed: false,
                }),
              value: filters.expired,
            },
          ]}
        /> */}
    </React.Fragment>
  );
}

const mapStateToProps = store => {
  return {
    campaigns: campaignsSelector(store),
    rewards: rewardsSelector(store),
  };
};

export default connect(
  mapStateToProps,
  {
    fetchRewards,
    fetchCampaigns,
    fetchCampaignsNext,
    fetchRewardsNext,
  },
  null,
  { forwardRef: true },
)(RewardLists);
