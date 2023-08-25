import React, { useState, useRef } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { View } from '../../components';
import { currenciesSelector } from 'screens/accounts/redux/reducer';
import AppMenuCompany from './components/AppMenuCompany';
import CurrentSessionsDrawer from '../../components/auth/CurrentSessionsDrawer';
import HomeBalanceHeader from './components/HomeBalanceHeader';
import _BottomSheet from './bottomSheet';
import IconButton from 'components/inputs/IconButton';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useRehive } from 'hooks/rehive';
import { checkBusinessGroup } from 'utility/business';
import { getUserGroup } from 'utility/general';
import { useBusiness } from 'contexts';

export default function HomeScreen(props) {
  const { navigation } = props;
  const [homeHeaderHeight, setHomeHeaderHeight] = useState(0);

  const currencies = useSelector(currenciesSelector);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpening, setSheetOpening] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  // const [tabIndex, setTabIndex] = useState(0);
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(0);
  const selectedCurrency = get(currencies, ['data', selectedCurrencyIndex]);

  const {
    context: { user },
  } = useRehiveContext({ memo: ['user'] });
  const {
    context: { businessServiceSettings },
  } = useRehive(['businessServiceSettings'], true, {
    user,
  });

  const { business } = useBusiness();

  const isBusinessGroup = checkBusinessGroup(
    businessServiceSettings,
    getUserGroup(user),
  );

  return (
    <View screen hC={drawerOpen ? 'primary' : 'surface'} bC="#F8F8F8">
      <CurrentSessionsDrawer
        navigation={navigation}
        drawerOpen={drawerOpen}
        hideDrawer={() => setDrawerOpen(false)}>
        <React.Fragment>
          <AppMenuCompany
            setDrawerOpen={() => setDrawerOpen(true)}
            navigation={navigation}
          />
          <View f={1}>
            {(Platform.OS === 'ios' || !sheetOpen || sheetClosing) && (
              <HomeBalanceHeader
                {...{
                  navigation,
                  currencies,
                  selectedCurrency,
                  setSelectedCurrencyIndex,
                  setHomeHeaderHeight,
                }}
              />
            )}
            <_BottomSheet
              {...{
                sheetOpen,
                setSheetOpen,
                expand,
                setExpand,
                sheetClosing,
                setSheetClosing,
                sheetOpening,
                setSheetOpening,
                navigation,
                currency: selectedCurrency,
                selectedCurrencyIndex,
                homeHeaderHeight,
              }}
            />
          </View>
        </React.Fragment>
      </CurrentSessionsDrawer>
      {isBusinessGroup && business?.status === 'verified' && (
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            right: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3,
          }}>
          <IconButton
            icon="pos"
            color="secondary"
            size={60}
            padding={16}
            onPress={() => navigation.navigate('PoS')}
          />
        </View>
      )}
    </View>
  );
}
HomeScreen.whyDidYouRender = true;
