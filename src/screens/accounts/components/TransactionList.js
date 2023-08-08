import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import TransactionListItem from './TransactionListItem';
import { Text, View } from 'components';
import PaginationListFooter from 'components/layout/PaginationListFooter';
import Corner from './Corner';
import { useInfiniteQuery, useQuery } from 'react-query';
import {
  getQueryVariable,
  generateQueryString,
  flattenPaginatedData,
} from 'utility/general';
import {
  getTransactions,
  getSubtypes,
  getPaymentRequests,
} from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import IconButton from 'components/inputs/IconButton';
import { useModal } from 'utility/hooks';
import TransactionFilters from './TransactionFilters';
import { fetchAccounts } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { orderBy, isEmpty } from 'lodash';
import EmptyListPlaceholder from 'components/images/empty';

export default function TransactionList(props) {
  const {
    wallet = {},
    hideCorner,
    headerNoPadding,
    showFilters,
    c,
    navigation,
  } = props;
  const {
    context: { user, services },
  } = useRehiveContext();
  const { account, currency } = wallet;

  const [filters, setFilters] = useState({});
  const allFilters = {
    account: account,
    currency: currency?.code,
    ...(typeof filters === 'object' ? filters : {}),
  };

  const dispatch = useDispatch();

  const enabled = Boolean(wallet && user?.id);

  const {
    data: dataTransactions = {},
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery(
    [user?.id, 'transactions', allFilters],
    ({ pageParam = 1 }) =>
      getTransactions({
        ...allFilters,
        page: pageParam,
      }), // pagination:'cursor',
    {
      enabled,
      getNextPageParam: (lastGroup, allGroups) =>
        getQueryVariable(lastGroup?.next?.split('?')?.[1] ?? '', 'page') ||
        null,
    },
  );

  const { data: subtypes = [], isLoading: isLoadingSubtypes } = useQuery(
    [user?.id, 'subtypes'],
    getSubtypes,
    {
      enabled,
    },
  );

  // // Prefetch the next page!
  // useEffect(() => {
  //   if (data?.hasMore) {
  //     queryClient.prefetchQuery(['projects', page + 1], () =>
  //       fetchProjects(page + 1)
  //     )
  //   }
  // }, [data, page, queryClient])

  const {
    data: dataRequests = [],
    isLoading: isRequestLoading,
    refetch: refetchRequests,
  } = useQuery(
    [user?.id, 'payment-requests'],
    () => getRequests({ currency, user }), // pagination:'cursor',
    {
      enabled:
        enabled &&
        (services?.['Payment Requests Service (beta)'] ||
          services?.['Payment Requests Service']),
    },
  );

  const transactions = flattenPaginatedData(dataTransactions);

  const data = orderBy(
    [
      ...(transactions ?? []),
      ...((isEmpty(filters) ? dataRequests : []) ?? []),
    ],
    ['created'],
    ['desc'],
  );

  const { showModal, hideModal, modalVisible } = useModal();

  useEffect(() => {
    handleRefresh();
  }, []);

  function handleRefresh() {
    refetch();
    refetchRequests();
    dispatch(fetchAccounts());
  }

  function handleNext() {
    fetchNextPage();
  }

  const refreshing =
    isLoading || (isFetching && !hasNextPage) || isRequestLoading;

  const nav = c => {
    navigation.navigate('Send', { c });
  };
  return (
    <View f={1} bC={'white'}>
      {!hideCorner && <Corner color="primary" />}
      <View
        fD="row"
        jC="space-between"
        // f={1}
        w="100%"
        pv={headerNoPadding ? 0.25 : 0.5}
        pl={1}
        pt={headerNoPadding ? 0 : 1}>
        <Text t={'b1'} fW={'500'} s={20} id="transactions" />
        {showFilters && (
          <View fD="row">
            <IconButton
              icon="filter-list"
              set="MaterialIcons"
              contained={false}
              size={28}
              padded={false}
              mr={1}
              // disabled={!cart || !cart?.total_price}
              onPress={() => showModal('filter')}
            />
            <IconButton
              icon="file-download"
              set="MaterialIcons"
              contained={false}
              size={28}
              padded={false}
              mr={1}
              // disabled={!cart || !cart?.total_price}
              onPress={() => showModal('export')}
            />
          </View>
        )}
      </View>
      <FlatList
        contentContainerStyle={
          data?.length ? { paddingBottom: 8 } : { flex: 1 }
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        data={data}
        renderItem={({ item }) => (
          <TransactionListItem
            nav={nav}
            {...props}
            item={item}
            crypto={wallet?.crypto}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          !isLoading && (
            <View pt={2}>
              <EmptyListPlaceholder
                size={100}
                name="transactions"
                text="transactions_empty"
              />
            </View>
          )
        }
        ListFooterComponent={
          transactions?.length && (
            <PaginationListFooter
              next={hasNextPage}
              loading={!isLoading && isFetching} // TODO:
              getNext={handleNext}
            />
          )
        }
      />
      {!!modalVisible && (
        <TransactionFilters
          currency={currency}
          id={modalVisible}
          onDismiss={hideModal}
          filters={filters}
          setFilters={setFilters}
          subtypes={subtypes}
          allFilters={allFilters}
        />
      )}
    </View>
  );
}
// async function openBrowser(transaction) {
//   const metadata = transaction.metadata;

//   if (metadata && metadata.type) {
//     switch (metadata.type) {
//       case 'stellar':
//         this.hideModal();
//         await WebBrowser.openBrowserAsync(
//           'http://stellarchain.io/tx/' + metadata.hash,
//         );
//         this.showModal(transaction);
//         break;
//       case 'bitcoin':
//         this.hideModal();
//         await WebBrowser.openBrowserAsync(
//           'https://live.blockcypher.com/btc-testnet/tx/' + metadata.hash,
//           // 'https://live.blockcypher.com/btc/tx/' + metadata.hash,
//         );
//         this.showModal(transaction);
//         break;
//       case 'ethereum':
//         this.hideModal();
//         await WebBrowser.openBrowserAsync(
//           'https://etherscan.io/tx/' + metadata.hash,
//         );
//         this.showModal(transaction);
//         break;
//     }
//   }
// }

// async function getTransactions(next) {
//   // const { currency, onRefresh, services } = this.props;
//   // const { filters, direction, field } = this.state;
//   this.setState({ [next ? 'nextLoading' : 'loading']: true });

//   // if (typeof onRefresh === 'function') onRefresh();

//   // this.setState({ activeFilters: filters });

//   // if (field) {
//   //   data.orderby = (direction === 'asc' ? '' : '-') + field;
//   // }

//   try {
//     const _transactions = next
//       ? await getNextTransactions()
//       : await getTransactions(data);

//     const requests =
//       services?.['Payment Requests Service (beta)'] ||
//       services?.['Payment Requests Service']
//         ? await this.getRequests({
//             start: next && _transactions?.results?.[0]?.created,
//             end:
//               _transactions?.results.length >= 15 &&
//               _transactions?.results?.[_transactions?.results?.length - 1]
//                 ?.created,
//           })
//         : [];

//     const tempTransactions = next ? this.state.transactions : [];

//     this.setState({
//       transactions: [
//         ...tempTransactions,
//         ...orderBy(
//           [...(_transactions?.results ?? []), ...requests],
//           ['created'],
//           ['desc'],
//         ),
//       ],
//       next: _transactions.next,
//     });
//   } catch (e) {
//     console.log('getTransactions', e);
//   } finally {
//     this.setState({ nextLoading: false, loading: false });
//   }
// }
async function getRequests({ user, currency }) {
  let filters = {
    request_currency: currency?.code,
    status: 'initiated',
  };
  // if (end) filters.created__gte = end;
  // if (start) filters.created__lt = start;

  const requests = await getPaymentRequests(generateQueryString(filters));
  if (requests?.data?.results.length) {
    return requests?.data?.results?.map(x => {
      const outgoing = x.user.id === user.id;
      return {
        ...x,
        currency: x.request_currency,
        amount: x.request_amount,
        total_amount: x.request_amount,
        subtype: 'request',
        tx_type: outgoing ? 'neutral_credit' : 'neutral_debit',
        status: 'Pending',
        partner: {
          user: outgoing
            ? x.payer_user ?? {
                email: x.payer_email,
                mobile: x.payer_mobile,
              }
            : x.user,
        },
      };
    });
  }
  return [];
}
