import React, { useState, useEffect } from 'react';
import { View } from '../layout/View';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import { CustomImage } from '../outputs/CustomImage';
// import LottieImage from '../outputs/LottieImage';
import { formatTime } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';
import { AntDesign } from '@expo/vector-icons';
import ButtonList from 'components/inputs/ButtonList';
import { Spinner } from 'components/outputs/Spinner';

export default function ConfirmPage(props) {
  let {
    header: Header,
    detail: Detail,
    onNext,
    primaryAction,
    secondaryAction,
    state = '',
    bC = 'background',
    submitting,
    hasResultConfig,
    result,
    form,
    context,
  } = props;

  const isConfirm = state === 'confirm';
  const date =
    result?.data?.updated ??
    result?.data?.created ??
    result?.updated ??
    result?.created ??
    '';
  const {
    context: { user },
  } = useRehiveContext();
  const dateString = date ? formatTime(date, 'lll', user) : '';
  const [showDetail, setShowDetail] = useState(isConfirm);
  useEffect(() => {
    setShowDetail(isConfirm);
  }, [isConfirm]);

  let buttons = [
    {
      onPress: onNext,
      loading: submitting,
      id: isConfirm ? 'confirm' : 'close',
      ...primaryAction,
    },
  ];
  if (secondaryAction)
    buttons.push({
      type: 'text',
      ...secondaryAction,
    });

  const hasDetail = Boolean(Detail && result?.data?.status !== 'paid');

  const { wallet } = context;
  const { currency } = wallet;

  const values = form.getValues();
  const { conversionQuote, fromWallet, toWallet } = values;
  const { currency: convCurrency } = fromWallet ?? toWallet ?? {};

  const hasConversion = convCurrency && currency?.code !== convCurrency?.code;
  const isLoading = hasConversion && !conversionQuote;
  if (isLoading) return <Spinner />;

  return (
    <View f={1} bC={bC}>
      <View f={1} scrollView>
        <View
          mh={1.5}
          mt={1}
          p={1.5}
          bC={isConfirm ? 'primary' : state}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            ...(!hasDetail
              ? { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
              : {}),
          }}>
          <Header {...props} />
        </View>
        {hasDetail ? (
          <View
            mh={1.5}
            p={1.5}
            bC="white"
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <Button
              disabled={hasResultConfig}
              onPress={() => setShowDetail(!showDetail)}>
              <View fD="row" jC="space-between">
                <Text fW="700" s={16} id="details" capitalize />
                {!hasResultConfig && (
                  <AntDesign
                    name={showDetail ? 'caretup' : 'caretdown'}
                    size={18}
                    color="black"
                  />
                )}
              </View>
            </Button>
            {(showDetail || hasResultConfig) && (
              <View mt={1}>
                <Detail {...props} />
              </View>
            )}
          </View>
        ) : null}
      </View>
      <ButtonList p={1.5} items={buttons} />
    </View>
  );
}
