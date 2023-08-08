import React from 'react';
import { View } from 'components/layout/View';
import { Text } from 'components';
import { Icon } from 'components/outputs/Icon';
import Info from './Info';

const helpConfig = id => [
  {
    name: 'star',
    color: 'primary',
    label: 'primary_help_label',
  },
  { name: 'star-border', color: 'font', label: 'non_primary_help_label' },
  { name: 'done', color: 'positive', label: 'verified_help_label' },
  { name: 'close', color: 'negative', label: 'unverified_help_label' },
];

export default function ProfileHelpModal(props) {
  const { id } = props;
  return (
    <View>
      {helpConfig(id)?.map(item => (
        <View
          key={item?.name ?? item}
          fD="row"
          ph={1}
          aI="center"
          pb={1}
          mr={1.5}>
          <Icon
            style={{ paddingRight: 16 }}
            name={item?.name}
            color={item?.color}
            size={20}
            set={'MaterialIcons'}
          />
          <Text id={item?.label} context={{ id }} />
        </View>
      ))}
      <Info id="profile_help_temporarily_disabled" context={{ id }} />
    </View>
  );
}
