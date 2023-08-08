import React, { useState } from 'react';
import Constants from 'expo-constants';
import { Pressable, Text } from 'react-native';
import { View } from 'components/layout/View';
import _Text from 'components/outputs/Text';
import { HeaderButton } from '../inputs/HeaderButton';
import { useTheme } from 'contexts/ThemeContext';
import { useIsRTL } from 'hooks/general';

export default function Header(props) {
  const {
    navigation,
    creditSwitch,
    debitSwitch,
    back,
    id,
    title,
    renderRight,
    smallTitle,
    headerRightText,
    headerRightOnPress,
    headerRightIcon,
    noShadow,
    customBack,
    noPadding,
    customBackFunc,
    inverted,
    transparent,
    rightMenuItems = [],
    color: colorProp,
    // bC,
  } = props;

  const isRTL = useIsRTL();

  const [menuVisible, setMenuVisible] = useState(false);

  const { colors } = useTheme();

  const colorName = inverted || transparent ? 'font' : 'header';
  const color = colorProp ? colorProp : colors[colorName];
  const backgroundColor = transparent
    ? 'transparent'
    : inverted
    ? colors.header
    : colors.headerContrast;

  function renderMenu() {
    return (
      menuVisible && (
        <View style={{ position: 'relative' }}>
          <View
            p={1}
            bR={10}
            w={150}
            style={{
              position: 'absolute',
              right: 0,
              shadowColor: '#00000021',
              shadowOffset: { width: 1, height: 1 },
              overflow: 'none',
              shadowOpacity: 0.9,
              shadowRadius: 5,
              elevation: 10,
              backgroundColor: 'white',
            }}>
            {rightMenuItems?.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setMenuVisible(false);
                  item.onPress();
                }}>
                <View mb={index === rightMenuItems.length - 1 ? 0 : 1}>
                  <_Text
                    c={item.selected ? 'primary' : 'font'}
                    fW={item.selected ? '700' : '400'}
                    s={16}>
                    {item?.label}
                  </_Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )
    );
  }

  return (
    <View
      style={[
        {
          zIndex: 2,
          paddingTop: noPadding ? 0 : Constants.statusBarHeight,
          backgroundColor,
        },
        noShadow
          ? null
          : {
              borderBottomColor: colors.grey2,
            },
      ]}>
      {creditSwitch === false && debitSwitch === true && (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 20,
            backgroundColor: colors.red,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Deposits are temporarily disabled.
          </Text>
        </View>
      )}
      {debitSwitch === false && creditSwitch === true && (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 20,
            backgroundColor: colors.red,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Withdrawals are temporarily disabled.
          </Text>
        </View>
      )}
      {debitSwitch === false && creditSwitch === false && (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 20,
            backgroundColor: colors.red,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Transactions are temporarily disabled.
          </Text>
        </View>
      )}
      {/* {this.state.offline && (
        <View
          style={{
            paddingVertical: 4,
            backgroundColor: colors.red,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white' }}>No internet Connection</Text>
        </View>
      )}
      {this.state.online && (
        <View
          style={{
            paddingVertical: 4,
            backgroundColor: colors.green,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white' }}>Connected</Text>
        </View>
      )} */}
      <View style={styles.options}>
        <View style={[styles.left]}>
          {back ? (
            <HeaderButton
              onPress={() =>
                customBack
                  ? customBackFunc()
                  : navigation
                  ? navigation.goBack()
                  : null
              }
              icon={isRTL ? 'chevron-right' : 'chevron-left'}
              size={32}
              color={color ?? colorName}
            />
          ) : null}
        </View>
        <View style={[styles.title]}>
          {title || id ? (
            <Text
              id={id}
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                styles.titleText,
                {
                  fontSize: smallTitle ? 16 : 20,
                  color,
                },
              ]}>
              {title}
            </Text>
          ) : null}
        </View>
        <View style={[styles.rightIcon]}>
          {renderRight ? renderRight : null}
          {headerRightText || headerRightIcon || rightMenuItems?.length ? (
            <>
              <HeaderButton
                text={headerRightText}
                onPress={
                  headerRightOnPress ?? (() => setMenuVisible(!menuVisible))
                }
                icon={headerRightIcon ?? 'more-vert'}
                color={colorName}
              />
              {Boolean(rightMenuItems?.length) && renderMenu()}
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = {
  options: {
    width: '100%',
    flexDirection: 'row',
    height: 56,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 8,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    paddingLeft: 0,
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
  },
};
