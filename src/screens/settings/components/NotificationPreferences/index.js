import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { SectionList } from 'react-native';
import _ from 'lodash';

import { View, Spinner, EmptyListMessage, Text } from 'components';
import { SectionListHeader } from 'components/layout/SectionListHeader';
import { standardizeString } from 'utility/general';
import NotificationManageListItem from './NotificationManageListItem';
import { useToast } from 'contexts/ToastContext';
import { useRehive } from 'hooks/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useQueryClient } from 'react-query';
import Tabs from 'components/layout/Tabs';

export default function NotificationManageList(props) {
  const disabledHook = useState(false);

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const {
    context: { user, init },
  } = useRehiveContext();
  const {
    context: { notifications },
    refresh,
  } = useRehive(['notifications'], init, {
    user,
  });

  const { items: data, loading } = notifications;
  function setData(newData) {
    queryClient.setQueryData(['rehive', user?.id, 'notifications'], newData);
    refresh();
  }
  const dataHook = [data, setData];

  let items = _(data)
    .groupBy(item => item.type)
    .value();

  const emailNotifications = _(items.email)
    .groupBy(item => (item?.event ?? '').split('.')[0])
    .map((value, key) => ({ type: key, data: value }))
    .value();

  const smsNotifications = _(items.sms)
    .groupBy(item => (item?.event ?? '').split('.')[0])
    .map((value, key) => ({ type: key, data: value }))
    .value();

  const pushNotifications = _(items.push)
    .groupBy(item => (item?.event ?? '').split('.')[0])
    .map((value, key) => ({ type: key, data: value }))
    .value();

  const showEmail = emailNotifications.length > 0;
  const showSms = smsNotifications.length > 0;
  const showPush = pushNotifications.length > 0;
  const showTabs =
    (showEmail && showSms) || (showEmail && showPush) || (showPush && showSms);

  const sharedTabProps = {
    renderItem: ({ item }) => (
      <NotificationManageListItem
        key={item.id}
        item={item}
        dataHook={dataHook}
        disabledHook={disabledHook}
        showToast={showToast}
      />
    ),
    renderSectionHeader: ({ section: { type } }) => (
      <SectionListHeader>{standardizeString(type)}</SectionListHeader>
    ),
    keyExtractor: item => item.id,
  };

  let tabItems = [];

  if (showEmail)
    tabItems.push({
      key: 'email',
      component: SectionList,
      props: { ...sharedTabProps, sections: emailNotifications },
    });
  if (showSms)
    tabItems.push({
      key: 'sms',
      title: 'SMS',
      component: SectionList,
      props: { ...sharedTabProps, sections: smsNotifications },
    });
  if (showPush)
    tabItems.push({
      key: 'push',
      component: SectionList,
      props: { ...sharedTabProps, sections: pushNotifications },
    });

  return (
    <View f={1}>
      {loading ? (
        <Spinner />
      ) : showTabs ? (
        <Tabs routes={tabItems} />
      ) : (
        <EmptyListMessage id="notifications" />
      )}
    </View>
  );
}

NotificationManageList.propTypes = {};

NotificationManageList.defaultProps = {};
