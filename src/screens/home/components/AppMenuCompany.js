import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import { Text, CustomIcon, Button, View, PopUpGeneral } from 'components';
import Logo from 'components/outputs/Logo';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'screens/auth/redux/selectors';
import client from 'config/client';
import { configAuthSelector, userTierSelector } from '@redux/rehive/selectors';
import CompanyStatusBanner from '../../../components/auth/CompanyStatusBanner';
import BurgerIcon from 'components/outputs/CustomIcon/BurgerIcon';

const AppMenuCompany = props => {
  const { setDrawerOpen, navigation } = props;
  const company = useSelector(currentCompanySelector);
  const { name, icon, id, logo, mode = '' } = company;

  const [showTestModal, setShowTestModal] = useState(false);
  const authConfig = useSelector(configAuthSelector);
  const tiers = useSelector(userTierSelector);
  const isVerified =
    get(tiers, ['items', 0, 'level'], 10) >= get(authConfig, 'tier', 0);

  useEffect(() => {
    if (!isVerified) {
      navigation.navigate('Profile');
    }
  }, [isVerified]);

  const { sessions = true } = authConfig;
  const hideSessions = Boolean(client.company && !sessions);
  const isTestCompany = Boolean(mode.match(/test/));
  const testTooltip = `You're using a test project. The funds are not real and are only for demo and testing purposes.`;

  const burger = true;

  return (
    <>
      <CompanyStatusBanner company={company} />
      <View fD="row" aI="center" w="100%" jC="space-between">
        {!hideSessions ? (
          <Button
            disabled={hideSessions}
            t={'text'}
            onPress={() => setDrawerOpen(true)}
            wide>
            {burger ? (
              <View ph={1} pt={1}>
                <BurgerIcon />
              </View>
            ) : (
              <View
                fD="row"
                style={{ maxWidth: '50%' }}
                f={1}
                aI="center"
                p={0.25}>
                <Logo
                  image={icon ? icon : logo}
                  height={32}
                  width={32}
                  type={'rehive-icon'}
                />
                <Text w="auto" variant={'body1'}>
                  {name ? name : id}
                </Text>
              </View>
            )}
          </Button>
        ) : (
          <View />
        )}
        {/* {isTestCompany && (
          <Button
            disabled={hideSessions}
            t={'text'}
            onPress={() => setShowTestModal(true)}
            wide>
            <View fD="row" aI="center" jC="flex-end" ph={1} pt={1}>
              <CustomIcon name={'test'} size={14} contained={false} />
              <Text
                align={'center'}
                width="auto"
                c="primary"
                s={14}
                style={{ paddingLeft: 8 }}>
                Test company
              </Text>
            </View>
          </Button>
        )} */}
        {!!showTestModal && (
          <PopUpGeneral
            visible={showTestModal}
            onDismiss={() => setShowTestModal(false)}
            contentText={testTooltip}
            title={'Test project'}
            buttonActions={[
              {
                text: 'CLOSE',
                style: { paddingHorizontal: 0, minWidth: 0 },
                onPress: () => setShowTestModal(false),
              },
            ]}
          />
        )}
      </View>
    </>
  );
};

export default React.memo(AppMenuCompany);
