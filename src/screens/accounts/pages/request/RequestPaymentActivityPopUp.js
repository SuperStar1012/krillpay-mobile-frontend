import React from 'react';
import { View, Button } from 'components';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { orderBy } from 'lodash';
import { userLabel, contactMatch } from '../../util/requests';
import PayPage from '../../components/Pay';

export default function RequestPaymentActivityPopUp(props) {
  const {
    user,
    setSelected,
    setState,
    state,
    displayModal,
    requests,
    setDisplayModal,
    sendReminder,
    selected,
    getRequests,
    setResult,
    setRequests,
    requestCurrency,
    send,
  } = props;

  const outgoing = selected?.user?.id === user?.id;

  return (
    <PopUpGeneral
      visible={displayModal}
      onDismiss={() => setDisplayModal(false)}
      showClose
      scrollView
      docked>
      <PayPage
        {...{
          onPending: () => setState('pending'),
          embedded: true,
          data: {
            currentCurrency: requestCurrency,
            currencyCode: requestCurrency?.currency?.code,
            request_id: selected?.id,
            amount: selected?.request_amount,
            subtype: 'receive_email',
          },
          config: {
            hideBack: true,
            hideInvoice: true,
            hideCurrency: outgoing,
          },
          onQuoteAdded: data => {
            let updatedRequest = {
              ...(requests?.find(x => x.id === data?.id) ?? {}),
              payment_processor_quotes: data.payment_processor_quotes,
            };

            setSelected(updatedRequest);

            setRequests(
              orderBy(
                [
                  ...(requests?.filter(x => x.id !== data?.id) ?? []),
                  updatedRequest,
                ],
                'created',
                'desc',
              ),
            );
          },
          onSuccess: (response, request) => {
            setResult({
              status: 'success',
              data: {
                user: response.transactions[0].partner.user,
                amount: response.transactions[0].amount * -1,
                currency: response.transactions[0].currency,
                account: response.transactions[0].account,
                status: 'paid',
              },
              request,
            });

            getRequests({ received: true });
            send('SUCCESS');
            // dispatch(fetchAccounts());
            setDisplayModal(false);
          },
          onError: error => {
            send('FAIL');
            console.log(error);
          },
          currentRequest: selected,
          contactMatch,
          userLabel,
        }}
      />
      {state !== 'pending' && (
        <View mt={outgoing ? 1 : -1}>
          {outgoing && (
            <Button
              id={'remind'}
              wide
              onPress={() => {
                setDisplayModal(false);
                sendReminder(selected);
              }}
            />
          )}
          <Button
            type={'outlined'}
            id={'cancel_request'}
            wide
            onPress={() => {
              setDisplayModal(false);
              setTimeout(() => setState('cancel'), 500);
            }}
          />
        </View>
      )}
    </PopUpGeneral>
  );
}
