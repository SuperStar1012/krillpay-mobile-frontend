import React from 'react';
import { Text, View } from 'components';
import { concatName } from 'utility/general';
import { formatAmountString } from 'utility/rates';
import Recipient from 'screens/accounts/components/Recipient';

export default function TopUpHeader(props) {
  const { result } = props;
  const { amount, currency, partner } = result;

  const amountString = formatAmountString(amount, currency, true);
  const recipientString = concatName(partner?.user);

  return (
    <>
      <Text
        c="white"
        fW="700"
        s={16}
        id={result ? 'topped_up' : 'top_up'}
        capitalize
      />

      <Text c="white" fW="700" s={34}>
        {amountString}
      </Text>

      <View pt={1}>
        <Text fW="bold" c="white" id="to" capitalize />
        <View fD="row" aI="center" pt={0.5} mr={3.5}>
          <Recipient
            label={
              recipientString ? recipientString : partner?.user?.identifier
            }
            value={recipientString ? partner?.user?.identifier : ''}
            image={partner?.user?.profile}
          />
          {/* <Text c="white" fW="500" s={34}>
            {recipientString ? recipientString : partner?.user?.identifier}
          </Text> */}
        </View>
      </View>
    </>
  );
}
