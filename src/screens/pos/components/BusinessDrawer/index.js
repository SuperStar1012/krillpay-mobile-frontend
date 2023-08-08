import React, { useRef, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import BusinessDrawerContent from './BusinessDrawerContent';
const SCREEN_WIDTH = Dimensions.get('window').width;

const BusinessDrawer = props => {
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
      <BusinessDrawerContent
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
      onDrawerOpen={handleDrawerOpen}
      onDrawerClose={handleDrawerClose}
      drawerWidth={SCREEN_WIDTH * 0.7}
      drawerType="front"
      drawerBackgroundColor="#ddd"
      renderNavigationView={renderNavigationView}>
      {children}
    </DrawerLayout>
  );
};

export default React.memo(BusinessDrawer);
