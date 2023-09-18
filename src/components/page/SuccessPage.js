import React, { useState, useEffect } from 'react';
import { View } from '../layout/View';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import { formatTime } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';
import { CustomImage } from '../outputs/CustomImage';
import { AntDesign } from '@expo/vector-icons';
import ButtonList from 'components/inputs/ButtonList';

import { Icon } from '../outputs/Icon';
import StateAnimation from 'components/animations/StateAnimation';

export default function SuccessPage(props) {
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
    recipientDetails,
    hasNote,
    isRequesting,
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

  const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: '#000000',
    },
    marginTop: {
      marginTop: 10,
    },
  });

  return (
    <View f={1} bC={bC}>
      <View f={1} scrollView>
        {isRequesting && (
          <TouchableOpacity
            style={{ position: 'absolute', top: 20, left: 20 }} // Adjust the top and left values according to your desired positioning
            onPress={onNext}>
            <View>
              <Icon name={'md-close'} size={30} />
            </View>
          </TouchableOpacity>
        )}

        {isConfirm ? null : (
          <>
            {!isRequesting && <StateAnimation state={image} />}
            {isRequesting && (
              <View mt={4} mb={1}>
                <CustomImage name={'request'} width={120} />
              </View>
            )}
            {!hasNote && !isRequesting && (
              <Text
                pb={0.5}
                tA="center"
                s={23}
                id={title ? title : state}
                fW="500"
              />
            )}
            <Text p={0.5} tA="center" c="fontLight">
              {dateString}
            </Text>
          </>
        )}

        {isRequesting && (
          <View>
            <Text style={[styles.text, styles.marginTop]} s={23} fW={700}>
              Your request for
            </Text>
            <Header {...props} isRequesting={true} isSuccess={true} />
          </View>
        )}

        {hasNote && (
          <View>
            <Text style={[styles.text, styles.marginTop]} s={23} fW={700}>
              You have successfully sent to
            </Text>
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
              <Header {...props} isSuccess={true} />
            </View>
          </View>
        )}
        {!hasNote && !isRequesting && (
          <>
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
          </>
        )}
      </View>

      {!isRequesting && <ButtonList p={1.5} items={buttons} />}
    </View>
  );
}
