import React from 'react';

import { Text, View } from 'components';
import Image from 'components/outputs/Image';
import { formatAmountString, useConversion } from 'utility/rates';
import { calculateInvoiceTotal } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function PoSCheckoutHeader(props) {
  const { context, invoice, items } = props;
  const { business, currency } = context;
  if (!business) return null;
  const { name, icon } = business;

  const request_amount = calculateInvoiceTotal(items, currency.divisibility);

  const {
    context: { services },
  } = useRehiveContext();
  const { convAmount } = useConversion(
    request_amount,
    services,
    currency,
    true,
  );

  const amountString = formatAmountString(request_amount, currency, true);

  return (
    <View>
      <View style={{ alignSelf: 'center' }} bR={21} m={1}>
        <Image src={icon} height={100} width={100} />
      </View>
      <Text s={25} tA="center" fW="500" paragraph c="fontDark">
        {name}
      </Text>
      <Text s={30} c="primary" tA="center" fW="700" paragraph>
        {amountString}
      </Text>
      {!!convAmount && (
        <Text s={13} tA="center">
          {convAmount}
        </Text>
      )}
    </View>
  );
}
