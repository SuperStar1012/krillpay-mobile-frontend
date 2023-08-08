import React from 'react';
import PropTypes from 'prop-types';

import { MaterialIcons as Icon } from '@expo/vector-icons';

import context from '../context';
import { Button } from '../inputs/Button';
import { View } from '../layout/View';

const _CardActions = props => {
  const { iconStyleFooter } = styles;

  const {
    actionOne,
    actionTwo,
    other,
    actionFooter,
    loading,
    colors,
    design,
    type,
    buttonType,
    pt = 1,
  } = props;

  if (
    !(actionOne.label || actionOne.text || actionOne.id) &&
    !(actionTwo.label || actionOne.text || actionTwo.id) &&
    !actionFooter.icon
  ) {
    return null;
  }

  const ButtonOne =
    actionOne.label || actionOne.text || actionOne.id ? (
      <Button
        type={
          actionOne.type
            ? actionOne.type
            : buttonType
            ? buttonType
            : design.cards.actionButtonType === 'button' || type === 'vertical'
            ? 'contained'
            : 'text'
        }
        color={
          actionOne.color
            ? actionOne.color
            : buttonType === 'contained' ||
              design.cards.actionButtonType === 'button' ||
              type === 'vertical'
            ? 'primary'
            : 'font'
        }
        wide={type === 'vertical' ? true : false}
        id={actionOne.id ?? actionOne.label ?? actionOne.text}
        // size={type === 'vertical' ? 'small' : ''}
        disabled={actionOne.disabled || loading}
        loading={actionOne.loading || loading}
        onPress={actionOne.onPress}
        buttonStyle={{ ...actionOne.style, margin: 18 }}
      />
    ) : null;

  const ButtonTwo =
    actionTwo.label || actionTwo.text || actionTwo.id ? (
      <Button
        type={
          actionTwo.type
            ? actionTwo.type
            : buttonType
            ? buttonType
            : design.cards.actionButtonType === 'button' || type === 'vertical'
            ? 'contained'
            : 'text'
        }
        color={
          actionTwo.color
            ? actionTwo.color
            : buttonType === 'contained' ||
              design.cards.actionButtonType === 'button' ||
              type === 'vertical'
            ? 'primary'
            : 'font'
        }
        id={actionTwo.id ?? actionTwo.label ?? actionTwo.text}
        // size={type === 'vertical' ? 'small' : ''}
        wide={type === 'vertical' ? true : false}
        disabled={actionTwo.disabled}
        onPress={actionTwo.onPress}
        buttonStyle={{ ...actionTwo.style, margin: 18 }}
      />
    ) : null;

  const IconFooter =
    actionFooter && actionFooter.icon ? (
      <Icon
        style={iconStyleFooter}
        name={actionFooter.icon}
        size={28}
        onPress={() => actionFooter.onPress()}
        color={colors.grey3}
      />
    ) : (
      <View />
    );

  if (type === 'vertical') {
    return (
      <View fD={'column'} jC={'flex-end'} aI={'center'} pt={pt}>
        {ButtonTwo}
        {ButtonOne}
        {other ? other : IconFooter}
      </View>
    );
  } else if (type === 'center') {
    return (
      <View fD={'row'} jC={'center'} aI={'center'}>
        {ButtonTwo}
        {ButtonOne}
        {other ? other : IconFooter}
      </View>
    );
  }

  return (
    <View fD={'row'} aI={'flex-end'} jC={'space-between'}>
      <View>{other ? other : IconFooter}</View>
      <View fD={'row'} jC={'flex-end'}>
        {ButtonTwo}
        {ButtonOne}
      </View>
    </View>
  );
};

_CardActions.defaultProps = {
  actionOne: { label: '', onPress: () => {}, loading: false, disabled: false },
  actionTwo: { label: '', onPress: () => {}, loading: false, disabled: false },
  actionFooter: { icon: '', onPress: () => {} },
};

_CardActions.propTypes = {
  actionOne: PropTypes.object,
  actionTwo: PropTypes.object,
};

const styles = {
  iconStyleFooter: {
    padding: 12,
    paddingLeft: 0,
  },
  viewStyleFooter: {
    flexDirection: 'row',
    height: 52 / 2,
    width: '100%',

    backgroundColor: 'white',
  },
  viewStyleActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: 52,
    // padding: 8,
  },
};

const CardActions = context(_CardActions);

export { CardActions };
