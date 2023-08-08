import React from 'react';
import { StyleSheet } from 'react-native';
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
    handleButtonPress,
    action,
    onConfirm,
    onBack,
    backButtonText = 'back',
    context,
    id,
  } = props;
  const B = props => (
    <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
  );

  const {
    config: { actionsConfig },
  } = useRehiveContext();

  const confirmMessage = get(
    actionsConfig,
    [action, 'config', 'confirmMessage'],
    '',
  );

  return (
    <View>
      <Text
        t="h5"
        tA={'center'}
        p={0.25}
        id={title ? title : 'confirm'}
        style={{ fontWeight: 'bold' }}
      />
      <View p={0.5} pb={0.25} />
      {confirmMessage ? (
        <Text tA={'center'} p={0.25} id={confirmMessage} />
      ) : null}
      {id ? (
        <Text id={id} context={context} tA={'center'} p={0.5} />
      ) : (
        text && (
          <Text tA={'center'} p={0.5}>
            <Text tA={'center'} p={0.5} id={text}></Text>
            <B>{amount}</B>
            {recipient2 ? (
              <React.Fragment>
                {'\n from '}
                <B>{recipient2}</B>
              </React.Fragment>
            ) : null}
            {recipient ? (
              <React.Fragment>
                {' to '}
                <B>{recipient}</B>
              </React.Fragment>
            ) : null}
          </Text>
        )
      )}

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
      <View mv={1}>
        <Button
          id="confirm"
          color={'primary'}
          wide
          disabled={formikProps.isSubmitting || !formikProps.isValid}
          loading={formikProps.isSubmitting}
          onPress={
            onConfirm
              ? onConfirm
              : () => handleButtonPress(formikProps, 'confirm')
          }
        />
      </View>
      <Button
        type="text"
        wide
        id={backButtonText}
        onPress={onBack ? onBack : () => handleButtonPress(formikProps)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    paddingBottom: 8,
    paddingTop: 8,
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'lightgray',
  },
  itemsExtra: {
    paddingBottom: 8,
    paddingTop: 8,
    width: '100%',
  },
});
