import React from 'react';
import PropTypes from 'prop-types';
import { View } from './View';
import Text from '../outputs/Text';
import Image from '../outputs/Image';

const Title = props => {
  let {
    title,
    subtitle,
    containerStyle,
    textStyleTitle,
    textStyleSubtitle,
    image,
    titleScale,
    subtitleScale,
  } = props;

  if (!title && !subtitle) {
    return null;
  }
  return (
    <View fD={'row'}>
      {image ? (
        <View
          style={{ marginRight: 16, borderRadius: 100 }}
          h={48}
          w={48}
          aI={'center'}
          jC={'center'}>
          <Image resizeMode={'contain'} src={image} width={40} height={40} />
        </View>
      ) : null}
      <View
        fD={'column'}
        aI={'flex-start'}
        jC={'center'}
        style={[
          {
            flex: 1,
            width: '100%',
          },
          containerStyle,
        ]}>
        {title ? (
          <Text t={titleScale} style={textStyleTitle}>
            {title}
          </Text>
        ) : null}
        <View pv={0.125} />
        {subtitle ? (
          <Text t={subtitleScale} o={0.8} style={textStyleSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  onPress: PropTypes.func,
  textStyleTitle: PropTypes.object,
  textStyleSubtitle: PropTypes.object,
  containerStyle: PropTypes.object,
  titleScale: PropTypes.string,
  subtitleScale: PropTypes.string,
};

Title.defaultProps = {
  title: '',
  subtitle: '',
  image: '',
  onPress: () => {},
  textStyleTitle: null,
  textStyleSubtitle: null,
  containerStyle: null,
  titleScale: 'h4',
  subtitleScale: 's1',
};

export default Title;
