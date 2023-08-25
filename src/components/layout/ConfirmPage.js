import React from 'react';
import { StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { get } from 'lodash';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import OutputList from '../outputs/OutputList';
import { View } from './View';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function ConfirmPage(props) {
  const {
    title,
    text,
    amount,
    recipient,
    recipient2,
    formikProps,
    children,
    items,
    itemsExtra,
    itemsExtra2,
    disabled,
    href,
    handleButtonPress,
    action,
    onConfirm,
    content,
    textComp: TextComp = null,
    onBack,
    backButtonText = 'BACK',
    isValid,
  } = props;

  const {
    config: { actionsConfig },
  } = useRehiveContext();
  const confirmMessage = get(
    actionsConfig,
    [action, 'config', 'confirmMessage'],
    '',
  );

  async function handleConfirm() {
    if (href) {
      await WebBrowser.openBrowserAsync(href);
    }
    if (onConfirm) {
      onConfirm();
    } else {
      handleButtonPress(formikProps, 'confirm');
    }
  }

  return (
    <View scrollView>
      <View pb={1}>
        <View pb={0.5}>
          <Text fW="500" t="h2" s={18} tA={'center'}>
            {title ? title : 'CONFIRM'}
          </Text>
        </View>
        {confirmMessage ? (
          <View pb={0.5}>
            <Text tA={'center'}>{confirmMessage}</Text>
          </View>
        ) : null}
        {TextComp}
        {text && (
          <Text style={{ wordBreak: 'break-word' }} tA={'center'}>
            <Text tA={'center'}>
              {text}
              <Text
                tA={'center'}
                fW={'bold'}
                c={'primary'}
                style={{ wordBreak: 'break-word' }}>
                {amount}
              </Text>
              {recipient2 ? (
                <React.Fragment>
                  {'\n from '}
                  <Text
                    tA={'center'}
                    fW={'bold'}
                    c={'primary'}
                    style={{ wordBreak: 'break-word' }}>
                    {recipient2}
                  </Text>
                </React.Fragment>
              ) : null}
              {recipient ? (
                <React.Fragment>
                  {' to '}
                  <Text fW={'bold'} c={'primary'}>
                    {recipient}
                  </Text>
                </React.Fragment>
              ) : null}
            </Text>
          </Text>
        )}
      </View>
      {content}

      {items && (
        <View style={styles.items}>
          <OutputList items={items} />
        </View>
      )}
      {itemsExtra && (
        <View style={styles.itemsExtra}>
          <OutputList items={itemsExtra} />
        </View>
      )}
      {itemsExtra2 && (
        <View style={styles.itemsExtra}>
          <OutputList items={itemsExtra2} />
        </View>
      )}
      {children}
      <View pt={1}>
        <Button
          label="CONFIRM"
          color={'primary'}
          wide
          disabled={
            (formikProps.isSubmitting || !formikProps.isValid || disabled) &&
            !isValid
          }
          loading={formikProps.isSubmitting}
          onPress={handleConfirm}
        />
        <Button
          type="text"
          wide
          label={backButtonText}
          onPress={onBack ? onBack : () => handleButtonPress(formikProps)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    paddingVertical: 4,
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'lightgray',
  },
  itemsExtra: {
    paddingVertical: 8,
    width: '100%',
  },
});
