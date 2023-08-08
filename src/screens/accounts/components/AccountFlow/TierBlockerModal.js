import React, { useEffect } from 'react';
import { PopUpGeneral, Text, Button, View } from 'components';
import Images from 'components/images';
import { useModal } from 'utility/hooks';
import { checkBlocked } from 'screens/accounts/util/accounts';

export default function TierBlockerModal(props) {
  const {
    stateId,
    onBack,
    navigation,
    context,
    wallet,
    configs,
    result,
    setResult,
    conversionBlock,
    setConversionBlock,
  } = props;

  const modalProps = useModal();
  const { modalVisible, hideModal, showModal } = modalProps;

  useEffect(() => {
    if (conversionBlock) {
      showModal(conversionBlock);
      setConversionBlock(null);
    }
  }, [conversionBlock]);

  useEffect(() => {
    let timer = null;
    if (configs?.amount?.validation !== false ?? true) {
      const modalConfig = checkBlocked(props);

      if (modalConfig) {
        timer = setTimeout(
          () => {
            showModal(modalConfig);
          },
          // timeout to allow wallet selector modal to close if on amount / switching wallets
          stateId.match(/note/) ? 0 : 500,
        );
      } else hideModal();
    }
    return () => clearTimeout(timer);
  }, [wallet, result]);

  function handleDismiss() {
    hideModal();
    if (result) setResult(null);
    else if (modalVisible?.back) onBack();
  }

  function handleTierNavigation() {
    hideModal();
    navigation.navigate('Tier');
  }

  const tier = context?.tier?.items?.[0];
  if (!modalVisible) return null;

  return (
    <PopUpGeneral visible={Boolean(modalVisible)} onDismiss={handleDismiss}>
      <Images name={'tier' + tier?.level.toString()} height={100} width={100} />
      <Text tA="center" s={20} p={1} c="primary">
        {modalVisible?.title}
      </Text>
      <Text tA="center" p={0.5}>
        {modalVisible?.description}
      </Text>
      <View ph={0.5} pt={1}>
        <Button
          label="GO TO TIER LIMITS"
          wide
          onPress={handleTierNavigation}></Button>
      </View>
    </PopUpGeneral>
  );
}
