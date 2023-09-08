import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { formatAmountString, renderRate } from '../util/rates';
import { View, Spinner, Text, Button } from 'components';
import TransactionListCryptoDetails from './TransactionListCryptoDetails';
import {
  getCampaign,
  fetchRehiveTransactions,
  getOtherUserProfile,
} from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import CampaignCard from '../../rewards/components/CampaignCard';
import { formatTime } from 'utility/general';
import { Icon } from 'components/outputs/Icon';

import SendRecipient from '../components/SendRecipient';
import { useToast } from 'contexts/ToastContext';
import QuickActionConfig from '../config/quickActions';
import { TextInput, Pressable } from 'react-native';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { useSubtypeCopy } from '../util/transactions';
import TransactionListDetail from './TransactionListDetail';

const config = {
  send: {
    recipientLabel: 'Recipient',
    amountLabel: 'Amount sent',
    feeLabel: 'Service fee',
    totalLabel: 'Total transaction amount',
  },
  receive: {
    recipientLabel: 'Sender',
    amountLabel: 'Amount received',
    feeLabel: 'Service fee',
    totalLabel: 'Total transaction amount',
  },
  withdraw: {
    recipientLabel: 'Account',
    amountLabel: 'Withdrawal amount',
    feeLabel: 'Withdrawal fee',
    totalLabel: 'Total transaction amount',
  },
  buy: {
    recipientLabel: 'Account',
    amountLabel: 'Bought',
    feeLabel: 'Buy fee',
    totalLabel: 'Total buy amount',
  },
  sell: {
    recipientLabel: 'Account',
    amountLabel: 'Sold',
    feeLabel: 'Sell fee',
    totalLabel: 'Total sell amount',
  },
  default: {
    recipientLabel: 'Recipient',
    amountLabel: 'Amount',
    feeLabel: 'Service fee',
    totalLabel: 'Total amount',
  },
};

const formattedDate = timestamp => {
  const date = new Date(timestamp);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate; // Output: Apr 12, 2023
};

export default function ReceiptInfoPage(props) {
  const {
    user,
    navigation,
    close,
    onDismiss,
    profile,
    getTransactions,
    nav,
    c,
    rates,
    crypto,
    setItem,
    closeAll,
  } = props;

  let tempConvRate = 0;

  const [modal, setModal] = useState(false);

  const { identifier } = user;

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetchRehiveTransactions(identifier);
        setTransactions(res);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    setIsLoading(true);
    fetchTransactions();
  }, [identifier]);

  return (
    <React.Fragment>
      {user && (
        <>
          <View mt={2} mb={1}>
            <SendRecipient user={user} />
          </View>
          {/* <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text p={0.5} s={18} fW={'700'}>
                Location
              </Text>
              <Text>
                {user.identifier[1] == '1' ? 'United States' : 'Nigeria'}
                {/*TO DO: Refactor when can fetch member details
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text p={0.5} s={18} fW={'700'}>
                Member Since
              </Text>
              <Text>Member Since</Text>
            </View>
          </View> */}

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            ph={1}
            mt={0.5}
            mb={0.5}>
            <Button
              label={' Send '}
              onPress={() => {
                // close();

                navigation.navigate('Send', {
                  currency: c,
                  recipient: user?.identifier || '',
                });
                setModal(false);
                closeAll();
              }}
            />
            <Button
              label={' Request '}
              onPress={() => {
                // close();

                navigation.navigate('Request', {
                  currency: c,
                  recipient: user?.identifier || '',
                });
                setModal(false);
                closeAll();
              }}
            />
          </View>
          <View mt={1} mb={1.5}>
            <Text s={18} fW={'700'}>
              Transaction History
            </Text>
          </View>
          {isLoading ? (
            <Spinner />
          ) : (
            transactions?.data?.map((x, i) => (
              <Pressable
                key={i}
                underlayColor="lightgrey"
                onPress={() => {
                  setItem(x);
                  close();
                }}>
                <View
                  mb={1}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 15,
                    borderBottomWidth: 1,
                    marginTop: -5,
                    borderColor: '#E0E0E0',
                    borderBottomStyle: 'solid',
                  }}>
                  <View f={1} aI={'flex-start'}>
                    <Icon
                      name={
                        x.subtype == 'send_mobile'
                          ? 'arrow-right-circle'
                          : 'arrow-left-circle'
                      }
                      size={28}
                      set={'MaterialCommunityIcons'}
                      color={'font'}
                    />
                  </View>
                  <View f={2}>
                    <Text tA={'left'} s={16.5}>
                      {x.subtype == 'send_mobile'
                        ? 'Sent'
                        : x.subtype === 'receive_mobile'
                        ? 'Received'
                        : 'Requested'}
                    </Text>
                  </View>
                  <View f={2}>
                    <Text tA={'left'} s={16.5}>
                      {x.created ? formattedDate(x.created) : ''}
                    </Text>
                  </View>
                  <View f={2}>
                    <Text tA={'right'} s={16.5}>
                      {x.amount
                        ? formatAmountString(x.amount, x.currency, true)
                        : ''}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </>
      )}
    </React.Fragment>
  );
}
