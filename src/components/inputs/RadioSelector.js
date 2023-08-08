import React from 'react';
import { TouchableOpacity } from 'react-native';
import Text from 'components/outputs/Text';
import { useTheme } from 'contexts/ThemeContext';
import { View } from 'components/layout/View';

export default function RadioSelector(props) {
  const { title, items, altStyle } = props;
  const { colors } = useTheme();

  const { textStyleTitle, viewStyleContainer, viewStyleContainerRow } = altStyle
    ? altStyles
    : styles;

  const rowStyle = altStyle && items.length < 3;

  return (
    <View style={rowStyle ? viewStyleContainerRow : viewStyleContainer}>
      {title && <Text style={textStyleTitle} id={title} />}
      <View>
        {items.map(item => (
          <RadioItem
            {...props}
            colors={colors}
            key={item?.id ?? item?.label}
            item={item}
          />
        ))}
      </View>
    </View>
  );
}

function RadioItem(props) {
  const {
    value,
    handleChange = () => {},
    nullable,
    item,
    altStyle,
    colors,
    size,
  } = props;

  const {
    viewStyleRadioContainer,
    textStyleLabel,
    viewStyleCircle,
    styleInnerCircle,
    styleOuterCircle,
  } = altStyle ? altStyles : styles;
  const selected = value && value === (item?.value ?? item?.id);

  const label = item?.label ? item?.label : item?.name;

  return (
    <TouchableOpacity
      key={item.value}
      style={viewStyleRadioContainer}
      onPress={() =>
        handleChange(selected && nullable ? null : item.value ?? item.id)
      }>
      <View style={viewStyleCircle}>
        <View
          style={[
            size === 'small' ? styles.styleOuterCircleSmall : styleOuterCircle,
            {
              borderColor: colors?.[selected ? 'primary' : 'font'],
            },
          ]}>
          {selected ? (
            <View
              bC={'primary'}
              style={
                size === 'small'
                  ? styles.styleInnerCircleSmall
                  : styleInnerCircle
              }
            />
          ) : null}
        </View>
      </View>
      {label && (
        <Text
          // adjustsFontSizeToFit //={false}
          // s={size === 'small' ? 14 : 16}
          style={textStyleLabel}
          id={label}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = {
  viewStyleContainer: {},
  viewStyleRadioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStyleCircle: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  styleOuterCircle: {
    borderRadius: 12,
    width: 20,
    height: 20,
    borderWidth: 2,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  styleOuterCircleSmall: {
    borderRadius: 12,
    width: 16,
    height: 16,
    borderWidth: 2,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  styleInnerCircle: {
    borderRadius: 8,
    width: 11,
    height: 11,
    // backgroundColor: 'black',
    // opacity: 0.7,
  },
  styleInnerCircleSmall: {
    borderRadius: 8,
    width: 8,
    height: 8,
    // backgroundColor: 'black',
    // opacity: 0.7,
  },
  textStyleLabel: {
    paddingLeft: 4,
  },
  textStyleTitle: {
    fontSize: 12,
    color: 'black',
    opacity: 0.7,
    paddingTop: 8,
  },
};

const altStyles = {
  viewStyleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  viewStyleContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  viewStyleRadioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStyleCircle: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  styleOuterCircle: {
    borderRadius: 12,
    width: 20,
    height: 20,
    borderWidth: 2,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  styleInnerCircle: {
    borderRadius: 8,
    width: 11,
    height: 11,
    backgroundColor: 'black',
    opacity: 0.7,
  },
  textStyleLabel: {
    paddingLeft: 4,
  },
  textStyleTitle: {
    fontSize: 12,
    color: 'black',
    opacity: 0.7,
    paddingTop: 8,
  },
};
