import React from 'react';
import { StyleSheet } from 'react-native';
import { orderBy } from 'lodash';

import TierRequirement from './TierRequirement';
import { SectionListHeader } from 'components/layout/SectionListHeader';
import { View, Text } from 'components';

const styles = StyleSheet.create({
  requirement: {
    paddingVertical: 8,
  },
});

export default function TierRequirements(props) {
  const { item, items, ...restProps } = props;

  let { requirements } = item;

  if (item.level > 1) {
    const previousRequirements = items.find(
      temp => temp.level === item.level - 1,
    );

    requirements = requirements.filter(
      requirement =>
        previousRequirements.requirements.findIndex(
          previousRequirement =>
            previousRequirement.requirement === requirement.requirement,
        ) === -1,
    );
  }

  requirements = orderBy(requirements, item => item.requirement);

  return (
    <View>
      <SectionListHeader>
        {'Tier ' + item.level + (item.name ? ' - ' + item.name : '')}
      </SectionListHeader>
      {requirements && requirements.length && requirements.length > 0 ? (
        requirements.map(({ id, requirement }) => (
          <TierRequirement key={id} style={styles.requirement} {...restProps}>
            {requirement}
          </TierRequirement>
        ))
      ) : (
        <Text tA="left" style={styles.requirement}>
          No requirements
        </Text>
      )}
    </View>
  );
}
