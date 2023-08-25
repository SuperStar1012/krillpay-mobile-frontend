import React from 'react';
import { View } from './View';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import OutputList from 'components/outputs/OutputList';
import StateAnimation from 'components/animations/StateAnimation';

const ResultPage = props => {
  let {
    result = {},
    text,
    handleButtonPress,
    recipientDirection = 'to',
    amount,
    recipient,
    formikProps,
    onSuccess,
    onReset,
    textComp,
    message,
    buttonText = 'DONE',
    secondaryAction,
    items = [],
    scrollView = true,
    id,
    context,
  } = props;

  let title = 'failed';
  let icon = 'emoticon-sad';
  let error = '';
  let color = 'negative';
  let onPress = onReset ? onReset : () => handleButtonPress(formikProps);
  const isSuccess = !!(
    result.id ||
    result.status === 'success' ||
    result.status === 'succeeded'
  );
  if (result && result.status !== 'failed' && isSuccess) {
    title = 'success';
    // subtitle = text + ' successful!';
    icon = 'emoticon-happy';
    // success = false;
    color = 'positive';
    buttonText = buttonText ? buttonText : 'view_transaction';
    onPress = onSuccess
      ? onSuccess
      : () => handleButtonPress(formikProps, 'success');
  } else {
    error =
      result?.message && result?.message.includes('< in JSON')
        ? ''
        : result?.message;
  }

  return (
    <View p={1} pt={2} scrollView={scrollView}>
      <Text fW="500" t="h5" s={26} tA={'center'} id={title}></Text>
      <View style={{ paddingTop: 32 }}>
        {id ? (
          <Text id={id} context={context} tA={'center'} p={0.5} />
        ) : textComp ? (
          textComp
        ) : (
          <Text tA={'center'}>
            <Text tA={'center'} id={text} />
            {amount && (
              <Text fW={'bold'} c={'primary'}>
                {amount}
              </Text>
            )}
            {recipient && ` ${recipientDirection} `}
            {recipient && (
              <Text fW={'bold'} c={'primary'}>
                {recipient}
              </Text>
            )}
          </Text>
        )}
      </View>
      <View pb={2} pt={2.5}>
        {/* <LottieImage
          size={300}
          name={title == 'Success' ? 'success' : 'error'}
        /> */}
        <StateAnimation state={title} />
      </View>

      {error ? <Text tA={'center'} c={'error'} id={error} /> : null}
      {message && ((result.status && isSuccess) || result.account) ? (
        <Text tA={'center'}>{message}</Text>
      ) : null}

      {items?.length > 0 && (
        <View
          style={{
            paddingBottom: 8,
            paddingTop: 8,
            width: '100%',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: 'lightgray',
          }}>
          <OutputList items={items} />
        </View>
      )}
      <View mt={1}>
        <Button
          color={'primary'}
          wide
          id={buttonText}
          onPress={() => onPress()}
        />
        {secondaryAction && <View mt={1}>{secondaryAction()}</View>}
      </View>
    </View>
  );
};

export default ResultPage;
