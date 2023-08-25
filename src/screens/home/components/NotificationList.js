import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { connect, useSelector } from 'react-redux';
import {
  cardDismiss,
  cardRestoreAll,
  fetchAccounts,
  fetchData,
} from '@redux/actions';
import { CardList } from 'components';
import { userProfileSelector, profileSelector } from '@redux/rehive/reducer';
import {
  configCardsHomeSelector,
  configOnboardingSelector,
  userTierSelector,
} from '@redux/rehive/selectors';
import { getTiers } from 'utility/rehive';
import NotificationCard from './NotificationCard';
import NotificationListSkeleton from './NotificationListSkeleton';

const NotificationList = props => {
  let {
    onboardingConfig,
    navigation,
    selectedCurrency,
    data,
    sections,
    onRefresh,
    refreshing,
    onDismiss,
  } = props;

  data = data.filter(item => item);

  const [loading, setLoading] = useState(true);
  const [userGroupTiers, setUserGroupTiers] = useState();

  const user = useSelector(profileSelector);
  const tiers = useSelector(userTierSelector);

  useEffect(() => {
    async function handleFetch() {
      setUserGroupTiers(await getTiers(user?.groups?.[0]?.name));
      setLoading(false);
    }

    handleFetch();
  }, []);

  return loading || refreshing ? (
    <NotificationListSkeleton />
  ) : (
    <CardList
      data={{ data }}
      type="notification"
      emptyListMessage={'No notifications'}
      keyExtractor={item => item?.id}
      noPadding
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={item => (
        <NotificationCard
          {...{
            item,
            navigation,
            currency: selectedCurrency,
            handleDismiss: onDismiss,
            onboardingConfig,
            onboardingSections: sections,
            tiers,
            userGroupTiers,
          }}
        />
      )}
    />
  );
};

const mapStateToProps = state => {
  const { dismissedCards } = state.user;
  return {
    homeCards: configCardsHomeSelector(state),
    profile: userProfileSelector(state),
    onboardingConfig: configOnboardingSelector(state),
    dismissedCards,
  };
};

export default connect(mapStateToProps, {
  cardDismiss,
  cardRestoreAll,
  fetchAccounts,
  fetchData,
})(NotificationList);
