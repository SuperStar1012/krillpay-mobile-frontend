import React from 'react';
import { StyleSheet, Platform } from 'react-native';

import { View, Text } from 'components';
import { Icon } from 'components/outputs/Icon';
import { useTheme } from 'contexts/ThemeContext';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // requirement
  icon: {
    height: 24,
    width: 24,
    marginRight: 8,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function isRequirementMet({
  requirement,
  profile,
  documents,
  addresses,
  bankAccounts,
}) {
  let temp = [];
  switch (requirement) {
    case 'first_name':
    case 'last_name':
    case 'nationality':
    case 'birth_date':
    case 'id_number':
    case 'language':
    case 'fathers_name':
    case 'mothers_name':
    case 'grandfathers_name':
    case 'grandmothers_name':
    case 'central_bank_number':
    case 'title':
    case 'gender':
    case 'marital_status':
      return Boolean(profile[requirement]);
    case 'user':
      return profile?.status === 'verified';
    case 'email_address':
      return profile?.verification?.email ?? '';
    case 'mobile_number':
      return profile?.verification?.mobile ?? '';
    case 'proof_of_identity':
      temp = (documents?.items ?? [])?.filter(
        item =>
          item.status === 'verified' &&
          item.document_category === 'proof_of_identity',
      );
      return temp.length > 0;
    case 'proof_of_address':
      temp = (documents?.items ?? [])?.filter(
        item =>
          item.status === 'verified' &&
          item.document_category === 'proof_of_address',
      );
      return temp.length > 0;
    case 'advanced_proof_of_identity':
      temp = (documents?.items ?? [])?.filter(
        item =>
          item.status === 'verified' &&
          item.document_category === 'advanced_proof_of_identity',
      );
      return temp.length > 0;
    case 'address':
      temp = addresses?.items ?? [];
      return temp.length > 0;
    case 'bank_account':
      temp = bankAccounts?.items ?? [];
      return temp.length > 0;

    default:
      return false;
  }
}

export default function TierRequirement(props) {
  let { children, ...restProps } = props;
  const { colors } = useTheme();
  let iconName = 'alert-circle-outline';
  let color = colors.negative;
  let status = isRequirementMet({ requirement: children, ...restProps });
  if (status) {
    color = colors.positive;
    iconName = 'done';
  }

  if (children === 'id_number' && props?.profile?.nationality === 'US')
    children = 'ssn';

  return (
    <View style={styles.container}>
      <Text style={styles.requirement} id={children}></Text>
      {/* <View style={[styles.icon, { backgroundColor: color }]}> */}
      <Icon
        style={{ paddingTop: Platform.OS === 'ios' ? 2 : 0 }}
        size={18}
        name={iconName}
        contained={false}
        set={iconName === 'done' ? 'MaterialIcons' : 'MaterialCommunityIcons'}
        color={color}
      />
      {/* </View> */}
    </View>
  );
}
