import React from 'react';
import { objectToArray } from 'utility/general';
import FullPageTileSelector from 'components/inputs/FullPageTileSelector';
import { View } from 'components';
import Header from 'components/layout/HeaderNew';
import IconButton from 'components/inputs/IconButton';
import AppMenuCompany from 'screens/home/components/AppMenuCompany';
import BusinessDrawer from 'screens/pos/components/BusinessDrawer';
import { useModal } from 'utility/hooks';

const config = {
  sale: {
    label: 'create_new_sale',
    icon: 'sale',
    screen: 'Sale',
  },
  qr: {
    label: 'print_qr',
    icon: 'qr',
    screen: 'QR',
  },
  redeemVoucher: {
    label: 'redeem_voucher',
    icon: 'voucher',
    screen: 'RedeemVoucher',
    condition: ({ seller }) => !!seller?.id,
  },
  topup: {
    label: 'top_up_user_balance',
    icon: 'top_up',
    screen: 'TopUp',
    condition: ({ wallets }) =>
      !!(wallets?.accountsDictionary?.teller ?? wallets.primaryAccount),
  },
};

export default function Landing(props) {
  const { navigation, context } = props;

  const options = objectToArray(config, 'id').filter(({ condition }) =>
    typeof condition === 'function' ? condition(context) : true,
  );
  function handleNavigation(item) {
    if (item?.screen) navigation.navigate(item?.screen);
  }
  const { showModal, hideModal, modalVisible } = useModal();

  return (
    <View screen bC="background">
      <BusinessDrawer
        navigation={navigation}
        drawerOpen={modalVisible}
        hideDrawer={hideModal}>
        <>
          <AppMenuCompany setDrawerOpen={showModal} navigation={navigation} />
          <Header
            title="point_of_sale"
            // navigation={navigation}
            bC="background"
            bold
          />
          <FullPageTileSelector
            options={options}
            loading={context?.loading}
            onValueSelect={handleNavigation}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 28,
              right: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3,
            }}>
            <IconButton
              icon="wallet"
              color="secondary"
              size={60}
              padding={16}
              onPress={navigation.goBack}
            />
          </View>
        </>
      </BusinessDrawer>
    </View>
  );
}
