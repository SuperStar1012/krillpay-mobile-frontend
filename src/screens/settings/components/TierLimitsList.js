import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import _ from 'lodash';

import LimitsList from 'screens/accounts/components/LimitsList';
import { SectionListHeader } from 'components/layout/SectionListHeader';
import { EmptyListMessage } from 'components';
import { standardizeString } from 'utility/general';

export default function TierLimitsList({ items, currencies }) {
  let grouped = null;

  grouped = _(items)
    .groupBy(item => item.currency)
    .map((limits, code) => {
      const currency = currencies.data.find(
        item => item.currency.code === code,
      );
      if (currency) {
        const subtypes = _.uniq(limits.map(limit => limit.subtype));
        return {
          title: standardizeString(
            _.get(currency, ['currency', 'description']),
          ),
          data: [
            {
              tier: { limits },
              currency,
              subtypes,
            },
          ],
        };
      }
      return null;
    })
    .value()
    .filter(item => item);

  return (
    <SectionList
      style={styles.container}
      renderItem={({ item }) => (
        <View style={styles.limits}>
          {item.subtypes.map(subtype => (
            <LimitsList key={subtype} subtype={subtype} {...item} />
          ))}
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <SectionListHeader>{title}</SectionListHeader>
      )}
      sections={grouped}
      keyExtractor={item => item.id}
      ListEmptyComponent={
        <EmptyListMessage>No applicable limits</EmptyListMessage>
      }
    />
  );
}

const styles = StyleSheet.create({
  limits: {
    paddingBottom: 8,
  },
  container: {
    // paddingHorizontal: 16,
    paddingTop: 8,
  },
});

// TierLimitsList.propTypes = {};

// TierLimitsList.defaultProps = {};
