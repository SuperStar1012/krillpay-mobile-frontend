import React, { Component } from 'react';
import Constants from 'expo-constants';
import { View, Text, NetInfo } from 'react-native';
import { HeaderButton } from './_move/HeaderButton';
import { useTheme } from './context';

const PageHeader = props => {
  const {
    navigation,
    back,
    title,
    renderRight,
    smallTitle,
    headerRightText,
    headerRightOnPress,
    headerRightIcon,
    onBack,
    noPadding,
  } = props;
  const { colors } = useTheme();

  return (
    <View
      style={{
        elevation: 2,
        zIndex: 2,
        paddingTop: noPadding ? 0 : Constants.statusBarHeight,
        backgroundColor: colors.header,
        // borderBottomColor: colors.grey2,
        // borderBottomWidth: 1,
      }}>
      <View style={styles.options}>
        <View style={[styles.left]}>
          {onBack || back ? (
            <HeaderButton
              onPress={() => (onBack ? onBack() : navigation.goBack())}
              style={{ padding: 20 }}
              icon="arrow-back"
            />
          ) : null}
        </View>
        <View style={[styles.title]}>
          {title ? (
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                styles.titleText,
                {
                  fontSize: smallTitle ? 16 : 20,
                  color: colors.headerContrast,
                },
              ]}>
              {title}
            </Text>
          ) : null}
        </View>
        <View style={[styles.rightIcon]}>
          {renderRight ? renderRight : null}
          {headerRightText || headerRightIcon ? (
            <HeaderButton
              text={headerRightText}
              onPress={headerRightOnPress}
              icon={headerRightIcon}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = {
  options: {
    width: '100%',
    flexDirection: 'row',
    height: 64,
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
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    paddingLeft: 0,
    textAlign: 'center',
  },
};

export default PageHeader;
