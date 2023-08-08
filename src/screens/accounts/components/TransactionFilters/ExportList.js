import React from 'react';
// import { getExports } from 'util/rehive';
// import ExportListItem from './ExportListItem';
// import PaginationControls from 'components/lists/PaginationControls';
import { View, Button, Text } from 'components';
import { useInfiniteQuery } from 'react-query';
import { useRehiveContext } from 'contexts/RehiveContext';
import { getExports } from 'utility/rehive';
import { getQueryVariable } from 'utility/general';
import ExportListItemSkeleton from './ExportListItemSkeleton';
import ExportListItem from './ExportListItem';

export default function ExportList(props) {
  const { setId, showToast } = props;
  const {
    context: { user },
  } = useRehiveContext();

  const {
    data = {},
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery(
    [user?.id, 'transactions-exports'],
    ({ pageParam = 1 }) => getExports('transaction', pageParam),
    {
      enabled: !!user?.id,
      getNextPageParam: (lastGroup, allGroups) =>
        getQueryVariable(lastGroup?.next?.split('?')?.[1] ?? '', 'page') ||
        null,
      refetchInterval: 5000,
    },
  );

  const { pages = [], pageParams } = data;

  const items = pages?.map(item => item?.results)?.flat() ?? [];

  return (
    <View pb={0.5}>
      {isLoading ? (
        <View pb={1}>
          <ExportListItemSkeleton />
        </View>
      ) : (
        <View pb={1.5}>
          {items?.length > 0 ? (
            <React.Fragment>
              {items.map(item => (
                <ExportListItem
                  key={item.id}
                  item={item}
                  showToast={showToast}
                />
              ))}
              {/*
              <PaginationControls
                page={page}
                setPage={setPage}
                pageLast={pageLast}
              /> */}
            </React.Fragment>
          ) : (
            <Text tA="center" id="export_empty" />
          )}
        </View>
      )}
      <Button id="new_export" wide onPress={() => setId(null)} ns="accounts" />
    </View>
  );
}
