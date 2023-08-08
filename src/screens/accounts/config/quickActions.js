import { remind, cancel } from '../common/paymentRequests';
import { Share, Platform } from 'react-native';

export default function TransactionQuickActionConfig({
  request = {},
  navigation,
  closeModal,
  currency,
  user,
  loading,
  setLoading,
  setLoadingSecondaryAction,
  getTransactions,
  showToast,
  wallet = currency,
}) {
  return {
    request: {
      actions: {
        neutral_debit: [
          {
            label: 'pay',
            id: `request_pay_${request?.id}`,
            get onPress() {
              return () => {
                setLoading && setLoading(this?.id);
                navigation?.navigate('Request', {
                  currency: wallet,
                  request: request?.id,
                });
                closeModal();
              };  
            },
          },
        ],
        neutral_credit: [
          {
            label: 'remind',
            id: `request_remind_${request?.id}`,
            get onPress() {
              return async () => {
                setLoading && setLoading(this?.id);
                await remind({ request, showToast });
                closeModal();
              };
            },
          },
        ],
        both: [
          {
            label: 'copy_link',
            onPress: () => {
              Share?.share({
                ...Platform?.select({
                  ios: {
                    url: request?.redirect_url,
                  },
                  android: {
                    message: request?.redirect_url,
                  },
                }),
              });
            },
          },
          {
            label: request?.tx_type === 'neutral_debit' ? 'decline' : 'cancel',
            id: `request_cancel_${request?.id}`,
            get onPress() {
              return () => {
                setLoading && setLoading(this?.id);
              };
            },
          },
          {
            label: 'confirm',
            id: `request_cancel_confirm_${request?.id}`,
            type: 'secondary',
            variant: 'contained',
            hidden: loading !== `request_cancel_${request?.id}`,
            get onPress() {
              return async () => {
                setLoadingSecondaryAction &&
                  setLoadingSecondaryAction(this?.id);
                await cancel({ request, showToast, user });
                closeModal();
                await getTransactions();
              };
            },
          },
          {
            label: 'back',
            type: 'secondary',
            hidden: loading !== `request_cancel_${request?.id}`,
            onPress: () => {
              setLoading && setLoading(null);
            },
          },
        ],
      },
    },
  };
}
