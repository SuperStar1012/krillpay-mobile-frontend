import React, { useState } from 'react';

import { View, Spinner } from 'components';
import LocalAuthVerifyPage from './LocalAuthVerifyPage';
import CompanyStatusBanner from '../../../components/auth/CompanyStatusBanner';
import { useRehiveContext, useRehiveMethods } from 'contexts/RehiveContext';
import { LANDING } from '../config/authMachine';
import { logoutUser } from 'utility/auth/actions';

export default function LocalAuthScreen(props) {
  const { navigation } = props;
  // const { showToast } = useToast();

  const {
    config: { authConfig },
  } = useRehiveContext();
  const { send, dispatch } = useRehiveMethods();

  function handleLogout() {
    send(LANDING);
    dispatch(logoutUser());
    navigation.replace('Auth');
  }

  function handleSuccess() {
    navigation.replace('Private');
  }

  const [loading, setLoading] = useState(false);
  return (
    <View screen>
      <CompanyStatusBanner />
      {loading ? (
        <Spinner />
      ) : (
        <LocalAuthVerifyPage
          onSuccess={handleSuccess}
          onBack={handleLogout}
          setLoading={setLoading}
          authConfig={authConfig}
        />
      )}
    </View>
  );
}

