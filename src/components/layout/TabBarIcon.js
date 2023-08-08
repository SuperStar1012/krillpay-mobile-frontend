import React from 'react';
import { View, Text, Image } from 'react-native';
import { Icon } from 'components/outputs/Icon';
import { useTheme } from 'contexts/ThemeContext';
import { useRehiveContext } from 'contexts/RehiveContext';

const configs = {
  PoSProducts: {
    icon: 'add-shopping-cart',
    set: 'MaterialIcons',
    label: 'Products',
  },
  PoSCustom: {
    icon: 'view-grid-plus',
    set: 'MaterialCommunityIcons',
    label: 'Custom',
  },
  StaticQR: {
    icon: 'qrcode',
    set: 'FontAwesome',
    label: 'QR',
  },
};

export default function NavigationIcon(props) {
  const { routeName, focused } = props;
  const {
    context: { user },
    config: { menuConfig },
  } = useRehiveContext();
  const color = focused ? 'tabNavigatorActive' : 'tabNavigatorInactive';
  const { colors, design } = useTheme();

  const config = menuConfig?.items?.find(
    item => item.name === routeName.toLowerCase(),
  );

  function renderIcon() {
    const { imageStylePhoto } = styles;

    let iconName;

    switch (routeName) {
      case 'Home':
        iconName = `home${focused ? '' : '-outline'}`;
        break;
      case 'Wallets':
        iconName = `wallet${focused ? '' : '-outline'}`;
        break;
      case 'Rewards':
        iconName = `gift${focused ? '' : '-outline'}`;
        break;
      case 'Exchange':
        iconName = `swap-horizontal-circle${focused ? '' : '-outline'}`;
        break;
      case 'Product':
        iconName = `cart${focused ? '' : '-outline'}`;
        break;
    }

    switch (routeName) {
      case 'Profile':
        if (user?.profile) {
          return (
            <Image
              style={[
                imageStylePhoto,
                {
                  borderColor: colors[color],
                  borderWidth: focused ? 2 : 1,
                },
              ]}
              source={{
                uri: user.profile,
              }}
            />
          );
        }
        return (
          <Icon
            contained={false}
            set="MaterialIcons"
            name={'person-outline'}
            size={32}
            color={color}
          />
        );
      default:
        const conf = config ? config : configs?.[routeName];
        return (
          <Icon
            contained={false}
            set={conf?.set ?? 'MaterialCommunityIcons'}
            name={conf?.icon ?? iconName}
            size={32}
            color={color}
          />
        );
    }
  }

  function renderText() {
    const { routeName } = props;
    if (design?.app?.tabBarLabels) {
      return (
        <Text style={[styles._textStyle, { color: colors[color] }]}>
          {routeName.toUpperCase()}
        </Text>
      );
    }
    return null;
  }

  return (
    <View style={styles._containerStyle}>
      {renderIcon()}
      {renderText()}
    </View>
  );
}

const styles = {
  _containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  _textStyle: {
    textAlign: 'center',
    fontSize: 9,
  },
  imageStylePhoto: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
};
