import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from './Icon';
import { useTheme } from '../context';
import Badge from './Badge';

const ListItem = props => {
  const {
    viewStyleContainer,
    viewStyleImage,
    viewStyleTitle,
    textStyleTitle,
    textStyleSubtitle,
    viewStyleSelected,
  } = styles;
  let {
    image,
    title,
    icon,
    subtitle,
    onPress,
    noImage,
    children,
    disabled,
    noTitle,
    height,
    width = 32,
    containerStyle,
    styleImage = {},
    styleSelected = {},
    selected,
  } = props;
  if (!height) {
    height = width;
  }
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      underlayColor={'#EFEFEF'}
      disabled={disabled}
      onPress={item => onPress(item)}>
      <View style={[viewStyleContainer, containerStyle]}>
        {!props.hideSelectedStyle && selected && (
          <View
            style={[
              viewStyleSelected,
              { backgroundColor: colors.primary },
              styleSelected,
            ]}
          />
        )}
        {!noImage ? (
          <View style={[viewStyleImage, styleImage]}>
            {Boolean(icon) && (
              <Icon
                size={32}
                name={icon}
                set={'MaterialIcons'}
                color={'primary'}
              />
            )}
            {image ? (
              <Image
                style={{ height, width, borderRadius: width }}
                source={{
                  uri: image,
                  // cache: 'only-if-cached',
                }}
                resizeMode={'contain'}
              />
            ) : (
              // <Image
              //   source={require('./../../../assets/icons/profile.png')}
              //   style={{ height, width, borderRadius: width }}
              // />
              <Badge
                radius={props.badgeRadius || 20}
                fontSize={props.badgeFontSize || 20}
                backgroundColor="#bdbdbd"
                title={title}
                color={colors.primaryContrast}
              />
            )}
          </View>
        ) : null}
        {!noTitle ? (
          <View style={viewStyleTitle}>
            {title ? (
              <Text
                style={textStyleTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
                id={title}>
                {title}
              </Text>
            ) : null}
            {!props.hideSubtitle && subtitle ? (
              <Text
                style={textStyleSubtitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : null}
        {children}
      </View>
    </TouchableHighlight>
  );
};

ListItem.propTypes = {
  image: PropTypes.string, // Text displayed on button
  title: PropTypes.string, // Animation type
  subtitle: PropTypes.string, // Animation type
  onPress: PropTypes.func, // Function to execute on press
  noImage: PropTypes.bool,
  noTitle: PropTypes.bool,
  subtitleID: PropTypes.string, // Animation type
  hideSubtitle: PropTypes.bool, // Animation type
};

ListItem.defaultProps = {
  image: '',
  title: '',
  subtitle: '',
  onPress: () => {},
  noImage: false,
  noTitle: false,
  subtitleID: '',
};

const ListSeparator = ({ style }) => {
  return (
    <View
      style={{
        backgroundColor: 'lightgrey',
        height: 0.5,
        marginHorizontal: 4,
        ...style,
      }}
    />
  );
};

const styles = StyleSheet.create({
  viewStyleContainer: {
    minHeight: 40,
    flexDirection: 'row',
    // backgroundColor: 'white',
  },
  viewStyleImage: {
    marginVertical: 8,
    marginHorizontal: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  viewStyleTitle: {
    justifyContent: 'center',
    paddingVertical: 2,
    flex: 1,
  },
  textStyleTitle: {
    fontSize: 14,
    color: '#434343',
  },
  textStyleSubtitle: {
    fontSize: 12,
    color: '#777',
    opacity: 0.9,
  },
  viewStyleSelected: {
    position: 'absolute',
    left: 0,
    top: 8,
    height: 40,
    width: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export { ListItem, ListSeparator };

/*
TODO:
1. Merge with Section list / think of better place to put this (BasicList?)

*/
