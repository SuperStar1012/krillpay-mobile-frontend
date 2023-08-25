import React, { useState } from 'react';
import { View, ButtonList, Button, Text } from 'components';
import { AntDesign } from '@expo/vector-icons';
import { formatTime } from 'utility/general';
import StateAnimation from 'components/animations/StateAnimation';

export default function RedeemVoucherPost(props) {
  const { config, formikProps, onNext, onBack, result, context } = props;
  const { header: Header, detail: Detail } = config;
  const { user } = context;
  const { setSubmitting, isSubmitting } = formikProps;

  async function handleConfirm() {
    setSubmitting(true);
    await onNext(props);
    setSubmitting(false);
  }

  const isConfirm = !result;
  const state = result?.status === 'Complete' ? 'success' : 'error';
  const dateString = result?.updated
    ? formatTime(result?.updated, 'lll', user)
    : '';
  const [showDetail, setShowDetail] = useState(isConfirm);

  const hasDetail = true;

  let buttons = [
    {
      onPress: isConfirm ? handleConfirm : onBack,
      loading: isSubmitting,
      id: isConfirm ? 'confirm' : 'close',
    },
  ];

  return (
    <View f={1} bC={'background'}>
      <View f={1} scrollView>
        {isConfirm ? null : (
          <>
            <StateAnimation state={state} />
            <Text p={0.5} tA="center" s={23} id={state} fW="500" />
            <Text p={0.5} tA="center" c="fontLight">
              {dateString}
            </Text>
          </>
        )}
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
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}>
            <Button
              disabled={hasDetail}
              onPress={() => setShowDetail(!showDetail)}>
              <View fD="row" jC="space-between">
                <Text fW="700" s={16} id="details" capitalize />
                {!hasDetail && (
                  <AntDesign
                    name={showDetail ? 'caretup' : 'caretdown'}
                    size={18}
                    color="black"
                  />
                )}
              </View>
            </Button>
            {(showDetail || hasDetail) && (
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
