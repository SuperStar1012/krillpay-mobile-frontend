import React from 'react';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import ButtonList from 'components/inputs/ButtonList';
import StateAnimation from 'components/animations/StateAnimation';
import { useNavigation } from '@react-navigation/native';

export default function ErrorPage(props) {
  let {
    onNext,
    primaryAction,
    secondaryAction,
    state = 'error',
    bC = 'background',
    submitting,

    result = {},
  } = props;
  const navigation = useNavigation();

  const isConfirm = state === 'confirm';

  let buttons = [
    {
      onPress:
        typeof onNext === 'function'
          ? onNext
          : () => {
              navigation?.goBack();
              navigation?.goBack();
            },
      loading: submitting,
      label: (isConfirm ? 'CONFIRM' : 'CLOSE').toUpperCase(),
      ...primaryAction,
    },
  ];
  if (secondaryAction)
    buttons.push({
      type: 'text',
      ...secondaryAction,
    });

  return (
    <View f={1} bC={bC}>
      <View f={1} scrollView>
        {isConfirm ? null : (
          <>
            <StateAnimation state={state} />
            <Text p={0.5} tA="center" s={23} id={'failed'} fW="500" />
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
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Text
            tA="center"
            c="white"
            id={result?.message ?? 'unable_to_complete_transaction'}></Text>
        </View>
      </View>
      <ButtonList p={1.5} items={buttons} />
    </View>
  );
}
