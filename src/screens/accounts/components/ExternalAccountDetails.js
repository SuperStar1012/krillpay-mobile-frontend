import React from 'react';
import { View } from 'components/layout/View';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { Icon } from 'components/outputs/Icon';
import Text from 'components/outputs/Text';
import { CustomIcon } from 'components/outputs/CustomIcon';
import {
  concatCryptoAccountNoName,
  concatBankAccount,
  statusToColor,
} from 'utility/general';
import {
  getWyreAccountSubtitle,
  getWyreAccountTitle,
} from 'extensions/wyre/util';
import { useQuery } from 'react-query';
import { getWyrePaymentMethod } from 'utility/rehive';
import { useWyreAccount } from 'extensions/wyre/hooks';
import Images from 'components/images';

export default function ExternalAccountDetails(props) {
  let {
    icon,
    customIcon,
    right,
    iconSize = 40,
    iconPadded = true,
    item,
    currency,
    color,
    bold,
    showCode = true,
    noPadding,
  } = props;

  const isWyreAccount = !!item?.metadata?.service_wyre;

  // TODO: check why status is only applicable to wyre companies
  // Added fix for now to prevent incorrect status appearing in other companies
  const { name, number, address, metadata, status } = item ?? {};

  const title = isWyreAccount ? getWyreAccountTitle(item) : name ? name : '';
  const subtitle = isWyreAccount
    ? getWyreAccountSubtitle(item)
    : address
    ? concatCryptoAccountNoName(item)
    : color
    ? number
    : concatBankAccount(item, false, true);
  const badge = currency?.code;

  const wyreAccount = useWyreAccount();

  const institution_id = metadata?.service_wyre?.institution_id;

  const accountId = wyreAccount?.id;
  const paymentMethodId = metadata?.service_wyre?.payment_method_id;

  const { data: paymentMethod, isLoading: loadingPaymentMethod } = useQuery(
    ['institution', institution_id],
    () =>
      getWyrePaymentMethod({
        accountId: wyreAccount?.id,
        paymentMethodId: metadata?.service_wyre?.payment_method_id,
        filters: { expand: 'institution_metadata' },
      }),
    {
      enabled: !!accountId && !!paymentMethodId && !!institution_id,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );
  const logo = paymentMethod?.institution_metadata?.logo;
  const image = logo
    ? `data:image/png;base64,${logo}`
    : institution_id
    ? 'bank'
    : '';

  if (!title && !subtitle) {
    return null;
  }

  return (
    <View fD={'row'} p={noPadding ? 0 : 0.5} pv={noPadding ? 0 : 1}>
      {badge || image ? (
        <View jC={'center'} style={{ paddingRight: 16 }}>
          {image === 'bank' ? (
            <Images
              width={iconSize - 8}
              height={iconSize - 8}
              name={image}
              containerStyle={{
                borderRadius: 20,
                // paddingLeft: 4,
                padding: image === 'bank' ? 4 : 0,
              }}
              // padded={image === 'bank'}
            />
          ) : (
            <CurrencyBadge
              image={image}
              loading={loadingPaymentMethod}
              text={badge}
              radius={iconSize / 2}
              currency={currency}
            />
          )}
        </View>
      ) : customIcon ? (
        <View jC={'center'} style={{ paddingRight: 16 }}>
          <CustomIcon name={customIcon} size={iconSize} padded={iconPadded} />
        </View>
      ) : icon ? (
        <View
          style={{ marginRight: 16, borderRadius: 100 }}
          h={iconSize}
          w={iconSize}
          bC={'grey2'}
          aI={'center'}
          jC={'center'}>
          <Icon
            name={icon}
            size={24}
            set={
              icon.match(/gift|view-headline|ticket-percent/)
                ? 'MaterialCommunityIcons'
                : 'MaterialIcons'
            }
            color={'primary'}
          />
        </View>
      ) : null}
      <View
        fD={'column'}
        aI={right ? 'flex-end' : 'flex-start'}
        jC={'center'}
        w="100%">
        <View fD={'row'} pb={title ? 0.25 : 0} pr={1} w="100%">
          {title ? (
            <Text
              s={14}
              fW={bold ? '700' : '500'}
              c={color ? color : 'fontDark'}>
              {title}
            </Text>
          ) : null}
          <View style={{ position: 'absolute', right: 56 }}>
            {badge && showCode ? (
              <Text s={14} fW={'500'} c={color ? color : 'primary'}>
                {badge}
              </Text>
            ) : null}
          </View>
        </View>
        <View fD={'row'} pr={1} w="100%">
          {subtitle ? (
            <View mr={title ? 4 : 6}>
              <Text
                s={color ? 14 : 11}
                lH={16}
                fW={'400'}
                c={color ? color : 'font'}>
                {subtitle}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {isWyreAccount && (
            <View style={{ position: 'absolute', right: 56 }}>
              <Text s={14} c={statusToColor(status)} id={status}></Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
