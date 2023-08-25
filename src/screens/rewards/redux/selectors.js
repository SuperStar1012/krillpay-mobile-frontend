import { createSelector } from 'reselect';
import _ from 'lodash';

const rewardsStateSelector = state => state.rewards;

const empty = {
  data: [],
  loading: true,
  nextLoading: false,
  more: false,
  error: 'No data',
};

export const rewardsSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    try {
      const { rewards } = rewardsState;
      if (!rewards) {
        return empty;
      }
      const { ids, byId, error, loading, next, nextLoading } = rewards;

      const items = ids.map(id => byId[id]);
      return {
        data: items ? _.orderBy(items, 'created', 'desc') : [],
        more: Boolean(next),
        loading,
        nextLoading,
        error,
      };
    } catch (e) {
      console.log('TCL: e', e);
      return empty;
    }
  },
);

export const rewardsNextSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    const { rewards } = rewardsState;
    const { next } = rewards;

    return next;
  },
);

export const campaignsSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    try {
      const { campaigns, rewards } = rewardsState;
      const { ids, byId, error, loading, next, nextLoading } = campaigns;

      let active = [];
      let expired = [];

      let pendingRewards = [];
      let acceptedRewards = [];

      const rewardItems = rewards.ids.map(id => rewards.byId[id]);
      const items = ids.map(id => byId[id]);

      rewardItems &&
        rewardItems.length &&
        rewardItems.length > 0 &&
        rewardItems.map(reward => {
          if (reward.status === 'pending') {
            pendingRewards.push(_.get(reward, ['campaign', 'id']));
          } else if (reward.status === 'accepted') {
            acceptedRewards.push(_.get(reward, ['campaign', 'id']));
          }
        });

      if (items && items.length && items.length > 0) {
        active = items.filter(
          campaign =>
            campaign.active &&
            campaign.end_date > Date.now() &&
            !pendingRewards.includes(campaign.id) &&
            (!campaign.max_per_user ||
              acceptedRewards.filter(reward => reward === campaign.id).length <
                campaign.max_per_user),
        );
        expired = _.difference(campaigns, active);
      }

      return {
        data: active ? active : [],
        data2: expired,
        pendingRewards: pendingRewards,
        more: Boolean(next),
        loading,
        nextLoading,
        error,
      };
    } catch (e) {
      console.log('TCL: e', e);
      return empty;
    }
  },
);

export const campaignsNextSelector = createSelector(
  [rewardsStateSelector],
  rewardsState => {
    const { campaigns } = rewardsState;
    const { next } = campaigns;

    return next;
  },
);
