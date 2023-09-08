import React, { useState, useEffect, useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, uniq, intersection } from 'lodash';
import { View, PopUpGeneral, Text } from '../../components';
import Image from '../../components/outputs/Image';
import {
  conversionRatesSelector,
  currenciesSelector,
} from 'screens/accounts/redux/reducer';
import {
  currentCompanyServicesSelector,
  currentCompanySelector,
} from 'screens/auth/redux/selectors';
import TransactionList from '../accounts/components/TransactionList';
import moment from 'moment';
import {
  configCardsSelector,
  configOnboardingSelector,
} from '@redux/rehive/selectors';
import { useOnboarding } from '../../utility/contexts/onboarding';
import { cryptoCodeToType } from '../../utility/general';
import Tabs from 'components/layout/Tabs';
import HomeCardList from './components/HomeCardList';
import { useRehive } from 'hooks/rehive';
import { checkWyreKYC } from 'extensions/wyre/util';
import { useRehiveContext } from 'contexts';
import BottomSheet from '@gorhom/bottom-sheet';
import ContactUtil from 'utility/contacts';

function mapCards({
  cardsConfig,
  isDismissed,
  hasBankOrCryptoAccount,
  onboardingConfig,
  profileConfig,
  hasPendingDoc,
  navigation,
  services,
  config,
}) {
  let dataMap = {};

  Object.keys(cardsConfig?.home)?.map(key => {
    dataMap[key] = ['transactions'].includes(key)
      ? cardsConfig?.home?.[key]
      : [
          // {
          //   type: 'featured_products',
          //   content:
          //     key === 'main' &&
          //     services?.product_service &&
          //     !cardsConfig?.home?.main?.featured?.hideProducts,
          // },
          // {
          //   type: 'featured_rewards',
          //   content:
          //     key === 'main' &&
          //     services?.rewards_service &&
          //     !cardsConfig?.home?.main?.featured?.hideRewards,
          // },
          {
            type: 'announcement',
            content: !isDismissed({
              section: 'announcements',
              id: cardsConfig?.home?.[key]?.announcement?.id,
            })
              ? cardsConfig?.home?.[key]?.announcement
              : null,
          },
          ...(cardsConfig?.home?.[key]?.alerts
            ?.filter(
              x =>
                (!x.startDate || moment() >= moment(x.startDate)) &&
                (!x.endDate || moment() < moment(x.endDate)) &&
                (!x.groups?.length ||
                  intersection(
                    x.groups ?? [],
                    profileConfig?.groups?.map(x => x.name) ?? [],
                  )?.length) &&
                !isDismissed({ section: 'alerts', id: x.id }),
            )
            .map(x => {
              return {
                type: 'alert',
                content: x,
              };
            }) ?? []),
          ...(cardsConfig?.home?.[key]?.prompts
            ?.filter(
              x =>
                x.enable &&
                !isDismissed({ section: 'prompts', id: x.id }) &&
                !(
                  x.id === 'verify' &&
                  intersection(
                    onboardingConfig?.hideApp ?? [],
                    profileConfig?.groups?.map(x => x.name) ?? [],
                  )?.length
                ) &&
                (!x.groups?.length ||
                  intersection(
                    x.groups ?? [],
                    profileConfig?.groups?.map(x => x.name) ?? [],
                  )?.length) &&
                !(
                  ['bank', 'crypto'].includes(x.variant) &&
                  hasBankOrCryptoAccount
                ),
            )
            ?.map(x => {
              return {
                type: 'prompt',
                content: x,
              };
            }) ?? []),
          ...(cardsConfig?.home?.[key]?.posts
            ?.filter(
              x =>
                x.enable &&
                (!x.startDate || moment() >= moment(x.startDate)) &&
                (!x.endDate || moment() < moment(x.endDate)) &&
                (!x.groups?.length ||
                  intersection(
                    x.groups ?? [],
                    profileConfig?.groups?.map(x => x.name) ?? [],
                  )?.length) &&
                !isDismissed({ section: 'posts', id: x.id }),
            )
            ?.map(x => {
              return {
                type: 'post',
                content: x,
              };
            }) ?? []),
        ].filter(x => x.content);
  });

  if (hasPendingDoc) {
    if (!dataMap.main) dataMap.main = [];
    dataMap.main.push({
      content: {
        title: 'documents_pending',
        description: 'documents_pending_description',
        variant: 'document',
        enable: true,
        onPress: () => navigation.navigate('Documents'),
      },
      type: 'prompt',
    });
  }

  const hasWyreKYC = checkWyreKYC(services, config, profileConfig);

  if (hasWyreKYC && profileConfig?.status !== 'verified') {
    if (!dataMap.main) dataMap.main = [];
    dataMap.main.push({
      content: {
        title: 'increase_deposit_limit',
        description: 'increase_deposit_limit_description',
        variant: 'kyc',
        enable: true,
        image: 'userVerify',
        onPress: () => navigation.navigate('WebView', { id: 'WyreKYC' }),
      },
      type: 'prompt',
    });
  }

  dataMap.transactions = dataMap.transactions ?? { hide: false };

  return dataMap;
}

