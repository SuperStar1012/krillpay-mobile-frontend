import React, { useState } from 'react';
import { get } from 'lodash';
import { Text, View, TextField, Button } from 'components';
import { formatAmountString } from '../../util/rates';
import { Icon } from 'components/outputs/Icon';
// import ConversionRate from '../../components/ConversionRate';

export default function PayInvoice(props) {
  const {
    formikProps,
    request,
    quote,
    currency,
    hooks,
    toCurrency,
    data,
    isBlankRequest,
    hideInvoice,
  } = props;
  const { conversionQuote } = hooks;
  const { values, setFieldTouched, setFieldValue } = formikProps;
  const { tip, rating, amount, editing } = values;
  const { request_amount, request_currency = currency?.currency, description } =
    request ?? {};

  const items = get(request, 'metadata.service_business.items', []);

  const amountValue =
    quote?.amount ?? request_amount ?? conversionQuote?.from_amount ?? amount;

  const convAmountValue =
    (isBlankRequest ? null : request_amount) ??
    conversionQuote?.to_total_amount;

  let currencyValue = null;
  let convCurrencyValue = null;

  if (request) {
    currencyValue = quote?.currency ?? request_currency;
    convCurrencyValue = request_currency;
  } else {
    currencyValue =
      (conversionQuote ? currency?.currency : toCurrency?.currency) ??
      currency?.currency;
    convCurrencyValue = toCurrency?.currency;
  }

  const amountValueString =
    isBlankRequest && !quote?.amount
      ? 'Any amount'
      : formatAmountString(
          amountValue,
          currencyValue,
          Boolean(request || conversionQuote),
        );

  const subtotalString = formatAmountString(
    request_amount,
    request_currency,
    true,
  );
  const tipString = formatAmountString(tip, request_currency);
  const totalString = formatAmountString(
    parseFloat(request_amount) + (tip ? parseFloat(tip) : 0),
    request_currency,
    true,
  );

  const [showInvoice, setShowInvoice] = useState(hideInvoice);
  const simpleLayout = items.length < 2 && !get(items, [0, 'name']);

  let ratings = [];
  for (let index = 0; index < rating; index++) {
    ratings.push(index);
  }

  const isRequest = Boolean(request);
  const hasQuote = Boolean(quote || conversionQuote);
  const showEdit = Boolean(!isRequest && !data?.amount);

  // const rate =
  //   quote?.conversion_quote?.rate ?? parseFloat(conversionQuote?.rate);

  return (
    <View pb={0}>
      {editing ? (
        <TextField
          label={'Amount'}
          value={amount}
          type="currency"
          // multiline={false}
          // error={touch && error}
          onBlur={() => setFieldTouched('amount')}
          onChangeText={value => setFieldValue('amount', value)}
        />
      ) : (
        <React.Fragment>
          <View>
            <View fD="row" aI="center" pb={0.5} w="100%" jC="center">
              {/* {showEdit && <View w={34} />} */}
              <Text tA="center" c="primary" t="h2" fW="bold" s={30}>
                {amountValueString}
              </Text>
              {/* {showEdit && (
                <Button onPress={() => setFieldValue('editing', true)}>
                  <Icon
                    set="MaterialIcons"
                    name={'edit'}
                    size={22}
                    color={'primary'}
                    style={{ paddingLeft: 12 }}
                  />
                </Button>
              )} */}
            </View>
          </View>

          {description && (
            <>
              <View mb={0.5}>
                <Text s={14} c={'#777'}>
                  Note
                </Text>
              </View>
              <Text>{description}</Text>
            </>
          )}
        </React.Fragment>
      )}
    </View>
  );
}

{
  /* {hasQuote && (
              <Text s={14} style={{ opacity: 0.67 }} tA="center">
                {formatAmountString(convAmountValue, convCurrencyValue, true)}
              </Text>
            )} */
}

