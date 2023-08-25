import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { track, trackFlow } from 'utility/tracking';
import { useCompany } from 'contexts/CompanyContext';

import { Button } from 'components/inputs/Button';
import { Slides } from 'components/layout/Slides';
import { View } from 'components/layout/View';
import Logo from 'components/outputs/Logo';
import { useLocalAuth } from 'contexts/LocalAuthContext';
import { CustomIcon, Text } from 'components';
import { standardizeString } from 'utility/general';
import { useRehiveContext } from 'contexts/RehiveContext';
import AboutAppFooter from '../components/AboutAppFooter';
const SCREEN_WIDTH = Dimensions.get('window').width;

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
  const { company: client } = useCompany();

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
          buttonStyle={{ marginTop: 16 }}
          onPress={() => {
            trackFlow('register', 'landing', ['register button'], 'clicked');
            if (authConfig.group) return onGroup();
            onRegister();
          }}
          wide
        />
      )}
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
