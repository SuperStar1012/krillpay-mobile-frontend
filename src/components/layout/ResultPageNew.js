import React, { useState, useEffect } from 'react';
import { View } from './View';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import { formatTime } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';
import { AntDesign } from '@expo/vector-icons';
import {
  useConversion,
  formatAmountString,
  convertAmount,
} from 'utility/rates';
import ButtonList from 'components/inputs/ButtonList';
import { useSelector } from 'react-redux';
import { conversionRatesSelector } from 'screens/accounts/redux/reducer';
import moment from 'moment';
import StateAnimation from 'components/animations/StateAnimation';

export default function ResultPage(props) {
  let {
    result = {},
    amount,
    display,
    header,
    standAloneHeader,
    detail,
    title,
    wallet,
    currency = wallet?.currency,
    navigation,
    onNext,
    primaryAction,
    secondaryAction,
    state = '',
    bC = 'background',
    variant,
    submitting,
    form,
    date,
    closeBtnTitle,
  } = props;

  if (amount === null && form) {
    ({ amount } = form.getValues());
  }
  if (!state) state = result?.status;

  const isConfirm = state === 'confirm';
  const isNew = variant === 'new';

  const rates = useSelector(conversionRatesSelector);

  date = date || (result?.data?.updated ?? result?.data?.created);
  const {
    context: { user, services },
  } = useRehiveContext();
  let dateString;
  try {
    dateString = date ? formatTime(date, user) : '';
  } catch (error) {
    dateString = date ? moment().format('h.mm A, D MMMM YYYY') : '';
  }
  const [showDetail, setShowDetail] = useState(isConfirm);
  useEffect(() => {
    setShowDetail(isConfirm);
  }, [isConfirm]);

  amount = display
    ? convertAmount({
        currency: { currency },
        values: { display, amount },
        rates,
      })
    : amount;

  const amountString = formatAmountString(amount, currency, !isNew);

  const { convAmount } = useConversion(amount, services, currency, !isNew);

  const buttons = [
    {
      onPress:
        typeof onNext === 'function'
          ? onNext
          : navigation
          ? () => navigation.goBack()
          : () => {},
      loading: submitting,
      id: isConfirm ? 'confirm' : closeBtnTitle || 'close',
      ...primaryAction,
    },
    {
      type: 'text',
      ...secondaryAction,
    },
  ];

  return (
    <View screen={bC === 'background'} scrollView bC={bC}>
      {!isConfirm && (
        <>
          <StateAnimation state={state} />
          <Text p={0.5} tA="center" s={23} id={state} fW="500" />
          <Text tA="center" c="fontLight" style={{ paddingBottom: 0.5 }}>
            {dateString}
          </Text>
        </>
      )}
      {standAloneHeader ? (
        <View mt={1.5}>{header}</View>
      ) : (
        <View
          mt={1.5}
          mh={1.5}
          p={1.5}
          bC={isConfirm ? 'primary' : state}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            ...(!detail
              ? { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
              : {}),
          }}>
          <Text
            c="white"
            fW="700"
            s={16}
            id={title}
            options={{ capitalize: true }}
          />
          <Text c="white" fW="700" s={34}>
            {amountString}
          </Text>
          {Boolean(convAmount) && (
            <Text c="white" s={14}>
              {convAmount}
            </Text>
          )}
          {header}
        </View>
      )}
      {!!detail && (
        <View
          mh={standAloneHeader ? 0 : 1.5}
          p={1.5}
          bC="white"
          style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <Button onPress={() => setShowDetail(!showDetail)}>
            <View fD="row" jC="space-between">
              <Text fW="700" s={16} id="details" capitalize />
              <AntDesign
                name={showDetail ? 'caretup' : 'caretdown'}
                size={18}
                color="black"
              />
            </View>
          </Button>
          {showDetail && <View mt={1}>{detail}</View>}
        </View>
      )}
      <ButtonList mh={standAloneHeader ? 0 : 1.5} mv={1.5} items={buttons} />
    </View>
  );
}