{
  /* {Boolean(rate) && (
            <View pt={0.25} pb={0.5}>
              <ConversionRate>
                {renderRate({
                  toCurrency: convCurrencyValue,
                  fromCurrency: currencyValue,
                  rate,
                })}
              </ConversionRate>
            </View>
          )} */
}
{
  /* {!hideInvoice && !showInvoice && isRequest && (
            <View fD={'row'} jC={'center'}>
              <Button
                label={(showInvoice ? 'Hide' : 'Show') + ' invoice details'}
                color="primary"
                buttonStyle={{
                  paddingBottom: 0,
                  magin: 0,
                  paddingRight: 2,
                  height: 'auto',
                }}
                type="text"
                size="small"
                onPress={() => setShowInvoice(!showInvoice)}
              />
            </View>
          )} */
}

{
  /* {!hideInvoice &&
            (showInvoice && !simpleLayout ? (
              <View pb={0.5}>
                <View w="100%" fD="row" f={1} pb={0.25} pt={0.5}>
                  <Text s={12} style={{ flex: 4 }}>
                    Product
                  </Text>
                  <Text s={12} tA="right" style={{ flex: 1 }}>
                    Qty
                  </Text>
                  <Text s={12} tA="right" style={{ flex: 4 }}>
                    Price
                  </Text>
                </View>
                <View>
                  {items.length > 0
                    ? items.map((item, index) => (
                        <View key={item.id} w="100%" fD="row" pv={0.25}>
                          <Text style={{ flex: 4 }}>{item.name}</Text>
                          <Text tA="right" style={{ flex: 1 }}>
                            {item.quantity}
                          </Text>
                          <Text tA="right" style={{ flex: 4 }}>
                            {formatAmountString(
                              item.quantity * item.price,
                              request_currency,
                            )}
                          </Text>
                        </View>
                      ))
                    : null}
                </View>
                {Boolean(tip) && (
                  <React.Fragment>
                    <View fD="row" w="100%" jC="space-between" pt={0.25}>
                      <Text style={{ flex: 5 }} tA="right">
                        Subtotal
                      </Text>
                      <Text style={{ flex: 4 }} tA="right">
                        {subtotalString}
                      </Text>
                    </View>
                    <View fD="row" w="100%" jC="space-between" pt={0.25}>
                      <Text style={{ flex: 5 }} tA="right">
                        Tip
                      </Text>
                      <Text style={{ flex: 4 }} tA="right">
                        {tipString}
                      </Text>
                    </View>
                  </React.Fragment>
                )}
                <View fD="row" w="100%" jC="space-between" pt={0.25}>
                  <Text style={{ flex: 5 }} tA="right" fW="bold">
                    Total
                  </Text>
                  <Text style={{ flex: 4 }} tA="right" fW="bold">
                    {totalString}
                  </Text>
                </View>
                {Boolean(rating) && (
                  <View fD="row" w="100%" jC="space-between" pt={1}>
                    <Text style={{ flex: 5 }} tA="right">
                      Rating
                    </Text>

                    <View f={4} jC="flex-end" fD="row">
                      {ratings.map(item => (
                        <Icon
                          key={item}
                          // style={{ padding: 4 }}
                          size={24}
                          name={'star'}
                          set="MaterialIcons"
                          color={'primary'}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <React.Fragment>
                {Boolean(tip) && (
                  <View w="100%" pb={0.25} pt={1}>
                    <View fD="row" w="100%" jC="space-between" pt={0.25}>
                      <Text style={{ flex: 5 }} tA="right">
                        Tip
                      </Text>
                      <Text style={{ flex: 4 }} tA="right">
                        {tipString}
                      </Text>
                    </View>
                    <View fD="row" w="100%" jC="space-between" pt={0.25}>
                      <Text style={{ flex: 5 }} tA="right" fW="bold">
                        Total
                      </Text>
                      <Text style={{ flex: 4 }} tA="right" fW="bold">
                        {totalString}
                      </Text>
                    </View>
                  </View>
                )}
                {Boolean(rating) && (
                  <View fD="row" w="100%" jC="space-between" pt={1}>
                    <Text style={{ flex: 5 }} tA="right">
                      Rating
                    </Text>

                    <View f={4} jC="flex-end" fD="row">
                      {ratings.map(item => (
                        <Icon
                          key={item}
                          // style={{ padding: 4 }}
                          size={24}
                          name={'star'}
                          set="MaterialIcons"
                          color={'primary'}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </React.Fragment>
            ))} */
}
