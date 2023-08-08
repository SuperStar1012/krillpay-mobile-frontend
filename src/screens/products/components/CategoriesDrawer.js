import React, { useRef, useEffect, useState } from 'react';
import { Dimensions, Pressable } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { CustomIcon, View } from 'components';
import CategoryFilter from 'components/filter/CategoryFilter';
import { useCart } from '../util/contexts/CartContext';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CategoriesDrawer(props) {
  const { children } = props;

  const cartContext = useCart();
  const { drawerOpen, hideDrawer } = cartContext;
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
    if (
      drawer &&
      drawer.current &&
      typeof drawer.current.openDrawer === 'function'
    ) {
      drawer.current.openDrawer();
      setIsOpen(true);
    }
  }

  function handleDrawerClose() {
    if (drawer && drawer.current) {
      drawer.current.closeDrawer();
      setIsOpen(false);
      typeof hideDrawer === 'function' && hideDrawer();
    }
  }

  function renderNavigationView() {
    return (
      <View ph={1} pt={0.75} pb={1} bC="white">
        <View fD="row" jC="flex-end" pb={0.75}>
          <Pressable onPress={handleDrawerClose}>
            <CustomIcon
              name={'close'}
              size={20}
              padded
              contained={false}
              // color="fontDark"
              color="#b9b9b9"
            />
          </Pressable>
        </View>

        <CategoryFilter
          handleDrawerClose={handleDrawerClose}
          {...props}
          context={cartContext}
        />
      </View>
    );
  }

  return (
    <DrawerLayout
      ref={drawer}
      onDrawerOpen={handleDrawerOpen}
      onDrawerClose={handleDrawerClose}
      drawerWidth={SCREEN_WIDTH * 0.9}
      drawerType="front"
      drawerBackgroundColor="#ddd"
      renderNavigationView={renderNavigationView}>
      {children}
    </DrawerLayout>
  );
}
