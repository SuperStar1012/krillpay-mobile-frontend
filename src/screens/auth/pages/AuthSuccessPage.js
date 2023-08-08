import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { intersection } from 'lodash';
import { View, Spinner } from 'components';
import { appLoadedSelector } from '../redux/selectors';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function AuthSuccess(props) {
  const { setLoading, tempAuth, initialUser, navigation } = props;
  const {
    context: { user, tier },
    config: { onboardingConfig, authConfig },
  } = useRehiveContext();
  const appLoaded = useSelector(appLoadedSelector);

  const enterOnboarding =
    (tempAuth.register &&
      !intersection(
        onboardingConfig.hideApp,
        initialUser?.groups?.map(x => x.name) ?? [],
      )?.length &&
      !intersection(
        onboardingConfig.hideRegister,
        initialUser?.groups?.map(x => x.name) ?? [],
      )?.length) ||
    tier?.items?.[0]?.level < authConfig?.tier;

  useEffect(() => {
    if (appLoaded && user) {
      setLoading(false);
      if (enterOnboarding)
        navigation.replace('Private', { screen: 'Onboarding' });
      else navigation.replace('Private');
    }
  }, [appLoaded, user]);

  return (
    <View f={1} jC={'center'} aI={'center'}>
      <Spinner
        type="auth"
        size="large"
        color="authScreenContrast"
        backgroundColor="authScreen"
      />
    </View>
  );
}
