import React, { Component } from 'react';
import { ListItem, View, Text } from 'components';
import PropTypes from 'prop-types';
import {
  displayFormatDivisibility,
  formatTime,
  standardizeString,
} from 'utility/general';
import { Icon } from 'components/outputs/Icon';
import { formatVariantsString } from '../util';

class OrderListItem extends Component {
  render() {
    let { item, currency, showModal, noEdit, profile } = this.props;
    let { name, price, total_price, prices, quantity, status, variant } = item;

    if (!price && prices && currency) {
      price = prices.find(price => price.currency.code === currency.code);
    }

    const priceString =
      (price || total_price
        ? displayFormatDivisibility(price ?? total_price, currency.divisibility)
        : 'N/A'
      ).toString() +
      ' ' +
      currency.code;

    return (
      <ListItem
        noImage
        noTitle
        onPress={() => (noEdit ? null : showModal(item))}
        disabled={noEdit}>
        <View f={1} pv={0.5}>
          <View fD="row" w={'100%'} style={styles.title} jC={'space-between'}>
            <Text fW="500">
              {name}
              <Text>
                {variant
                  ? ' - ' +
                    (variant.label
                      ? variant.label
                      : formatVariantsString(variant.options))
                  : ''}
              </Text>
            </Text>
            {!noEdit ? (
              <Icon
                name={'edit'}
                set={'MaterialIcons'}
                color={'font'}
                size={12}
              />
            ) : null}
          </View>
          <View style={{ marginRight: 4 }}>
            <View w={'100%'} fD={'row'}>
              <Text t={'s2'}>{'Qty: ' + quantity}</Text>
              <View f={1}>
                <Text t={'s2'} tA={'right'}>
                  {priceString}
                </Text>
              </View>
            </View>
            {status && noEdit && (
              <React.Fragment>
                <Text
                  t={'s2'}
                  c={
                    status ? (status !== 'failed' ? 'positive' : 'error') : ''
                  }>
                  {standardizeString(status)}
                </Text>
                <Text t={'s2'} opacity={0.7}>
                  {'Updated: ' +
                    formatTime(item.updated, 'MMMM Do, YYYY', profile)}
                </Text>
              </React.Fragment>
            )}
          </View>
        </View>
      </ListItem>
    );
  }
}

const styles = {
  container: {
    // width: '100%',
    // flex: 1,
    // height: 50,
  },
  title: {
    // width: '100%',
    // flex: 1,
    paddingBottom: 2,
  },
  subtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%',
    // height: 50,
  },
  //
};

ListItem.propTypes = {
  item: PropTypes.object, // Text displayed on button
  currency: PropTypes.object, // Animation type
};

ListItem.defaultProps = {
  item: {},
  currency: {},
};

export { OrderListItem };
