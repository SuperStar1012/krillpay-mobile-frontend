import React, { useState, useEffect } from 'react';
import { Pressable, Image } from 'react-native';
import moment from 'moment';
import { get, intersection } from 'lodash';
import {
  formatDivisibility,
  addCommas,
  displayFormatDivisibility,
} from 'utility/general';
import { Text, Spinner, CustomIcon, View } from 'components';
import { getConversionRate, getOtherUserProfile } from 'utility/rehive';
import { calculateRate, formatDecimals, getCurrencyCode } from '../util/rates';
import TransactionListDetail from './TransactionListDetail';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { useSubtypeCopy } from '../util/transactions';

export default function TransactionListItem(props) {
  const {
    item,
    crypto,
    services,
    rates,
    navigation,
    profile,
    getTransactions,
    nav,
    c,
  } = props;

  const recipientTypes = intersection(['email', 'mobile']);

  const recipientDetails = async () => await getOtherUserProfile(recipient);

  const {
    viewStyleContainer,
    textStyleHeader,
    textStyleDate,
    textStyleAmount,
    imageStylePhoto,
  } = styles;
  const [item2, setItem2] = useState(item);
  const [modal, setModal] = useState(false);

  const { total_amount, currency, created, subtype } = item;

  const [loading, setLoading] = useState(true);
  const [tempRates, setTempRates] = useState(rates.rates);

  const hasConversion =
    services?.conversion_service &&
    rates &&
    rates.rates &&
    rates.displayCurrency &&
    rates.displayCurrency.code !== currency.code;

  const isBlankRequest =
    subtype === 'request' && [0, null, 'None'].includes(total_amount);

  const amountString = isBlankRequest
    ? 'Any amount'
    : `${addCommas(
        displayFormatDivisibility(total_amount, currency.divisibility),
      )} ${getCurrencyCode(currency)}`;

  let tempConvRate = 0;
  let convAmountString = '';

  useEffect(() => {
    if (hasConversion) {
      setLoading(true);
      async function fetchData() {
        let key__in = '';
        if (currency.code !== 'USD') {
          key__in = 'USD:' + currency.code;
        }
        if (rates.displayCurrency.code !== 'USD') {
          key__in = key__in ? key__in + ',' : '';
          key__in = key__in + 'USD:' + rates.displayCurrency.code;
        }
        const resp = await getConversionRate(key__in, created);
        if (resp && resp.status === 'success') {
          setTempRates(get(resp, ['data', 'rates'], {}));
        }
        setLoading(false);
      }
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, hasConversion]);

  if (hasConversion) {
    tempConvRate = calculateRate(
      currency.code,
      rates.displayCurrency.code,
      tempRates,
    );
    convAmountString =
      '~' +
      formatDecimals(
        formatDivisibility(total_amount, currency.divisibility).replace(
          '-',
          '',
        ) * tempConvRate,
        rates.displayCurrency.divisibility,
      ) +
      ' ' +
      rates.displayCurrency.code;
  }

  const { text, color, iconName, iconColor, recipient, copyConfig, image } =
    useSubtypeCopy(item, crypto);

  return (
    <React.Fragment>
      <Pressable
        underlayColor="lightgrey"
        onPress={() => {
          setModal(true);
        }}>
        <View style={viewStyleContainer} ph={1}>
          <View width={36}>
            {image ? (
              <Image
                style={[imageStylePhoto]}
                source={{
                  uri: image,
                }}
              />
            ) : (
              <CustomIcon
                name={iconName}
                size={37}
                color={
                  iconColor
                    ? iconColor
                    : iconName
                    ? 'primary'
                    : color
                    ? color
                    : 'black'
                }
              />
            )}
          </View>
          <View style={styles.innerContainer}>
            <View style={{ paddingLeft: 18, paddingRight: 8, flex: 1 }}>
              <Text s={18} fW={'500'}>
                {text}
              </Text>
              <Text s={12} fW={'400'} c={'#898989'}>
                {moment(created).fromNow()}
              </Text>
            </View>
            <View>
              <Text c={color} s={18} fW={'500'} tA="right">
                {amountString}
              </Text>
              {hasConversion && !isBlankRequest && (
                <View>
                  {loading && !convAmountString ? (
                    <View
                      style={{
                        alignItems: 'flex-end',
                        maxHeight: 10,
                        transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
                      }}>
                      <Spinner size={'small'} />
                    </View>
                  ) : (
                    <Text s={12} fW={'400'} c={'#898989'} tA="right">
                      {convAmountString}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
      {!!modal && (
        <ModalFullscreen
          visible={modal}
          scrollView
          title={text}
          iconTitleRight={'close'}
          onPressTitleRight={() => setModal(false)}
          onDismiss={() => setModal(false)}>
          <TransactionListDetail
            profile={profile}
            currency={props?.wallet ?? props?.currency}
            // title={text + text2}
            recipientDetails={recipientDetails}
            getTransactions={getTransactions}
            nav={nav}
            c={c}
            closeModal={() => {
              setModal(false);
              // nav(c);
              // console.log(navigation);
            }}
            navigation={navigation}
            recipient={recipient}
            open={modal}
            rates={rates}
            item={item2}
            setItem={setItem2}
            crypto={crypto}
            convRate={tempConvRate}
            copyConfig={copyConfig}
          />
        </ModalFullscreen>
      )}
    </React.Fragment>
  );
}

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    // paddingRight: 8,
    // paddingLeft: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewStyleAmount: {
    // right: 0,
  },
  textStyleDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  imageStylePhoto: {
    width: 37,
    height: 37,
    borderRadius: 32,
  },
};
