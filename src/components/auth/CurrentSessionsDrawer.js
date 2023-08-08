import React, { useRef, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import CurrentSessions from 'components/auth/CurrentSessions';
import { useIsRTL } from 'hooks/general';
const SCREEN_WIDTH = Dimensions.get('window').width;

const CurrentSessionsDrawer = props => {
  const {
    children,
    drawerOpen,
    hideDrawer,
    isCompany,
    onBack,
    navigation,
    isLanding,
    handleVerifyToken,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const drawer = useRef(null);
  const isRTL = useIsRTL();

  useEffect(() => {
    if (drawerOpen !== isOpen) {
      if (drawerOpen) {
        handleDrawerOpen();
      } else {
        handleDrawerClose();
      }
    }
  }, [drawerOpen]);

  function handleDrawerOpen() {
    if (drawer && drawer.current) {
      drawer.current.openDrawer();
      setIsOpen(true);
    }
  }

  function handleDrawerClose() {
    if (drawer && drawer.current) {
      drawer.current.closeDrawer();
      setIsOpen(false);
      hideDrawer();
    }
  }

  function handleSuccess(item) {
    if (item && item.newApp) {
      onBack();
    } else if (handleVerifyToken && item) {
      const { companyID, token, user } = item;
      handleVerifyToken(token, companyID, user ? user.id : '');
    } else if (isLanding) {
      onBack();
    }
    if (hideDrawer) {
      handleDrawerClose();
    }
  }

  function renderNavigationView() {
    return (
      <CurrentSessions
        navigation={navigation}
        hideDrawer={handleDrawerClose}
        onSuccess={handleSuccess}
        isCompany={isCompany}
        isLanding={isLanding}
      />
    );
  }

  return (
    <DrawerLayout
      ref={drawer}
      drawerPosition={isRTL ? 'right' : 'left'}
      onDrawerOpen={handleDrawerOpen}
      onDrawerClose={handleDrawerClose}
      drawerWidth={SCREEN_WIDTH * 0.9}
      drawerType={'front'}
      drawerBackgroundColor="#ddd"
      renderNavigationView={renderNavigationView}>
      {children}
    </DrawerLayout>
  );
};

export default React.memo(CurrentSessionsDrawer);
