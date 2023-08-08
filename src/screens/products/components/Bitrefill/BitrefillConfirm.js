import React from 'react';

import { View, Text, PopUpGeneral, Button } from 'components';

import { displayFormatDivisibility } from 'utility/general';
import ErrorOutput from 'components/outputs/ErrorOutput';
import Image from 'components/outputs/Image';
import { Dimensions } from 'react-native';

const BitrefillConfirm = props => {
  const {
    confirmOrder,
    handleDismiss,
    loading,
    error,
    invoice,
    initiated,
    open,
  } = props;

  const amount = invoice.split('0n1')[0].replace('lnbc', '');

  // if (open) {
  //   return (
  //     <View
  //       style={{
  //         borderRadius: 20,
  //         borderWidth: 1,
  //         borderColor: '#EFEFEF',
  //         backgroundColor: 'white',
  //         zIndex: 200,
  //       }}
  //       mh={0.5}>
  //       <View pb={0.5} p={1}>
  //         <Text>{'You are about to make a purchase from Bitrefill'}</Text>
  //       </View>
  //       <View p={0.5}>
  //         <Output
  //           label={'Amount'}
  //           value={displayFormatDivisibility(amount, 8) + ' XBT'}
  //           horizontal
  //           valueBold
  //           valueColor
  //         />
  //       </View>
  //       <View>
  //         {error ? (
  //           <ErrorOutput align={'left'}>
  //             {'Unable to finish payment: ' + error}
  //           </ErrorOutput>
  //         ) : null}
  //         {initiated ? (
  //           <View p={0.5} w={'100%'}>
  //             <Text c={'positive'} tA={'center'}>
  //               {'Payment initiated'}
  //             </Text>
  //           </View>
  //         ) : (
  //           <CardActions actionOne={buttonOne} actionTwo={buttonTwo} />
  //         )}
  //       </View>
  //     </View>
  //   );
  // }

  const SCREEN_WIDTH = Dimensions.get('window').width;

  return (
    <PopUpGeneral visible={open} onDismiss={() => handleDismiss()}>
      <View aI={'center'}>
        <Image
          source={require('../../../../../assets/icons/bitrefill_icon.png')}
          resizeMode="contain"
          style={{
            maxWidth: SCREEN_WIDTH / 4,
            height: SCREEN_WIDTH / 4,
            borderRadius: 100,
          }}
        />
        <View mv={1}>
          <Text tA={'center'} fW={'700'} s={23}>
            Bitrefill purchase
          </Text>
        </View>
        <View mb={1}>
          <Text tA={'center'}>
            You are about to make a purchase from{' '}
            <Text fW={'700'}>Bitrefill</Text> for{' '}
          </Text>
        </View>
        <View mb={1.5}>
          <Text tA={'center'} fW={'700'} s={23} c={'primary'}>
            {displayFormatDivisibility(amount, 8) + ' XBT'}
          </Text>
        </View>
        {error ? (
          <View mb={1}>
            <ErrorOutput align={'left'}>
              {'Unable to finish payment: ' + error}
            </ErrorOutput>
          </View>
        ) : null}
        <Button
          wide
          label={'CONFIRM'}
          onPress={() => confirmOrder()}
          loading={loading || initiated}
        />
        <Button
          type={'text'}
          label={'Cancel'}
          onPress={() => handleDismiss()}
        />
      </View>
    </PopUpGeneral>
  );

  return null;
};

export default BitrefillConfirm;
