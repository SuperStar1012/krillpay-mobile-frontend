import React, { Component } from 'react';
import PropTypes from 'prop-types';

import context from '../context';
import { Button } from '../inputs/Button';
import { View } from '../layout/View';
import Text from '../outputs/Text';

class _CardListHeader extends Component {
  render() {
    const { header } = this.props;

    const {
      component,
      onRefresh,
      showRefresh,
      label,
      action,
      onPress,
    } = header;

    return component ? (
      component
    ) : label || action ? (
      <View
        fD={'row'}
        jC={'space-between'}
        aI={'center'}
        style={{ zIndex: 20 }}>
        <View fD={'row'} jC={'flex-start'} aI={'center'}>
          <Text ph={1} fW={'500'} s={20}>
            {label}
          </Text>
          {showRefresh ? (
            <Button
              buttonStyle={{ padding: 0, minWidth: 0 }}
              type={'text'}
              icon={'refresh'}
              color={'font'}
              size={'tiny'}
              onPress={onRefresh}
              animation={'fadeIn'}
            />
          ) : null}
        </View>

        {header.action ? (
          <Button
            buttonStyle={{ padding: 0, paddingTop: 8 }}
            label={action}
            onPress={onPress}
            size={'tiny'}
            type={'text'}
            color={'font'}
            animation={'fadeIn'}
          />
        ) : null}
      </View>
    ) : null;
  }
}

_CardListHeader.defaultProps = {
  header: { label: '', onPress: () => {}, component: null },
};

_CardListHeader.propTypes = {
  header: PropTypes.object,
};

const CardListHeader = context(_CardListHeader);

export { CardListHeader };
