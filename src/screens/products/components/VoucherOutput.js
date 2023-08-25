import React, { useEffect } from 'react';
import { TouchableHighlight, Dimensions } from 'react-native';
import { View, Text } from 'components';
import { formatAmountString } from 'utility/rates';
import QRCode from 'components/outputs/QRCode';
import { useToast } from 'contexts/ToastContext';
import Images from './images';
import { getVoucher } from 'utility/rehive';
import { useQuery } from 'react-query';
import { CustomImage } from 'components/outputs/CustomImage';
import Info from 'components/layout/Info';
import * as Clipboard from 'expo-clipboard';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function VoucherOutput(props) {
  const { item, hideModal, refresh } = props;

  const { id, code, product, item: temp, order } = item;
  const { currency, seller } = order ?? {};

  const { virtual_format, name, price } = temp ? temp : product;
  const { showToast } = useToast();

  const _copyQR = code => {
    hideModal && hideModal();
    Clipboard.setString(code);
    showToast({
      text: code + ' copied.',

      duration: 3000,
    });
  };
  const query = useQuery(['voucher', id], () => getVoucher(id), {
    enabled: !!id,
    refetchInterval: 2000,
  });
  const isRedeemed = query?.data?.status === 'redeemed';

  useEffect(() => {
    typeof refresh === 'function' && isRedeemed && refresh();
  }, [isRedeemed]);

  return (
    <View>
      <View w={'100%'} jC={'center'} aI={'center'}>
        <Images size={100} name="voucher" />
        <View mv={0.5} w={'100%'}>
          <Text s={25} fW={'bold'} tA={'center'}>
            {name}
          </Text>
          {!!seller && (
            <Text s={14} tA={'center'}>
              Fulfilled by: {seller?.name ?? seller?.id}
            </Text>
          )}
        </View>
        <Text s={30} fW={'bold'} c={'primary'}>
          {formatAmountString(price, currency, true)}
        </Text>
        {isRedeemed ? (
          <View pt={1.5} w="100%">
            <CustomImage name={'success'} width={SCREEN_WIDTH / 2} />
            <View pt={1.5}>
              <Info tA="center" variant="success">
                Voucher redeemed!
              </Info>
            </View>
          </View>
        ) : (
          <>
            {/* {virtual_format !== 'raw' && ( */}
            <View mt={0.5} w={'100%'}>
              <QRCode
                encUrl={encodeURIComponent(code)}
                width={SCREEN_WIDTH / 2}
              />
            </View>
            {/* )} */}
            <TouchableHighlight
              underlayColor={'white'}
              activeOpacity={0.2}
              onPress={() => _copyQR(code)}>
              <View mt={0.5} mb={1}>
                <Text c={'primary'} s={25} fW={'bold'} tA={'center'}>
                  {code}
                </Text>
              </View>
            </TouchableHighlight>
          </>
        )}
      </View>
    </View>
  );
}
