import React from 'react';
import PropTypes from 'prop-types';
import { View } from '../layout/View';
import CurrencyBadge from '../outputs/CurrencyBadge';
import { Icon } from '../outputs/Icon';
import Text from '../outputs/Text';
import { CustomIcon } from '../outputs/CustomIcon';

const CardTitle = props => {
  let {
    title,
    subtitle,
    titleObj,
    onPress,
    textStyleTitle,
    textStyleSubtitle,
    icon,
    customIcon,
    right,
    badge,
    titleScale = 'h4',
    subtitleScale = 's1',
    iconSize = 48,
    iconPadded = true,
  } = props;

  if (titleObj.title || titleObj.subtitle) {
    ({ title, subtitle, onPress, icon } = titleObj);
  }

  if (titleObj.titleScale) {
    ({ titleScale } = titleObj);
  }

  if (titleObj.badge) {
    ({ badge } = titleObj);
  }

  if (!title && !subtitle) {
    return null;
  }

  return (
    <View fD={'row'}>
      {badge ? (
        <View jC={'center'} style={{ paddingRight: 16 }}>
          <CurrencyBadge
            text={badge}
            radius={24}
            currency={titleObj.currency}
          />
        </View>
      ) : customIcon ? (
        <View jC={'center'} style={{ paddingRight: 16 }}>
          <CustomIcon name={customIcon} size={iconSize} padded={iconPadded} />
        </View>
      ) : icon ? (
        <View
          style={{ marginRight: 16, borderRadius: 100 }}
          h={48}
          w={48}
          bC={'grey2'}
          aI={'center'}
          jC={'center'}>
          <Icon
            name={icon}
            size={24}
            set={
              icon.match(/gift|view-headline|ticket-percent/)
                ? 'MaterialCommunityIcons'
                : 'MaterialIcons'
            }
            color={'primary'}
          />
        </View>
      ) : null}
      <View fD={'column'} aI={right ? 'flex-end' : 'flex-start'} jC={'center'}>
        {title ? <Text s={20} fW={'500'} id={title}></Text> : null}
        {subtitle ? (
          <Text s={14} fW={'400'}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {titleObj.onClose ? (
        <View mr={0.25} aI={'flex-end'} fG={1}>
          <Icon size={24} name={'md-close'} color="grey2" />
        </View>
      ) : null}
    </View>
  );
};

CardTitle.propTypes = {
  titleObj: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
  textStyleTitle: PropTypes.object,
  textStyleSubtitle: PropTypes.object,
  viewStyleContainer: PropTypes.object,
};

CardTitle.defaultProps = {
  titleObj: { title: '', subtitle: '', onPress: () => {} },
  title: '',
  subtitle: '',
  onPress: () => {},
  textStyleTitle: null,
  textStyleSubtitle: null,
  containerStyle: null,
};

export { CardTitle };
