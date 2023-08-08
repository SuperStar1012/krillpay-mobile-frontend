import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import EmailIcon from './ContactPlaceholder/email.svg';
import MobileIcon from './ContactPlaceholder/mobile.svg';

function ContactListItem(props) {
  const {
    viewStyleContainer,
    viewStyleImage,
    viewStyleTitle,
    textStyleTitle,
    textStyleSubtitle,
  } = styles;
  let { image, type, title, subtitle, onPress, width = 37 } = props;

  let height = width;

  return (
    <TouchableHighlight
      underlayColor={'#EFEFEF'}
      onPress={item => onPress(item)}>
      <View style={[viewStyleContainer]}>
        {
          <View style={[viewStyleImage]}>
            {image ? (
              <Image
                style={{ height, width, borderRadius: width }}
                source={{
                  uri: image,
                }}
                resizeMode={'contain'}
              />
            ) : type === 'email' ? (
              <EmailIcon height={height} width={width} />
            ) : (
              <MobileIcon height={height} width={width} />
            )}
          </View>
        }
        {
          <View style={viewStyleTitle}>
            {title ? <Text style={textStyleTitle}>{title}</Text> : null}
            {subtitle ? (
              <Text style={textStyleSubtitle}>{subtitle}</Text>
            ) : null}
          </View>
        }
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  viewStyleContainer: {
    minHeight: 40,
    flexDirection: 'row',
    paddingTop: 8,
  },
  viewStyleImage: {
    marginVertical: 8,
    marginHorizontal: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  viewStyleTitle: {
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  textStyleTitle: {
    fontSize: 18,
    color: '#434343',
    fontWeight: '600',
  },
  textStyleSubtitle: {
    fontFamily: 'Helvetica Neue',
    fontSize: 12,
    color: '#898989',
  },
});

export default ContactListItem;
