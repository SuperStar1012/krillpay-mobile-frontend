import React, { useEffect, useState } from 'react';
import { Dimensions, Linking, TouchableOpacity } from 'react-native';
import { track, trackFlow } from 'utility/tracking';
import client from 'config/client';

import { Button } from 'components/inputs/Button';
import { Slides } from 'components/layout/Slides';
import { View } from 'components/layout/View';
import Logo from 'components/outputs/Logo';
import { useLocalAuth } from 'contexts/LocalAuthContext';
import { CustomIcon, Text } from 'components';
import { standardizeString } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';
import AboutAppFooter from '../components/AboutAppFooter';
import { Ionicons } from '@expo/vector-icons';
const SCREEN_WIDTH = Dimensions.get('window').width;

const CustomCheckBox = ({ isChecked, onToggle }) => {
  const handleToggle = () => {
    onToggle(!isChecked);
  };

  return (
    <TouchableOpacity w={16} onPress={handleToggle}>
      {isChecked && (
        <Ionicons name="checkmark-circle" size={24} color="#08518b" />
      )}
      {!isChecked && (
        <Ionicons name="checkmark-circle-outline" size={24} color="gray" />
      )}
    </TouchableOpacity>
  );
};

export default function LandingPage(props) {
  let {
    newAuth,
    onLogin,
    onGroup,
    onRegister,
    onAbout,
    company = {},
    authConfig,
    onBack,
    setLoading,
    setDrawerOpen,
  } = props;

  useEffect(() => {
    if (!company) onBack();
  }, [company]);

  const { reset } = useLocalAuth();

  useEffect(() => {
    setLoading(false);
    reset();
    track('LANDING');
  }, []);

  const {
    config: { slidersConfig },
  } = useRehiveContext();

  if (!company) return null;
  if (!company?.name) {
    company.name = standardizeString(company?.id ?? '');
  }

  const slides = slidersConfig?.auth ?? [];
  const showSlider = slides && slides.length > 0;
  const [isChecked, setIsChecked] = useState(false);

  const pageButtons = padded => (
    <View p={1.5} pb={0.25} w={'100%'} aI={'center'}>
      <Button
        test-id={'login'}
        id="login"
        color="primary"
        onPress={() => {
          trackFlow('login', 'landing', ['login button'], 'clicked');
          onLogin();
        }}
        wide
      />
      {!Boolean(authConfig.disableRegister) && (
        <Button
          test-id={'register'}
          id={'register'}
          color="primary"
          type="outlined"
          disabled={!isChecked}
          buttonStyle={{ marginTop: 16 }}
          onPress={() => {
            trackFlow('register', 'landing', ['register button'], 'clicked');
            if (authConfig.group) return onGroup();
            onRegister();
          }}
          wide
        />
      )}
      {/* <Text  s={16} c="#868686" style={{ marginTop: 4 }} id="by_con" /> */}
      <View fD={'row'} style={{ marginTop: 4 }}>
        <CustomCheckBox
          isChecked={isChecked}
          onToggle={() => setIsChecked(!isChecked)}
        />

        <Text s={16} c="#868686" style={{ marginLeft: 4 }}>
          By checking this box you agree to{' '}
          <Text
            s={16}
            c="primary"
            onPress={() => {
              Linking.openURL('https://krillpay.com/page/terms-and-conditions');
            }}>
            Our Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            s={16}
            c="primary"
            onPress={() => {
              Linking.openURL('https://krillpay.com/page/privacy-policy');
            }}>
            Privacy Policy
          </Text>
          , as well as our partner{' '}
          <Text
            s={16}
            c="primary"
            onPress={() => {
              Linking.openURL(
                'https://cybrid.xyz/hubfs/20592480/Legal/Cybrid-User-Agreement_COMBINED.pdf',
              );
            }}>
            Cybrid’s User Agreement
          </Text>{' '}
          and{' '}
          <Text
            s={16}
            c="primary"
            onPress={() => {
              Linking.openURL('https://www.cybrid.xyz/en/privacy-policy');
            }}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View f={1} jC={showSlider ? 'space-between' : 'flex-start'} w="100%">
      <View w={'100%'} fD={'row'} jC={'space-between'} aI={'center'}>
        {!client.company || (newAuth && client.company) ? (
          <Button
            // disabled={hideSessions}
            t={'text'}
            onPress={() => setDrawerOpen(true)}>
            <View pl={1.5} pt={1.5}>
              <CustomIcon
                name={'burger'}
                color="#434343"
                size={14}
                contained={false}
                width={34}
              />
            </View>
          </Button>
        ) : null}
        {showSlider && (
          <View
            jC={'flex-end'}
            aI={'flex-end'}
            w={'100%'}
            pr={0}
            // pt={1}
            fD={'row'}>
            <Logo
              company={company}
              onAbout={onAbout}
              height={32}
              width={32}
              // isIcon
            />
          </View>
        )}
      </View>
      <View aI={'center'} jC={'flex-start'} fG={1} w="100%" mt={4}>
        {showSlider ? (
          <Slides
            items={slides}
            loop
            autoplay
            autoplayInterval={5000}
            width={SCREEN_WIDTH / 1.5}
          />
        ) : (
          <React.Fragment>
            <View mb={1}>
              <Logo
                height={SCREEN_WIDTH / 3}
                width={SCREEN_WIDTH / 3}
                company={company}
                onAbout={onAbout}
              />
            </View>
            <View mb={2} aI="center" jC="center">
              <Text s={25} fW="bold" id="landing_title" context={{ company }} />
              <Text
                s={16}
                c="#868686"
                style={{ marginTop: 4 }}
                id="landing_description"
              />
            </View>
            {pageButtons()}
            <AboutAppFooter {...props} />
          </React.Fragment>
        )}
      </View>
      {showSlider && pageButtons(true)}
    </View>
  );
}
