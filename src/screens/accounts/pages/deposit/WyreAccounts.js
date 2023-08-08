import React, { useMemo } from 'react';
import { Text, View, EmptyListMessage } from 'components';
import { useQuery } from 'react-query';
import { getWyrePaymentMethods } from 'utility/rehive';
import AddAccountCard from 'components/cards/AddNewAccountCard';
import WyreAccountCard from 'components/wyre/WyreAccountCard';
import CardsSkeleton from 'components/cards/CardsSkeleton';
import { FlatList } from 'react-native';
import { useModal } from 'utility/hooks';
import { checkDocumentsStatus } from 'utility/documents';
import DepositTimeModal from './DepositTimeModal';
import { useDimissed } from 'hooks/general';
import { useWyreUsers, useWyreUsersKYC } from 'extensions/wyre/hooks';
import DepositBlocker from './DepositBlocker';

export default function WyreAccounts(props) {
  const { send, form, context } = props;
  const {
    context: { user },
  } = props;

  const { documents } = context;

  const { modalVisible, showModal, hideModal } = useModal();
  const {
    modalVisible: depositTimeModalVisible,
    showModal: depositTimeShowModal,
    hideModal: depositTimeHideModal,
  } = useModal();
  const {
    dismissed,
    dismiss,
    loading: loadingDismissed,
  } = useDimissed('deposit_wyre_modal');

  const isWyreUsers = useWyreUsers();
  const isWyreKYC = useWyreUsersKYC();

  async function handleDepositTimeModalAccept() {
    await dismiss();
    depositTimeHideModal();
    send('NEXT');
  }

  const { isPending, isVerified } = useMemo(
    () => checkDocumentsStatus(documents),
    documents,
  );

  async function handleAddAccount() {
    send('ADD');
  }
  function handleAccountSelect(item) {
    if (isWyreUsers && !isWyreKYC) {
      showModal('kyc');
    } else if (isVerified) {
      form.setValue('account', item);
      if (dismissed) send('NEXT');
      else depositTimeShowModal();
    } else if (isPending) {
      showModal('pending');
    } else {
      showModal('failed');
    }
  }

  const { data: paymentMethods, isLoading: loadingPaymentMethods } = useQuery(
    [user?.id, 'wyre-payment-methods'],
    () => getWyrePaymentMethods(), //{ search: '?status=ACTIVE' }),
    {
      enabled: !!user?.id,
    },
  );
  const isEmpty = !paymentMethods?.results?.length > 0;
  const isLoading = Boolean(
    loadingPaymentMethods || documents?.loading || loadingDismissed,
  );

  return (
    <View ph={1.5} f={1}>
      <Text s={18} fW={'700'} paragraph tA={'center'} id="deposit_funds" />
      <Text s={14} paragraph tA={'center'} id="deposit_funds_description" />
      <View pv={1}>
        <Text s={18} fW={'500'} id="your_linked_accounts" />
      </View>

      {isLoading ? (
        <CardsSkeleton mb />
      ) : isEmpty ? (
        <EmptyListMessage pt={0.000005} pb={1} id="linked_accounts" />
      ) : (
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={paymentMethods?.results ?? []}
          renderItem={({ item }) => (
            <WyreAccountCard
              {...props}
              item={item}
              onPress={handleAccountSelect}
            />
          )}
          keyExtractor={item => item?.id}
        />
      )}

      <View pb={1.5}>
        {!isLoading && <AddAccountCard onPress={handleAddAccount} />}
      </View>
      <DepositBlocker isVisible={modalVisible} onDismiss={hideModal} />
      <DepositTimeModal
        isVisible={depositTimeModalVisible}
        onAccept={handleDepositTimeModalAccept}
        onDismiss={depositTimeHideModal}
      />
    </View>
  );
}
