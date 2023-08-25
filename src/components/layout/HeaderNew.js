import React, { useState } from 'react';
import { View, Text } from 'components';
import {
  TouchableOpacity,
  Pressable,
  Dimensions,
  Modal,
  I18nManager,
} from 'react-native';
import { Icon } from 'components/outputs/Icon';
import { HeaderButton } from 'components/inputs/HeaderButton';
import Constants from 'expo-constants';
import { useRehiveContext } from 'contexts/RehiveContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function HeaderNew(props) {
  let {
    navigation,
    handleBack,
    title,
    color,
    onClose,
    actions,
    bC = 'white',
    dense,
    menuItems,
    ns,
    rightAction,
    context,
    bold,
    ...restProps
  } = props;
  const {
    context: { company },
  } = useRehiveContext();

  const isTestCompany = Boolean((company?.mode ?? '').match(/test|suspended/));

  const [menuVisible, setMenuVisible] = useState(false);

  if (typeof menuItems === 'function') menuItems = menuItems(props);

  function renderMenu() {
    return (
      menuVisible && (
        <Modal transparent={true}>
          <Pressable
            onPress={() => setMenuVisible(false)}
            style={{
              height: SCREEN_HEIGHT,
              width: SCREEN_WIDTH,
              backgroundColor: 'transparent',
            }}>
            <View
              p={1}
              bR={10}
              w={150}
              bC={'white'}
              style={{
                position: 'absolute',
                top: 10 + Constants.statusBarHeight + (isTestCompany ? 48 : 0),
                right: 10,
                shadowColor: '#000000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.9,
                shadowRadius: 5,
                elevation: 10,
                zIndex: 10000,
              }}>
              {menuItems?.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    typeof item.onPress === 'function' && item.onPress();
                    setMenuVisible(false);
                  }}>
                  <View mb={index === menuItems.length - 1 ? 0 : 1}>
                    <Text
                      c={item.selected ? 'primary' : 'font'}
                      fW={item.selected ? '700' : '400'}
                      s={16}
                      context={context}
                      id={item?.label}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )
    );
  }

  const showBack = Boolean(navigation || handleBack);

  return (
    <View bC={bC} style={{ zIndex: 1 }} {...restProps}>
      <View fD="row" jC="space-between" w="100%" style={{ zIndex: 10 }}>
        {showBack && <HeaderBackButton {...props} />}
        {actions}
        {Boolean(onClose) && (
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 'auto',
              maxWidth: 72,
              alignItems: 'flex-start',
              paddingRight: 24,
              paddingTop: 8,
            }}>
            <Icon
              set={'MaterialCommunityIcons'}
              name={'close'}
              size={22}
              color={color ?? 'fontDark'}
            />
          </TouchableOpacity>
        )}
        {rightAction}
      </View>
      {Boolean(title) && (
        <View
          p={0.25}
          pos={dense ? 'absolute' : 'relative'}
          w="100%"
          pt={dense || !showBack ? 0.75 : 0}>
          {typeof title === 'string' ? (
            <Text
              s={20}
              fW={bold || dense || !showBack ? '700' : '400'}
              c={color}
              tA="center"
              id={title}
              context={context}
              ns={ns}
            />
          ) : typeof title === 'object' ? (
            title
          ) : null}
        </View>
      )}
      {menuItems?.length > 0 && (
        <View pos={'absolute'} style={{ right: 0, zIndex: 10 }}>
          <HeaderButton
            onPress={() => setMenuVisible(!menuVisible)}
            icon={'more-vert'}
            color={color ?? 'fontDark'}
          />
        </View>
      )}

      {renderMenu()}
    </View>
  );
}

function HeaderBackButton(props) {
  const { handleBack, navigation, color, children, backIcon = {} } = props;

  return (
    <TouchableOpacity
      onPress={() => (handleBack ? handleBack() : navigation.goBack())}
      style={{
        width: 'auto',
        maxWidth: children ? 144 : 72,
        alignItems: 'center',
        paddingLeft: 16,
        paddingTop: 8,
        flexDirection: 'row',
      }}>
      <Icon
        set={'MaterialIcons'}
        // style={{ width: 'a' }}
        name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
        size={30}
        color={color ?? 'fontDark'}
        {...backIcon}
      />
      {children}
    </TouchableOpacity>
  );
}

export { HeaderBackButton };
