import React from 'react';
import PropTypes from 'prop-types';

import { View } from '../layout/View';
import { CardTitle } from './CardTitle';
import { CardActions } from './CardActions';
import { Icon } from '../outputs/Icon';

const CardLayout = props => {
  const {
    titleObj,
    actionOne,
    actionTwo,
    other,
    actionFooter,
    children,
    canEdit,
    design,
    hideAction,
  } = props;

  let Title = (
    <CardTitle
      titleObj={{ ...design?.title, ...titleObj }}
      textStyleTitle={{ fontSize: 20 }}
    />
  );
  switch (design?.layout) {
    case 'mini':
    case 'rightAction':
      return (
        <View fD="row">
          <View>
            {Title}
            <View>
              {canEdit ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    padding: 8,
                    zIndex: 10,
                  }}>
                  <Icon
                    name={'edit'}
                    size={22}
                    color={colorIcon ? colorIcon : colors.grey2}
                  />
                </View>
              ) : null}
              <View fD={'row'}>
                {children}
                {!hideAction ? (
                  <CardActions
                    type={'vertical'}
                    buttonType={design?.actionButtonsType}
                    other={other}
                    actionOne={actionOne}
                    actionTwo={actionTwo}
                    actionFooter={actionFooter}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>
      );

    case 'material':
      return (
        <View>
          <View>
            {Title}
            {children}
          </View>

          <CardActions
            buttonType={design?.actionButtonsType}
            actionOne={actionOne}
            actionTwo={actionTwo}
            other={other}
            actionFooter={actionFooter}
          />
        </View>
      );
    case 'centerAction':
      return (
        <View>
          <View>
            {Title}
            {children}
          </View>

          <CardActions
            type={'center'}
            buttonType={design?.actionButtonsType}
            actionOne={actionOne}
            other={other}
            actionTwo={actionTwo}
            actionFooter={actionFooter}
          />
        </View>
      );

    case 'title':
      return (
        <View>
          {Title}

          <CardActions
            buttonType={design?.actionButtonsType}
            actionOne={actionOne}
            actionTwo={actionTwo}
            other={other}
            actionFooter={actionFooter}
          />
        </View>
      );

    default:
      return (
        <View fD={'column'}>
          {Title}
          <View fD={'row'} w={'100%'} f={1}>
            <View w={'100%'}>{children}</View>
            <CardActions
              buttonType={design?.actionButtonType}
              type={'vertical'}
              actionOne={actionOne}
              actionTwo={actionTwo}
              other={other}
              actionFooter={actionFooter}
            />
          </View>
        </View>
      );
  }
};

CardLayout.propTypes = {
  titleObj: PropTypes.object,
  actionOne: PropTypes.object,
  actionTwo: PropTypes.object,
};

CardLayout.defaultProps = {
  titleObj: { title: '', subtitle: '', onPress: () => {}, icon: '', badge: '' },
  actionOne: { label: '', onPress: () => {}, loading: false, disabled: false },
  actionTwo: { label: '', onPress: () => {}, loading: false, disabled: false },
};

// const CardLayout = context(_CardLayout);

export { CardLayout };