export default function _BottomSheet(props) {
  const { navigation, currency, selectedCurrencyIndex, homeHeaderHeight } =
    props;
  const isAndroid = Platform.OS === 'android';

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(true);
  const [popUpVisible, setPopUpVisible] = useState(false);

  const currencies = useSelector(currenciesSelector);
  const rates = useSelector(conversionRatesSelector);
  const services = useSelector(currentCompanyServicesSelector);
  const company = useSelector(currentCompanySelector);
  const onboardingConfig = useSelector(configOnboardingSelector);
  const cardsConfig = useSelector(configCardsSelector);

  const { config, tier, tiers, user } = useRehiveContext();

  const selectedCurrency = get(currencies, ['data', selectedCurrencyIndex]);
  let newCardsConfig = { ...cardsConfig };

  useEffect(() => {
    ContactUtil.getAllContacts(['email', 'mobile', 'crypto'], false);
  }, []);

  if (cardsConfig?.home?.custom || cardsConfig?.home?.general) {
    const welcomeCard = cardsConfig?.home?.custom?.find(
      item => item.title === 'Welcome',
    );
    newCardsConfig.home = {
      feed: {
        posts:
          cardsConfig?.home?.custom
            ?.map(item => ({
              ...item,
              enable: true,
            }))
            .filter(item => item?.title !== 'Welcome') ?? [],
      },
      main: {
        ...(cardsConfig?.home?.main ?? {}),
        announcement:
          cardsConfig?.home?.general?.welcome || welcomeCard
            ? {
                description: welcomeCard?.description ?? company?.description,
                dismissible: true,
                id: 'welcome',
                title: 'welcome_card_title',
              }
            : null,
        prompts: cardsConfig?.home?.general?.verify
          ? [
              {
                description: 'tap_to_complete_onboarding',
                dismissible: true,
                enable: true,
                id: 'verify',
                title: 'complete_verification',
                variant: 'verify',
              },
            ]
          : [],
      },
    };
  }

  const windowHeight = Dimensions.get('window').height;
  const showBanner = Boolean(company?.mode?.match(/test|suspended/));

  // Somehow this adjustment factor is needed to get things to work properly
  // TODO: Figure out why exactly this is needed as it feels like it shouldn't be
  const adjustingHeightOnDevice = useMemo(() => {
    if (windowHeight > 760) return 40;
    else if (windowHeight > 720) return 50;
    else if (windowHeight > 680) return 60;
    else if (windowHeight > 640) return 70;
    else if (windowHeight > 600) return 80;
    else if (windowHeight > 560) return 90;
    return 100;
  }, []);

  // TODO: We don't understand exactly why the additional adjustments for the banner and isAndroid are needed.
  const initSnapPoint =
    windowHeight -
    (homeHeaderHeight +
      adjustingHeightOnDevice +
      (showBanner ? 70 : 30) +
      (isAndroid ? 0 : 75));
  const snapPoints = homeHeaderHeight ? [initSnapPoint, '100%'] : null;

  const {
    data: { userConfig, userBankAccounts, userCryptoAccounts },
    state: { fetching },
    isLoading,
    methods: { fetch },
  } = useOnboarding({ home: true });

  const { sections = [], canSkip } = userConfig;
  const forceOnboarding = !isLoading && !canSkip && user?.id;
  useEffect(() => {
    if (forceOnboarding) navigation.navigate('Onboarding');
  }, [forceOnboarding]);

  // useEffect(() => {
  //   loadDismissed();
  //   const timeout = setTimeout(() => setPopUpVisible(true), 2000);
  //   return timeout;
  // }, []);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem('dismissed', JSON.stringify(dismissed));
  }, [dismissed]);

  function onDismiss({ section, id }) {
    let temp = {
      ...dismissed,
      [company?.id]: {
        ...dismissed?.[company?.id],
        [user?.id]: {
          ...dismissed?.[company?.id]?.[user?.id],
          [section]: uniq([
            ...(dismissed?.[company?.id]?.[user?.id]?.[section] ?? []),
            id,
          ]),
        },
      },
    };

    setDismissed(temp);
  }

  async function loadDismissed() {
    // await AsyncStorage.removeItem('dismissed');
    let tempDismissed = await AsyncStorage.getItem('dismissed');

    setDismissed(tempDismissed ? JSON.parse(tempDismissed) : {});
    setLoading(false);
  }

  const isDismissed = ({ section, id }) => {
    return (
      dismissed?.[company?.id]?.[user?.id]?.[section]?.includes(id) ?? false
    );
  };

  const hasBankOrCryptoAccount = useMemo(() => {
    return Boolean(
      userBankAccounts?.find(x =>
        Boolean(
          x.currencies.find(y => y.code === selectedCurrency?.currency?.code),
        ),
      ) ||
        Boolean(
          userCryptoAccounts?.find(
            x =>
              x.crypto_type ===
              cryptoCodeToType(selectedCurrency?.currency?.code),
          ),
        ),
    );
  });

  function onRefresh() {
    //TODO: fetch the cards config
    fetch();
  }

  const {
    context: { items: userDocuments = [] },
  } = useRehive('document', true);

  const hasPendingDoc = useMemo(
    () => userDocuments?.findIndex(item => item.status === 'pending') !== -1,
  );

  let dataMap = useMemo(
    () =>
      mapCards({
        tier,
        tiers,
        cardsConfig,
        isDismissed,
        hasBankOrCryptoAccount,
        hasPendingDoc,
        onboardingConfig,
        profileConfig: user,
        services,
        config,
        navigation,
      }),
    [cardsConfig?.home, isDismissed],
  );

  let tabItems = [];
  let mainData = dataMap?.['main'] ?? [];
  let feedData = dataMap?.['feed']?.reverse() ?? [];
  try {
    if ((cardsConfig?.home?.mergeMainFeed ?? true) && feedData?.length > 0) {
      mainData = mainData?.concat(feedData ?? []).filter(item => item);
      feedData = [];
    }

    if (!!mainData?.length)
      tabItems.push({
        key: 'main',
        component: HomeCardList,
        props: {
          navigation,
          company,
          selectedCurrency,
          wallet: selectedCurrency,
          section: 'main',
          sections,
          onRefresh,
          refreshing: fetching,
          data: mainData,
          onDismiss,
        },
      });
    if (!!feedData?.length)
      tabItems.push({
        key: 'feed',
        component: HomeCardList,
        props: {
          navigation,
          company,
          selectedCurrency,
          wallet: selectedCurrency,
          section: 'feed',
          sections,
          onRefresh,
          refreshing: fetching,
          data: feedData,
          onDismiss,
        },
      });
    if (!dataMap?.transactions?.hide)
      tabItems.push({
        key: 'transactions',
        component: TransactionList,
        props: {
          navigation,
          services,
          rates,
          c: currency,
          wallet: selectedCurrency,
          headerNoPadding: true,
          hideCorner: true,
        },
      });
  } catch (e) {
    mainData = [];
    feedData = [];
  }

  if (!user) return null;

  function renderPopUp() {
    const popUp = cardsConfig?.home?.main?.popup;

    if (!popUp || isDismissed({ section: 'popups', id: popUp?.id }))
      return null;

    const handleDismiss = () => {
      setPopUpVisible(false);
      if (popUp.dismissible)
        setTimeout(() => onDismiss({ section: 'popups', id: popUp?.id }), 2000);
    };

    const navigateAction = action => {
      if (
        ![
          'receive',
          'withdraw',
          'deposit',
          'exchange',
          'request',
          'send',
          'verify',
        ].includes(action)
      )
        return;

      handleDismiss();

      return navigation.navigate(
        action === 'verify'
          ? 'Onboarding'
          : `${action.charAt(0).toUpperCase()}${action.slice(1)}`,
        { currency },
      );
    };

    const isVisible = popUpVisible && navigation?.isFocused();

    if (!isVisible) return null;

    return (
      <PopUpGeneral
        visible={isVisible}
        buttonActions={[
          {
            text: (popUp?.actionLabel ?? popUp?.action)?.toUpperCase(),
            onPress: () => navigateAction(popUp?.action),
          },
        ]}
        iconTitleRight={'close'}
        onDismiss={handleDismiss}
        onPressTitleRight={handleDismiss}>
        <View w="100%">
          {!!popUp?.image && (
            <View mb={1} h={100} aI={'center'} w="100%">
              <Image
                src={popUp?.image}
                resizeMode={'cover'}
                height={100}
                width={100}
                style={{ borderRadius: 10, height: 100, width: 100 }}
              />
            </View>
          )}
          <View mb={1}>
            <Text tA={'center'} s={22} c={'primary'} fW={'700'}>
              {popUp.title}
            </Text>
          </View>
          <Text tA={'center'}>{popUp.description}</Text>
        </View>
      </PopUpGeneral>
    );
  }

  function renderContent() {
    return (
      <View
        fG={1}
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <View fG={1}>
          <View
            fD={'row'}
            jC={'flex-end'}
            w={'100%'}
            style={{ position: 'relative', zIndex: 2000 }}>
            {tabItems?.length > 1 && (
              <View fD={'row'} ph={1} mt={0.1}>
                {tabItems?.map((x, index) => (
                  <View
                    key={x?.key}
                    w={tabIndex === index ? 21 : 7}
                    h={7}
                    bR={100}
                    bC={tabIndex === index ? 'primary' : '#D3D3D3'}
                    mr={index === tabItems?.length - 1 ? 0 : 0.75}></View>
                ))}
              </View>
            )}
          </View>
          <Tabs
            routes={tabItems}
            config={{ hideTabBar: true }}
            onChangeTab={setTabIndex}></Tabs>
        </View>
        {renderPopUp()}
      </View>
    );
  }

  if (!snapPoints) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      onChange={() => {}}
      activeOffsetY={[-5, 5]}>
      {renderContent()}
    </BottomSheet>
  );
}

_BottomSheet.whyDidYouRender = true;
