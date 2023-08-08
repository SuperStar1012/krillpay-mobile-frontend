import React, { useState } from 'react';
import { get } from 'lodash';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Big from 'big.js';

import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { View, Button, Text } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { Icon } from 'components/outputs/Icon';
import { formatAmountString } from '../../util/rates';
import { useTheme } from 'contexts/ThemeContext';

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
export default function AddTipModal(props) {
  const { formikProps, actionConfig } = props;
  const { values } = formikProps;
  const { tip, rating } = values;
  const [modalVisible, setModalVisible] = useState(false);

  const payConfig = get(actionConfig, ['pay', 'config'], {});
  const { showTip = false, showRating = false } = payConfig;

  if (!(showTip || showRating)) {
    return null;
  }

  const label =
    (tip || rating ? 'Edit ' : 'Add ') +
    (showTip && showRating ? 'tip/rating' : showTip ? 'tip' : 'rating') +
    '?';

  const inputProps = { formikProps, payConfig };
  return (
    <React.Fragment>
      <View fD={'row'} jC={'flex-end'}>
        <Button
          label={label}
          color="primary"
          buttonStyle={{ padding: 0, paddingRight: 2 }}
          type="text"
          size="small"
          onPress={() => setModalVisible(true)}
        />
      </View>
      <ModalFullscreen
        close
        action={{
          label: 'ACCEPT',
          onPress: () => setModalVisible(false),
        }}
        title={label}
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}>
        <React.Fragment>
          {showTip && <TipInput {...inputProps} />}
          {showRating && <RatingInput {...inputProps} />}
          {/* <View p={1}>
            <Button
              color={'primary'}
              wide
              onPress={() => setModalVisible(false)}
              label="SAVE"
            />
          </View> */}
        </React.Fragment>
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
          placeholder: formatAmountString(0, currency),
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

function TipButton(props) {
  const {
    setFieldValue,
    tip,
    tipType,
    colors,
    amountBig,
    value,
    currency,
  } = props;

  const selected = tipType
    ? tip === value
    : amountBig.times(parseInt(value) / 100).valueOf() === tip;

  return (
    <TouchableOpacity
      onPress={() =>
        setFieldValue(
          'tip',
          !tipType ? amountBig.times(parseInt(value) / 100).toString() : value,
        )
      }
      style={styles({ colors, selected }).tipButton}>
      <React.Fragment>
        <Text c={selected ? 'primaryContrast' : 'primary'}>
          {tipType ? currency.symbol + value : value + '%'}
        </Text>
        {!tipType && (
          <Text s={10} c={selected ? 'primaryContrast' : 'primary'}>
            {formatAmountString(
              amountBig.times(parseInt(value) / 100),
              currency,
            )}
          </Text>
        )}
      </React.Fragment>
    </TouchableOpacity>
  );
}

function RatingInput(props) {
  const { formikProps } = props;
  const { values, setFieldValue } = formikProps;
  const { rating = 0 } = values;
  const ratings = ['1', '2', '3', '4', '5'];
  return (
    <View>
      <Text style={styles().rating}>Rate your experience</Text>
      <View fD="row" w="100%" jC="space-between">
        {ratings.map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => setFieldValue('rating', value)}>
            <Icon
              style={styles().ratingIcon}
              name={'star'}
              set="MaterialIcons"
              color={rating >= value ? 'primary' : '#e2e2e2'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
