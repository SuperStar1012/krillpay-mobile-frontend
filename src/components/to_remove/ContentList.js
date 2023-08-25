import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import RefreshControl from './RefreshControl';
import { CardListHeader, EmptyListMessage, View } from 'components';
import PaginationListFooter from 'components/layout/PaginationListFooter';
import EmptyListPlaceholderImage from 'components/outputs/CustomImage/empty/EmptyListPlaceholderImage';

const ContentList = props => {
  const {
    data,
    loading,
    error,
    type,
    keyExtractor,
    onRefresh,
    header,
    getNext,
    horizontal,
    renderItem,
    more,
    nextLoading,
    renderHeader,
    emptyListMessage,
    padded,
  } = props;

  useEffect(() => {
    if (onRefresh) {
      onRefresh();
    }
    // return () => {
    //   cleanup
    // }; // TODO: stop refresh!?
  }, []);

  return (
    <React.Fragment>
      {header ? <CardListHeader header={header} /> : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingHorizontal: horizontal || padded ? 8 : 0,
            paddingBottom: 18,
            // flex: 1,
          },
          // data && data.length ? { height: '90%' } : {},
        ]}
        // horizontal={horizontal}
        // refreshControl={
        //   <RefreshControl  />
        // }
        refreshing={loading}
        onRefresh={() => onRefresh()}
        keyboardShouldPersistTaps={'handled'}
        data={data}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={item =>
          keyExtractor ? keyExtractor(item) : item.id ? item.id.toString() : '0'
        }
        ListEmptyComponent={
          !loading && (
            <EmptyListPlaceholderImage name={type} text={emptyListMessage} />
          )
        }
        ListHeaderComponent={renderHeader ? renderHeader : null}
        ListFooterComponent={
          <PaginationListFooter
            next={more && !loading}
            loading={nextLoading}
            getNext={getNext}
          />
        }
      />
    </React.Fragment>
  );
};

ContentList.defaultProps = {
  onRefresh: () => {},
  horizontal: false,
};

ContentList.propTypes = {
  onRefresh: PropTypes.func,
  horizontal: PropTypes.bool,
};

export default ContentList;
