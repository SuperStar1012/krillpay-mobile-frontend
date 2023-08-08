import React from 'react';
import { View as _View, TouchableOpacity } from 'react-native';
// import PropTypes from 'prop-types';
import { View } from '../layout/View';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Text from '../outputs/Text';

function Card(props) {
  let {
    onPressContent,
    onPress,
    canEdit,
    design,
    noPadding,
    onPressContentDisabled,
    bC,
    renderHeader,
    shadow,
    cornerRadius,
    containerStyle,
    wrapperStyle,
    innerStyle = {},
    removeDefaultContainerStyle,
    disabled,
    label,
    children,
  } = props;

  const { _containerViewStyle, _wrapperViewStyle } = useStyles(props);

  if (!shadow && !cornerRadius && design) {
    ({ shadow, cornerRadius } = design);
  }

  const containerViewStyle = [containerStyle];

  if (!removeDefaultContainerStyle)
    containerViewStyle.unshift(_containerViewStyle);
  else
    containerViewStyle.unshift({
      borderRadius: 20,
    });

  const wrapperViewStyle = [
    _wrapperViewStyle,
    {
      borderRadius: 20,
    },
    wrapperStyle,
  ];

  return (
    <_View>
      {Boolean(label) && (
        <Text
          style={{
            fontSize: 12,
            color: '#777',
            opacity: 0.7,
            marginBottom: 4,
          }}>
          {label}
        </Text>
      )}
      <_View style={containerViewStyle}>
        <_View style={wrapperViewStyle}>
          <TouchableOpacity
            onPress={onPressContent ? onPressContent : onPress}
            activeOpacity={0.7}
            disabled={
              onPressContentDisabled || typeof onPressContent !== 'function'
            }>
            <View bC={bC ? bC : 'surfaceCard'}>
              {renderHeader ? <_View>{renderHeader}</_View> : null}
              {canEdit ? (
                <_View
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    padding: 8,
                    zIndex: 10,
                  }}>
                  <Icon name={'edit'} size={22} color={'#707070'} />
                </_View>
              ) : null}
              <View p={noPadding ? 0 : 1} style={{ ...innerStyle }}>
                {children}
              </View>
            </View>
          </TouchableOpacity>
        </_View>
      </_View>
    </_View>
  );
}

const useStyles = props => {
  return {
    _containerViewStyle: props?.noBorder
      ? {}
      : {
          borderWidth: 1,
          borderColor: 'lightgray',
          borderRadius: 20,
        },
    _wrapperViewStyle: {
      overflow: 'hidden',
    },
  };
};

export { Card };
