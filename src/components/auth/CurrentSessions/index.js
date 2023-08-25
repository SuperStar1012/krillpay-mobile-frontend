import React, { useState } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';

import { View, Button, PopUpGeneral, Text, CustomIcon } from 'components';
import {
  currentSessionsSelector,
  companiesSelector,
} from 'screens/auth/redux/selectors';
import { removeAllAuthSessions } from 'screens/auth/redux/actions';
import CurrentSessionsList from './CurrentSessionsList';
import { logout } from 'utility/rehive';
import { configAuthSelector } from '@redux/rehive/selectors';
import IconButton from 'components/inputs/IconButton';
import { useRehiveContext } from 'contexts/RehiveContext';
import { Icon } from 'components/outputs/Icon';
import { useTheme } from 'components/context';
import Badge from 'components/outputs/Badge';
import { useRoute } from '@react-navigation/native';
import { clearTemp } from 'utility/auth/actions';
import { useCompany } from 'contexts/CompanyContext';

function useModal() {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setVisible(false);
    setLoading(false);
    setError('');
  }

  function show() {
    setVisible(true);
    setError('');
  }

  return {
    visible,
    setVisible,
    loading,
    setLoading,
    error,
    setError,
    dismiss,
    show,
  };
}

function CurrentSessions(props) {
  const { hideDrawer, navigation, onSuccess, isCompany, isLanding } = props;
  const { colors } = useTheme();
  const {
    context: { user },
  } = useRehiveContext();
  const photoLink = user?.profile;
  const route = useRoute();
  const isAuthScreen = route?.name === 'Auth';
  const Modal = useModal();
  const dispatch = useDispatch();
  const { company: client } = useCompany();

  const currentSessions = useSelector(currentSessionsSelector);
  const { items, companyID, userID } = currentSessions;
  const companies = useSelector(companiesSelector);
  const authConfig = useSelector(configAuthSelector);
  const { sessions = true } = authConfig;
  const hideSessions = Boolean(client.company && !sessions);
  const hideApps = Boolean(client.company);

  const [company, setCompany] = useState(
    get(companies, ['recent', client.company]),
  );

  const recent = get(companies, 'recent');
  const hideLogout = isEmpty(items);
  const iconColor = '#B9B9B9';
  const [appSessions, setAppSessions] = useState(
    Object.values(get(items, companyID, {})),
  );

  async function logoutAll() {
    try {
      //TODO: call logout function on all sessions
      logout();
      dispatch(removeAllAuthSessions());
      Modal.dismiss();
      if (navigation) navigation.navigate('Public', { screen: 'Auth' });
    } catch (error) {
      console.log(error);
      if (error.message === 'Invalid token.') {
        dispatch(removeAllAuthSessions());
        if (navigation) navigation.navigate('Public', { screen: 'Auth' });
      }
    }
  }

  function renderModal() {
    const buttonActions = [
      {
        text: 'cancel',
        type: 'text',
        onPress: Modal.dismiss,
      },
      {
        text: 'logout',
        onPress: () => {
          Modal.setLoading(true);
          logoutAll();
        },
      },
    ];

    const contentText = 'logout_modal_text';
    const titleText = 'logout';

    if (!Modal.visible) return null;

    return (
      <PopUpGeneral
        visible={Modal.visible}
        onDismiss={Modal.dismiss}
        loading={Modal.loading}
        errorText={Modal.error}
        title={titleText}
        contentText={contentText}
        buttonActions={buttonActions}
      />
    );
  }

  const navigateAuth = params => {
    if (params?.newApp || params?.newSession) dispatch(clearTemp());
    if (navigation && !isLanding && !isCompany) {
      navigation.navigate('Public', { screen: 'Auth', params });
    } else if (onSuccess) {
      onSuccess(params);
    }
  };

  const listProps = {
    company,
    setCompany,
    navigateAuth,
    hideApps,
    hideSessions,
    items,
    recent,
    noItems: hideLogout,
    companyID,
    userID,
    sessions: appSessions,
    setSessions: setAppSessions,
  };
  const companyName = company?.name || recent[companyID]?.name;

  const handleClose = () => {
    company && !hideApps ? setCompany(null) : hideDrawer();
  };

  const menuList = [
    {
      id: 'profile',
      onPress: () => {
        handleClose();
        navigation.navigate('Profile');
      },
      hideInAuthScreen: true,
    },
    {
      id: 'settings',
      onPress: () => {
        handleClose();
        navigation.navigate('Profile', { screen: 'Settings' });
      },
      hideInAuthScreen: true,
    },
    { id: 'help', onPress: () => navigation.navigate('Help') },
    {
      id: 'about',
      icon: 'information',
      onPress: () => navigation.navigate('About'),
    },
  ];

  const renderMenuItem = menuItem => {
    if (isAuthScreen && menuItem.hideInAuthScreen) return null;
    return (
      <Button
        key={menuItem.id}
        onPress={() => menuItem.onPress && menuItem.onPress()}>
        <View m={0.75} aI="center" fD="row">
          {menuItem.id === 'profile' && photoLink ? (
            <View pos="absolute">
              <Image
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 40,
                  borderWidth: 0,
                }}
                source={{
                  uri: photoLink,
                }}
                key={photoLink}
              />
            </View>
          ) : menuItem.id === 'help' ? (
            <MaterialIcons name="help" size={18} color={iconColor} />
          ) : (
            <CustomIcon
              name={menuItem?.icon ?? menuItem?.id}
              size={18}
              contained={false}
              color={iconColor}
            />
          )}
          <Text
            s={17}
            style={{
              marginLeft: menuItem?.id === 'profile' && photoLink ? 24 : 8,
            }}
            id={menuItem?.title ?? menuItem?.id}
          />
        </View>
      </Button>
    );
  };

  return (
    <React.Fragment>
      <View fD="row" h="100%">
        {!hideApps && (
          <View w={120} pt={2.5} jC="flex-start" bC="#F5F5F5">
            <View w="100%">
              <CurrentSessionsList
                displayApps
                appTitleDirection="column"
                {...listProps}
              />
            </View>
            <View ml={1.75}>
              <IconButton
                {...{
                  icon: 'add',
                  disabled: hideSessions,
                  onPress: () => navigateAuth({ newApp: true }),
                }}
              />
            </View>
          </View>
        )}
        <View f={1} fD="column" bC="#ffffff">
          <View aI="flex-end" mt={0.75}>
            <Button
              disabled={hideSessions}
              t={'text'}
              onPress={handleClose}
              containerStyle={{ width: 32 }}>
              <CustomIcon
                name={'close'}
                size={20}
                padded
                contained={false}
                color="#b9b9b9"
              />
            </Button>
          </View>
          <View m={0.75}>
            <View>
              {hideApps &&
                (company?.icon ? (
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      borderWidth: 0,
                      marginBottom: 16,
                    }}
                    source={{
                      uri: company?.icon,
                    }}
                    key={company?.icon}
                  />
                ) : (
                  <Badge
                    radius={20}
                    fontSize={20}
                    title={companyName}
                    color={colors.primaryContrast}
                    containerStyle={{ marginBottom: 16 }}
                  />
                ))}
              <Text s={20} fW="bold" style={{ marginTop: 8 }}>
                {companyName}
              </Text>
            </View>
          </View>
          {!hideApps && company ? ( // showing sessions when clicking on app
            <React.Fragment>
              <Text
                style={{ marginLeft: 18, marginBottom: 8, marginTop: 4 }}
                s={20}
                id="sessions"
              />
              <View w="100%">
                <CurrentSessionsList appTitleDirection="row" {...listProps} />
              </View>
            </React.Fragment>
          ) : (
            menuList.map(menuItem => renderMenuItem(menuItem))
          )}
          <View
            mt={0.5}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#E0E0E0',
            }}
          />
          <View mt={0.6}>
            {!isCompany && !isLanding && (
              <Button
                onPress={() =>
                  navigateAuth({
                    newSession: true,
                    companyID: company ? company.id : companyID,
                  })
                }>
                <View m={0.75} mb={0.5} aI="center" fD="row">
                  <MaterialIcons name="login" size={18} color={iconColor} />
                  <Text s={17} style={{ marginLeft: 8 }} id="add_new_session" />
                </View>
              </Button>
            )}
            {!isCompany && !hideLogout && (
              <Button onPress={() => Modal.show()}>
                <View m={0.75} mb={0.5} aI="center" fD="row">
                  <MaterialIcons name="logout" size={18} color={iconColor} />
                  <Text
                    s={17}
                    style={{ marginLeft: 8 }}
                    id={hideApps ? 'logout_company' : 'logout_all'}
                    context={{ companyName }}></Text>
                </View>
              </Button>
            )}
          </View>
        </View>
      </View>
      {renderModal()}
    </React.Fragment>
  );
}

export default React.memo(CurrentSessions);
