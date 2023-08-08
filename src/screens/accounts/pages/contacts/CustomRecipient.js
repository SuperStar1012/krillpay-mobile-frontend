import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Pressable } from 'react-native';
import { View, Text, Spinner } from 'components';
import EmailIcon from './Placeholders/email.svg';
import MobileIcon from './Placeholders/mobile.svg';
import PageContent from 'components/layout/PageContent';
import { CustomIcon } from 'components/outputs/CustomIcon';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { hasStellarTrustline } from 'utility/stellar';
import Info from 'components/layout/Info';

function useStellarTrustline(props) {
  let { context, form, type } = props;
  const { crypto, wallet } = context;
  const { currency } = wallet;
  const isStellar = type === 'crypto' && wallet?.crypto.match(/XLM/);
  const isTestnet = wallet?.crypto?.[0] === 'T' ? true : false;

  let accountText = form?.watch('recipient');
  if (!accountText) accountText = form?.watch('searchTerm');
  const [loading, setLoading] = useState(true);
  const [hasTrustline, setHasTrustline] = useState(true);

  useEffect(() => {
    async function testTrustline(address) {
      let resp = await hasStellarTrustline(
        accountText,
        currency?.code,
        address,
        isTestnet,
      );
      setHasTrustline(resp);
      setLoading(false);
    }
    if (isStellar && crypto && !currency.code.match(/XLM/)) {
      setLoading(true);
      setHasTrustline(false);
      const assetDetails =
        crypto?.[wallet?.crypto]?.assetsDetails?.find(
          asset => asset.currency_code === currency.code,
        ) ?? {};
      testTrustline(assetDetails?.address);
    } else {
      setLoading(false);
    }
  }, []); //isStellar, accountText, currency?.code, crypto
  return { hasTrustline, loading };
}

export default function CustomRecipient(props) {
  const { viewStyleImage } = styles;

  const {
    value,
    label = 'Send to',
    onSelect,
    wallet,
    type,
    image,
    width = 37,
    rightSlot,
  } = props;
  const { hasTrustline, loading } = useStellarTrustline(props);
  if (!type) return null;
  let height = width;

  return (
    <Pressable
      disabled={loading || typeof onSelect !== 'function' || !hasTrustline}
      onPress={() =>
        typeof onSelect === 'function' && onSelect({ contact: value, type })
      }>
      <View>
        <PageContent fD={'row'} jC={'space-between'} aI={'center'}>
          <View style={[viewStyleImage]}>
            {image ? (
              <Image
                style={{ height, width, borderRadius: width }}
                source={{
                  uri: image,
                }}
                resizeMode={'contain'}
              />
            ) : type === 'email' ? (
              <EmailIcon height={height} width={width} />
            ) : type === 'crypto' ? (
              <View>
                <CurrencyBadge text={wallet?.currency?.code} size={width} />
              </View>
            ) : type === 'account' ? (
              <View>
                <CustomIcon name={'default'} size={width} />
              </View>
            ) : (
              <MobileIcon height={height} width={width} />
            )}
          </View>
          <View jC={'center'} f={1} mr={1}>
            {Boolean(label) && (
              <View fD="row">
                <Text s={14} numberOfLines={1} id={label} />
                {loading && !hasTrustline && (
                  <Spinner
                    style={{ padding: 0, maxHeight: 12, marginLeft: 8 }}
                    size="small"
                  />
                )}
              </View>
            )}
            {Boolean(value) && <Text c="primary">{value}</Text>}
          </View>
          {rightSlot && rightSlot()}
        </PageContent>
        {!hasTrustline && !loading && (
          <Info variant="warning">
            A Stellar trustline is required for this asset.
          </Info>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  viewStyleImage: {
    marginRight: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
