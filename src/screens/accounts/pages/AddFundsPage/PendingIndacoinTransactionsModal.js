import React, { useState } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import { StyleSheet } from 'react-native';
import Big from 'big.js';

import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import {
  View,
  Button,
  Text,
  HeaderButton,
  Output,
} from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { Icon } from 'components/outputs/Icon';
import { formatAmountString } from '../../util/rates';
import { useTheme } from 'contexts/ThemeContext';
import { formatDivisibility } from 'utility/general';
import OutputList from 'components/outputs/OutputList';

function styles(props) {
  return StyleSheet.create({
    tip: {
      width: '100%',
      paddingHorizontal: 10,
    },
    rating: {
      width: '100%',
      paddingHorizontal: 10,
    },
    ratingIcon: {
      padding: 10,
    },
    tipButton: {
      padding: 8,
      borderRadius: 100,
      borderWidth: 2,
      backgroundColor: get(props, ['selected'])
        ? get(props, ['colors', 'primary'])
        : 'white',
      borderColor: get(props, ['colors', 'primary']),
      margin: 10,
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
    },
  });
}
export default function PendingIndacoinTransactionsModal(props) {
  const { items } = props;
  const [modalVisible, setModalVisible] = useState(false);
  if (!items || !items.length) {
    return null;
  }

  const outputList = items.map(item => {
    return {
      ...item,
      key: item.id,
      value: formatDivisibility(item.amount_in, 2) + ' EUR',
      label: item.id,
      horizontal: true,
      valueBold: true,
      value2: 'Last updated: ' + moment(item.updated).fromNow(),
    };
  });

  return (
    <React.Fragment>
      <HeaderButton
        color={'primaryContrast'}
        icon={'hourglass-empty'}
        onPress={() => setModalVisible(true)}
      />
      <ModalFullscreen
        close
        // action={{
        //   label: 'ACCEPT',
        //   onPress: () => setModalVisible(false),
        // }}
        title={'Pending transactions'}
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}>
        <View p={0.25}>
          <OutputList items={outputList} />
        </View>
      </ModalFullscreen>
    </React.Fragment>
  );
}

function TipInput(props) {
  const { formikProps, payConfig } = props;
  const { values, setFieldValue } = formikProps;
  const { currency, tip, amount } = values;
  const { tipType, tipValues = [] } = payConfig;
  const { colors } = useTheme();
  const amountBig = Big(parseFloat(amount));

  const tipButtonProps = {
    setFieldValue,
    tip,
    tipType,
    colors,
    amountBig,
    currency,
  };

  return (
    <View w="100%" p={0.125} pt={0.5} pb={1}>
      <Text style={styles().tip}>Would you like to add a tip?</Text>
      <FormikInput
        field={{
          label: 'Amount',
          id: 'tip',
          placeholder: formatAmountString(0, currency.currency),
        }}
        formikProps={formikProps}
      />
      <View fD="row" w="100%" jC="space-between">
        {tipValues.map(value => (
          <TipButton {...tipButtonProps} key={value} value={value} />
        ))}
      </View>
    </View>
  );
}
