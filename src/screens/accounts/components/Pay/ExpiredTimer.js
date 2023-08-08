import React, { useState, useEffect } from 'react';

import moment from 'moment';
import { View, Text } from 'components';

export default function ExpiredTimer(props) {
  const { setExpired, quote, conversionQuote } = props;

  const [temp, setSwitch] = useState(false);
  const {
    status = conversionQuote?.status ?? '',
    expiration_date = conversionQuote?.expires ?? '',
  } = quote ?? {};
  const isPending = status === 'pending' || status === 'quoted';

  const hasExpired = Boolean(expiration_date);
  const expirationMoment = hasExpired && moment(expiration_date).local();

  const expiredDuration =
    hasExpired &&
    moment.duration(expirationMoment.diff(moment())).asMilliseconds();

  const isExpired = (hasExpired && expiredDuration < 0) || status === 'expired';
  const expiredString = hasExpired
    ? isExpired
      ? 'Expired'
      : moment(expiredDuration).format('mm:ss')
    : '';

  useEffect(() => {
    let timer = null;
    if (isPending) {
      timer = setTimeout(() => {
        setSwitch(!temp);
      }, 500);
    }
    if (expiredDuration < 0) {
      setExpired(true);
    }
    return () => clearTimeout(timer);
  }, [temp, isPending, quote, conversionQuote]);

  if (!(quote || conversionQuote) || !isPending) {
    return null;
  }

  return (
    <View pr={1} pt={0.5}>
      <Text tA={'right'} c={isExpired ? 'error' : 'font'} s={22}>
        {expiredString}
      </Text>
      {isExpired && (
        <>
          <Text tA={'right'} s={12}>
            {expirationMoment.format('YYYY/MM/DD')}
          </Text>
          <Text tA={'right'} s={12} lH={10}>
            {expirationMoment.format('HH:mm:ss')}
          </Text>
        </>
      )}
    </View>
  );
}
