import React, { useState } from 'react';
import { get, isEmpty } from 'lodash';

import { FlatList } from 'react-native';
import CurrentSessionListItem from './CurrentSessionListItem';
import CurrentSessionsSectionListHeader from './CurrentSessionsSectionListHeader';
import { EmptyListMessage, View } from 'components';

const CurrentSessionsList = props => {
  const {
    items,
    recent,
    sessions,
    setSessions,
    company,
    setCompany,
    companyID,
    navigateAuth,
    hideApps,
    noItems,
    userID,
    appTitleDirection,
  } = props;

  if (isEmpty(items)) {
    return null;
  }

  if (noItems) {
    return (
      <View h={80}>
        <EmptyListMessage>No active app sessions</EmptyListMessage>
      </View>
    );
  }

  const data = Object.keys(items).map(item => {
    return {
      company: recent[item],
      data: Object.values(get(items, item, {})),
      object: get(items, item, {}),
    };
  });

  function handleCompanySelect(item) {
    if (item.data.length > 1) {
      setCompany(item.company);
      setSessions(item.data);
    } else {
      navigateAuth({
        ...item.data[0],
        companyID: get(item, ['company', 'id']),
        switching: true,
      });
    }
  }
  if ((company || hideApps) && !props.displayApps) {
    return (
      <React.Fragment>
        <FlatList
          renderItem={({ item, index }) => (
            <CurrentSessionListItem
              companyID={get(company, 'id')}
              key={get(item, ['user', 'id'], index)}
              item={item}
              navigateAuth={navigateAuth}
              selected={get(item, ['user', 'id']) === userID}
              appTitleDirection={appTitleDirection}
              hideSubtitle
              hideSelectedStyle
              height={24}
              width={24}
              badgeRadius={12}
              badgeFontSize={16}
              containerStyles={{ minHeight: 24, marginLeft: 4 }}
              emailTitle
            />
          )}
          data={sessions}
        />
      </React.Fragment>
    );
  } else {
    return (
      <FlatList
        renderItem={({ item, index }) => (
          <CurrentSessionsSectionListHeader
            item={item}
            selected={get(item, ['company', 'id']) === companyID}
            onPress={handleCompanySelect}
            key={get(item, ['company', 'name'], index)}
            appTitleDirection={appTitleDirection}
            hideSubtitle
          />
        )}
        data={data}
        keyExtractor={item => get(item, ['company', 'name'])}
      />
    );
  }
};

export default React.memo(CurrentSessionsList);
