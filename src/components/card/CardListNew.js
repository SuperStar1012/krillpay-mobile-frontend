import React, { useEffect } from 'react';
import { FlatList } from 'react-native';

import { View } from '../layout/View';
import PaginationListFooter from '../layout/PaginationListFooter';
import EmptyListPlaceholderImage from '../outputs/CustomImage/empty/EmptyListPlaceholderImage';

export default function CardList(props) {
  const {
    renderItem,
    keyExtractor,
    onRefresh,
    getNext,
    horizontal,
    type,
    renderHeader,
    numColumns,
    renderHeaderFixed,
    data = {},
  } = props;

  useEffect(() => {
    if (typeof onRefresh === 'function') onRefresh();
  }, []);

  const { items, more, loading, nextLoading } = data;

  return (
    <View f={1} keyboardAvoiding>
      {typeof renderHeaderFixed === 'object' ? renderHeaderFixed : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingHorizontal: horizontal ? 8 : 0,
          },
          !(items && items.length) ? { height: '90%' } : {},
        ]}
        horizontal={horizontal}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={loading ? loading : false}
        //     onRefresh={() => (onRefresh ? onRefresh : null)}
        //     // colors={[colors.primary]} // TODO: move this to a new context component
        //   />
        // }
        refreshing={loading ? loading : false}
        onRefresh={() => (onRefresh ? onRefresh() : null)}
        keyboardShouldPersistTaps={'handled'}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          keyExtractor
            ? keyExtractor(item)
            : item?.id
            ? item?.id.toString()
            : index
        }
        numColumns={numColumns}
        ListEmptyComponent={
          Boolean(!loading && type) && <EmptyListPlaceholderImage id={type} />
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

      {/* {this.renderModal()} */}
    </View>
  );
}

// CardList.defaultProps = {
//   onRefresh: () => {},
//   horizontal: false,
// };

// CardList.propTypes = {
//   onRefresh: PropTypes.func,
//   horizontal: PropTypes.bool,
// };
