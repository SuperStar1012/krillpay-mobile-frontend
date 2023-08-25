import React from 'react';
import { get } from 'lodash';

import { View, Dimensions, StyleSheet } from 'react-native';
import { Text, Button } from 'components';
import { useTheme } from 'components/context';
import Grid from '../../components/Grid';
import { objectToArray } from 'utility/general';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { formatAmountString } from '../../util/rates';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PrepaidVoucherList = props => {
  let { items, formikProps, config, currency } = props;
  const { colors } = useTheme();
  const { viewStyleContainer } = styles({ ...props, colors });
  if (!formikProps) {
    return null;
  }
  const { values, setFieldValue } = formikProps;
  let { amount: value, paymentMethod } = values;
  ({ currency } = currency);

  if (!currency) {
    return <ErrorOutput>No currency selected</ErrorOutput>;
  }
  if (!items) {
    items = objectToArray(get(config, ['fixed', 'options']), 'id');
  }

  function updateValue(item) {
    setFieldValue('amount', item.id);
  }

  return (
    <Grid
      emptyListMessage="No available vouchers for this currency"
      containerStyle={viewStyleContainer}
      renderItem={item => (
        <PrepaidVoucherCard
          currency={currency}
          config={config.config}
          colors={colors}
          key={item.id}
          selected={value === item.id}
          onPress={() => updateValue(item)}
          {...item}
        />
      )}
      items={items}
      amountPerRow={2}
    />
  );
};

export default PrepaidVoucherList;

const PrepaidVoucherCard = props => {
  const { id, amount, currency, points, cashBack, selected, onPress } = props;
  // const { colors } = useTheme();
  const { viewStyleCard, viewStylePoints, viewStylePointsTail } = styles(props);

  const amountString = formatAmountString(amount, currency, true);

  return (
    <Button onPress={onPress}>
      <View style={viewStyleCard}>
        {Boolean(points) && (
          <React.Fragment>
            <View style={viewStylePoints}>
              <Text c="white" fW="700" t="b2">
                {'+' + points + ' pts'}
              </Text>
            </View>
            <View style={viewStylePointsTail}></View>
          </React.Fragment>
        )}
        <Text
          c={selected ? 'primaryContrast' : 'primary'}
          o={selected ? 0.7 : 1}
          fW="600"
          p={0.125}>
          {amountString}
        </Text>
        {/* {Boolean(cashBack) && (
          <Text t="s2" c={selected ? 'primaryContrast' : 'font'}>
            {cashBack + ' ' + currency + ' cash back'}
          </Text>
        )} */}
      </View>
    </Button>
  );
};

const TAIL_WIDTH = 6;
const GRID_MARGIN = 12;
function styles(props) {
  const { selected = false, colors } = props;

  return StyleSheet.create({
    viewStyleContainer: {
      padding: 4,
      paddingBottom: 16,
    },
    viewStyleCard: {
      width: SCREEN_WIDTH / 2 - GRID_MARGIN * 3,
      backgroundColor: selected ? colors.primary : '#E6E6E6',
      borderRadius: 15,
      padding: 8,
      margin: GRID_MARGIN,
      marginLeft: 8 + TAIL_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
    },
    viewStylePoints: {
      position: 'absolute',
      top: 4,
      left: -TAIL_WIDTH,
      padding: 4,
      paddingRight: 8,
      height: 25,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      backgroundColor: '#00B715',
    },
    viewStylePointsTail: {
      position: 'absolute',
      top: 29,
      left: -TAIL_WIDTH,
      borderTopColor: '#068D16',
      width: 0,
      height: 0,
      borderLeftWidth: TAIL_WIDTH,
      borderRightWidth: 0,
      borderTopWidth: TAIL_WIDTH * 1.5,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
  });
}
