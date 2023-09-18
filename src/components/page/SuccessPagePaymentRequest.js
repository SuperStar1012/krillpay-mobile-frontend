import React, { useState, useEffect } from 'react';
import { View } from '../layout/View';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import { formatTime } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';
import { AntDesign } from '@expo/vector-icons';
import ButtonList from 'components/inputs/ButtonList';
import StateAnimation from 'components/animations/StateAnimation';

export default function SuccessPagePaymentRequest(props) {
  let {
    header: Header,
    detail: Detail,
    onNext,
    primaryAction,
    secondaryAction,
    state = 'success',
    bC = 'background',
    submitting,
    hasResultConfig,
    result,
    noButtons,
    title,
  } = props;

  const isSuccess = state === 'success';
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

  let buttons = noButtons
    ? []
    : [
        {
          onPress: onNext,
          loading: submitting,
          id: 'close',
          ...primaryAction,
        },
      ];
  if (secondaryAction)
    buttons.push({
      type: 'text',
      ...secondaryAction,
    });

  const hasDetail = Boolean(Detail && result?.data?.status !== 'paid');
  const image = isSuccess ? 'success' : 'error';

  return (
    <View f={1} bC={bC}>
      <View f={1} scrollView>
        {isConfirm ? null : (
          <>
            <StateAnimation state={image} />

            <Text
              pb={0.5}
              tA="center"
              s={23}
              id={title ? title : state}
              fW="500"
            />
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
