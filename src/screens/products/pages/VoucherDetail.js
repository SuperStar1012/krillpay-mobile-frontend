import React, { useState, useCallback } from 'react';
import { View, Text, PopUpGeneral, Button } from 'components';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'components/outputs/Icon';
import { formatAmountString } from 'utility/rates';
import { updateVoucher } from 'utility/rehive';
import { formatTime } from 'utility/general';
import ProductCardHeader from '../components/ProductCardHeader';
import VoucherOutput from '../components/VoucherOutput';
import { useToast } from 'contexts/ToastContext';
import { useIsRTL } from 'hooks/general';

export default function VoucherDetail(props) {
  const { route, navigation } = props;
  const { item } = route?.params ?? {};
  const { showToast } = useToast();
  const isRTL = useIsRTL();

  if (!item) return null;

  const { product, order, code } = item;
  const { currency } = order;
  let voucher = product ?? item.item;

  const [redeeming, setRedeeming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!voucher) return null;

  voucher = { ...voucher, value: item.item.price };

  const { name } = voucher;

  const redeemReward = useCallback(async () => {
    setLoading(true);
    const resp = await updateVoucher(item.id, 'redeemed');
    if (resp.status === 'success') {
      if (voucher && voucher.virtual_type === 'external') {
        showToast({ text: 'Voucher successfully marked as redeemed' });
      } else {
        showToast({ text: 'Voucher successfully redeemed' });
      }
      setRedeeming(false);
      navigation.goBack();
    } else {
      setRedeeming(false);
      showToast({ text: 'Unable to redeem voucher' });
    }
    setLoading(false);
  }, []);

  const status =
    item.status === 'pending' || item.status === 'purchased'
      ? 'Available'
      : item.status === 'redeemed'
      ? 'Redeemed'
      : '';

  const isRedeemed = item.status === 'redeemed';
  const dateString =
    (isRedeemed ? 'Redeemed' : 'Purchased') +
    ' on ' +
    formatTime(
      isRedeemed ? item?.updated : item?.order?.placed,
      'HH:mm - MMM DD, yyyy',
    );

  const actionOne = {
    label: isRedeemed
      ? ''
      : voucher.virtual_type === 'external'
      ? 'MARK AS REDEEMED'
      : voucher.virtual_redemption === 'user'
      ? 'REEDEM'
      : '',
    onPress: () => setRedeeming(true),
    loading: loading && !redeeming,
    color: 'primary',
  };

  const redeemingMessage =
    voucher && voucher.virtual_type === 'external'
      ? 'Are you sure you want to mark this external voucher as redeemed? This does not redeem the voucher, but helps you track your redeemed vouchers.'
      : 'Are  you sure you want to redeem this voucher?';

  const priceString = formatAmountString(
    item.item.price,
    currency,
    true,
  ).toString();

  return (
    <React.Fragment>
      <View w="100%" screen scrollView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 'auto',
            maxWidth: 72,
            alignItems: 'flex-start',
            paddingLeft: 16,
          }}>
          <Icon
            set={'MaterialIcons'}
            // style={{ width: 'a' }}
            name={isRTL ? 'chevron-right' : 'chevron-left'}
            size={30}
            color={'primary'}
          />
        </TouchableOpacity>

        <View fD="row" p={1}>
          <ProductCardHeader width={95} items={[]} />
          <View
            style={{ zIndex: 10 }}
            pv={0.5}
            fD="column"
            pl={1}
            f={1}
            jC="space-between">
            <Text>{name}</Text>

            <Text c="primary" fW="600" s={18}>
              {priceString}
            </Text>
            <Text s={12} c={isRedeemed ? 'positive' : 'font'}>
              {dateString}
            </Text>
          </View>
        </View>

        <View mb={1}>
          <VoucherOutput item={item} />
        </View>

        <View ph={1.5} p={0.5}>
          {Boolean(actionOne?.label) && <Button {...actionOne} wide />}
        </View>
      </View>
      {redeeming ? (
        <PopUpGeneral
          visible={redeeming}
          onDismiss={() => setRedeeming(false)}
          buttonActions={[
            {
              text: 'Cancel',
              type: 'text',
              onPress: () => setRedeeming(false),
            },
            {
              text: 'CONFIRM',
              loading: loading && redeeming,
              disabled: loading && redeeming,
              onPress: () => redeemReward(),
            },
          ]}
          // modalActionOne={modalActionOne}
          // modalActionTwo={modalActionTwo}
        >
          <View aI={'center'}>
            <Text tA={'center'}>{redeemingMessage}</Text>
          </View>
        </PopUpGeneral>
      ) : null}
    </React.Fragment>
  );
}
