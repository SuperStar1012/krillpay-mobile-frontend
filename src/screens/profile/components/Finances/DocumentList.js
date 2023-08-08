import React, { useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { get, orderBy } from 'lodash';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import { View, Button, Text, OutputStatus } from 'components/index.js';
import EmptyListPlaceholderImage from 'components/outputs/CustomImage/empty/EmptyListPlaceholderImage';
import { useLanguage } from 'contexts/LanguageContext';
import { standardizeString } from 'utility/general';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function DocumentList(props) {
  const {
    data,
    onNewUpload,
    onDetail,
    setPreviewDoc,
    loading,
    refresh,
  } = props;
  const { viewStyleContainer } = styles;

  useEffect(() => {
    setPreviewDoc(false);
  }, []);

  const sortOrder = [
    'verified',
    'declined',
    'incomplete',
    'pending',
    'obsolete',
  ];

  const sortedData = orderBy(
    data.filter(item => item.document_category === 'proof_of_income'),
    ['created'],
    ['desc'],
  ).sort((a, b) => {
    return sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status);
  });
  const { lang } = useLanguage(); //TODO: get rid of this!

  return (
    <View style={viewStyleContainer}>
      <View
        style={{ maxHeight: SCREEN_HEIGHT / 2, borderRadius: 5 }}
        bC={'surface'}>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          // contentContainerStyle={data && data.length ? {} : { height: '100%' }}
          data={sortedData}
          showsHorizontalScrollIndicator={false}
          refreshing={loading ?? false}
          onRefresh={() => refresh()}
          // refreshControl={
          //   loading ? (
          //     <View mb={1}>
          //       <SkeletonPlaceholder>
          //         <SkeletonPlaceholder.Item
          //           width={150}
          //           height={16}
          //           borderRadius={50}
          //         />
          //       </SkeletonPlaceholder>
          //       <View>
          //         <SkeletonPlaceholder>
          //           <SkeletonPlaceholder.Item
          //             width={100}
          //             height={8}
          //             borderRadius={50}
          //           />
          //         </SkeletonPlaceholder>
          //       </View>
          //     </View>
          //   ) : null
          // }
          ListEmptyComponent={
            loading ? (
              <View mb={1}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    width={150}
                    height={16}
                    borderRadius={50}
                  />
                </SkeletonPlaceholder>
                <View>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                      width={100}
                      height={8}
                      borderRadius={50}
                    />
                  </SkeletonPlaceholder>
                </View>
              </View>
            ) : (
              <Text p={0.5} tA="center" id="document_empty" />
            )
          }
          renderItem={({ item, index }) => (
            <UploadedDocumentListItem
              item={item}
              lang={lang}
              index={index}
              onDetail={() => onDetail(item)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <View pt={1} pb={2}>
        <Button id="upload_document" wide onPress={() => onNewUpload()} />
      </View>
    </View>
  );
}

const UploadedDocumentListItem = props => {
  const { item, index, onDetail, lang } = props;
  const id = get(item, 'document_type');
  return (
    <OutputStatus
      label={`${lang?.[id] ?? standardizeString(id)} ${
        item.metadata?.side === 'front'
          ? '(Front)'
          : item.metadata?.side === 'back'
          ? '(Back)'
          : ''
      }`}
      value={moment(get(item, 'created')).format('lll')}
      status={item.status.toUpperCase()}
      note={item.note}
      onPress={() => onDetail(index)}
    />
  );
};

const styles = {
  viewStyleContainer: {
    justifyContent: 'flex-start',
  },
};
