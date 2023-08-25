import React from 'react';
import { Dimensions, Image } from 'react-native';
import { get } from 'lodash';

import { View, Text, PopUpGeneral } from 'components';
import moment from 'moment';
import lang from '../../config/profile_en.json';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DocumentDetailModal = props => {
  const { documents, modalVisible, index, category, onDismiss } = props;
  const item = documents.items.filter(
    item => item.document_category === category,
  )[index];
  const { viewStyleImageContainer, viewStyleFooter } = styles;
  const width = SCREEN_WIDTH - 64;
  const height = width;
  const file = get(item, 'file', '');
  return (
    <PopUpGeneral
      visible={modalVisible}
      title={lang[get(item, 'document_type')]}
      onDismiss={onDismiss}
      iconTitleRight={'close'}
      onPressTitleRight={onDismiss}>
      <View style={viewStyleImageContainer}>
        {file.includes('pdf') ? (
          <Text p={1} tA={'center'}>
            {lang.error_display}
          </Text>
        ) : (
          <Image
            style={{ height, width, borderRadius: 4 }}
            source={{ uri: file }}
            resizeMode={'contain'}
          />
        )}
      </View>

      <View style={viewStyleFooter}>
        <View>
          <Text style={{ padding: 0, margin: 0 }}>
            {moment(get(item, 'created')).format('lll')}
          </Text>
        </View>
        <View>
          <Text style={{ padding: 0, margin: 0 }}>{get(item, 'status')}</Text>
        </View>
      </View>
    </PopUpGeneral>
  );
};

const styles = {
  viewStyleFooter: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewStyleImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
};

export default DocumentDetailModal;
