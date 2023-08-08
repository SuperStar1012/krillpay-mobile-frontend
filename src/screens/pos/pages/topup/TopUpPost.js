import React from 'react';
import { View, ButtonList, Text } from 'components';
import { formatTime } from 'utility/general';
import StateAnimation from 'components/animations/StateAnimation';

export default function TopUpPost(props) {
  const { config, onBack, result, context } = props;
  const { header: Header } = config;
  const { user } = context;

  const state =
    result?.status === 'Complete' || result?.status === 'Pending'
      ? 'success'
      : 'error';
  const dateString = result?.updated
    ? formatTime(result?.updated, 'lll', user)
    : '';

  let buttons = [
    {
      onPress: onBack,
      id: 'close',
    },
  ];

  return (
    <View f={1} bC={'background'}>
      <View f={1} scrollView>
        <>
          <StateAnimation state={state} />
          <Text p={0.5} tA="center" s={23} id={state} fW="500" />
          <Text p={0.5} tA="center" c="fontLight">
            {dateString}
          </Text>
        </>

        <View
          mh={1.5}
          mt={1}
          p={1.5}
          bC={state}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Header {...props} />
        </View>
      </View>
      <ButtonList p={1.5} items={buttons} />
    </View>
  );
}
