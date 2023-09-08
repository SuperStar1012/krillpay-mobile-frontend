import React, { useState, useEffect } from 'react';
import { SectionList, FlatList } from 'react-native';
import { View, Text, Button } from 'components';
import { useQuery, useQueryClient, useInfiniteQuery } from 'react-query';
import {
  getPaymentRequests,
  getReceivedPaymentRequests,
  notifyPaymentRequest,
  getPaymentRequest,
} from 'utility/rehive';
import { useConversion } from 'utility/rates';
import { useToast } from 'contexts/ToastContext';
import IconButton from 'components/inputs/IconButton';
import RequestPaymentActivityItem from './RequestPaymentActivityItem';
import RequestPaymentActivityConfirm from './RequestPaymentActivityConfirm';
import RequestPaymentActivityPopUp from './RequestPaymentActivityPopUp';
import RequestPaymentActivityCancel from './RequestPaymentActivityCancel';
import RequestPaymentActivityInsufficientFunds from './RequestPaymentActivityInsufficientFunds';
import {
  getQueryVariable,
  flattenPaginatedData,
  standardizeString,
} from 'utility/general';
import PaginationListFooter from 'components/layout/PaginationListFooter';
import { uniqBy } from 'lodash';

export default function RequestPaymentActivity(props) {
  const {
    setResult,
    onNext,
    send,
    filters,
    route,
    context: { user, rates, currencies, wallet, services },
  } = props;

  const [selected, setSelected] = useState();
  const [displayModal, setDisplayModal] = useState(false);
  const [state, setState] = useState();
  const [action, setAction] = useState();
  const [processingAction, setProcessingAction] = useState(false);
  const { request } = route?.params ?? {};

  const { hasConversion, convRate: conversionRate } = useConversion(
    0,
    services,
    wallet,
  );

  const { showToast } = useToast();

  const queryClient = useQueryClient();

  const enabled = Boolean(user?.id);

  const queryRequests = useInfiniteQuery(
    [user?.id, 'paymentRequests'],
    ({ pageParam = 1 }) =>
      getPaymentRequests('?page=' + pageParam + '&page_size=50', true),
    {
      enabled,
      getNextPageParam: (lastGroup, allGroups) =>
        getQueryVariable(lastGroup?.next?.split('?')?.[1] ?? '', 'page') ||
        null,
    },
  );
  const requests =
    flattenPaginatedData(queryRequests?.data)?.filter(
      x => !x.metadata?.service_business,
    ) ?? [];

  const queryReceivedRequests = useInfiniteQuery(
    [user?.id, 'receivedRequests'],
    ({ pageParam = 1 }) =>
      getReceivedPaymentRequests('?page=' + pageParam + '&page_size=50', true),
    {
      enabled,
      getNextPageParam: (lastGroup, allGroups) =>
        getQueryVariable(lastGroup?.next?.split('?')?.[1] ?? '', 'page') ||
        null,
    },
  );

  const queryReceivedRequest = useQuery(
    [user?.id, 'receivedRequest'],
    () => getPaymentRequest(request, true),
    { enabled: Boolean(user?.id && request) },
  );
  const receivedRequests = flattenPaginatedData(
    queryReceivedRequests?.data ?? [],
  );

  const loading = queryRequests?.isLoading || queryReceivedRequests?.isLoading;
  const refreshing =
    queryRequests?.isFetching || queryReceivedRequests?.isFetching;

  useEffect(() => {
    if (request) {
      const preloadRequest =
        queryReceivedRequest?.data?.id === request
          ? queryReceivedRequest?.data
          : requests?.find(x => x.id === request);

      if (!preloadRequest) return;

      setTimeout(() => {
        setSelected(preloadRequest);
        setDisplayModal(true);
      }, 1000);
    } else {
      setDisplayModal(false);
    }
  }, [loading, request, queryReceivedRequest?.data?.id]);

  const requestCurrency = currencies?.data?.find(
    x => x.currency?.code === selected?.request_currency?.code,
  );

  function getRequests({ getReceived }) {
    queryRequests.refetch();
    if (getReceived) {
      queryReceivedRequests.refetch();
    }
  }

  function setRequests(results) {
    queryClient.setQueryData([user?.id, 'paymentRequests'], {
      ...queryReceivedRequests?.data,
      results,
    });
  }

  async function refreshRequests() {
    await getRequests({ getReceived: true });
  }

  async function sendReminder(item) {
    setProcessingAction(true);
    setAction('remind');

    await notifyPaymentRequest(item?.id);
    showToast({
      text: `A reminder has been sent to ${
        item?.payer_email || item?.payer_mobile
      }`,
    });

    setProcessingAction(false);
  }

  function getLabels(state, outgoing, contact, item) {
    const isInvoice = !!item?.metadata?.service_business;
    let firstLabel = {};
    let secondLabel = {};
    if (isInvoice && outgoing) {
      firstLabel.text = 'you_have_created_an_invoice';
      firstLabel.color = 'font';
    } else {
      switch (state) {
        case 'pending':
          firstLabel.text = outgoing ? 'you_have_requested' : `contact_has`;
          firstLabel.context = { contact };
          firstLabel.color = outgoing ? 'primary' : 'font';
          secondLabel.text = outgoing
            ? `from ${contact}`
            : 'requested_from_you';
          secondLabel.color = outgoing ? 'font' : 'primary';
          break;
        case 'paid':
          firstLabel.text = outgoing ? `${contact} has` : 'you_paid';
          firstLabel.color = outgoing ? 'font' : 'primary';
          secondLabel.text = outgoing ? 'paid you' : `${contact}`;
          secondLabel.color = outgoing ? 'primary' : 'font';
          break;
        case 'cancelled':
          firstLabel.text = outgoing
            ? `${contact} has`
            : 'you_cancelled_a_request_from';
          firstLabel.color = 'font';
          secondLabel.text = outgoing
            ? 'cancelled_a_request_from_you'
            : `${contact}`;
          secondLabel.color = 'font';
          break;
      }
    }

    return { firstLabel, secondLabel };
  }

  const componentProps = {
    setSelected,
    setState,
    setDisplayModal,
    getLabels,
    getRequests,
    refreshRequests,
    setProcessingAction,
    setAction,
    setRequests,
    sendReminder,
    user,
    state,
    rates,
    requests,
    displayModal,
    setResult,
    refreshing: false, // refreshing && !loading,
    processingAction,
    selected,
    action,
    hasConversion,
    conversionRate,
    requestCurrency,
    send,
  };

  // let data =
  //   filters?.type === 'paid'
  //     ? {
  //         title: 'Paid',
  //         hideActions: true,
  //         data: [...requests, ...receivedRequests].filter(item =>
  //           ['complete', 'paid', 'overpaid'].includes(item.status),
  //         ),
  //       }
  //     : filters?.type === 'cancelled'
  //     ? {
  //         title: 'Cancelled',
  //         hideActions: true,
  //         data: [...requests, ...receivedRequests].filter(
  //           item => item.status === 'cancelled',
  //         ),
  //       }
  //     : {
  //         title: 'Pending',
  //         data: [...requests, ...receivedRequests].filter(item =>
  //           ['draft', 'initiated', 'underpaid', 'late'].includes(item.status),
  //         ),
  //       };
  // const sections = [data]
  //   .filter(x => x.data.length)
  //   ?.map((x, index) => {
  //     return { ...x, key: index };
  //   });

  const statusMap = {
    paid: ['complete', 'paid', 'overpaid'],
    cancelled: ['cancelled'],
    pending: ['draft', 'initiated', 'underpaid', 'late'],
  };

  let data = uniqBy([...requests, ...receivedRequests], 'id').filter(item =>
    statusMap?.[filters?.type].includes(item.status),
  );

  useEffect(() => {
    console.log(`useEffect===data`, JSON.stringify(data));
    if (data.length == 0) {
      //onNext();
    }
  }, [!loading]);

  function handleNext() {
    queryRequests?.fetchNextPage();
    queryReceivedRequests?.fetchNextPage();
  }

  return (
    <View f={1} pt={0.5} ph={0.5}>
      <View ml={1} pv={0.5} bC={'white'}>
        <Text s={18} fW={'500'} id={filters?.type} />
      </View>
      <FlatList
        stickySectionHeadersEnabled={true}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          overflow: 'hidden',
        }}
        // sections={sections}
        data={data ?? []}
        onRefresh={refreshRequests}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <Text tA={'center'} c={'grey'} p={1}>
              {'No ' + filters?.type + ' payment request activity'}
            </Text>
          )
        }
        ListFooterComponent={
          data?.data?.length && (
            <PaginationListFooter
              next={
                queryRequests?.hasNextPage || queryReceivedRequests?.hasNextPage
              }
              loading={!loading && refreshing} // TODO:
              getNext={handleNext}
            />
          )
        }
        renderItem={itemProps => (
          <RequestPaymentActivityItem
            {...itemProps}
            section={filters?.type}
            {...componentProps}
          />
        )}
        // renderSectionHeader={({ section }) => (
        //   <View ml={1} pv={0.5} bC={'white'}>
        //     <Text s={18} fW={'500'}>
        //       {section.title}
        //     </Text>
        //   </View>
        // )}
        // renderSectionFooter={({ section: { key } }) => {
        //   return <View p={key === sections.length - 1 ? 2.25 : 0.25} />;
        // }}
        keyExtractor={item => (item.id ? item.id.toString() : '')}
        showsVerticalScrollIndicator={false}
      />
      {selected && <RequestPaymentActivityPopUp {...componentProps} />}
      {/* {selected && <RequestPaymentActivityConfirm {...componentProps} />} */}
      {selected && <RequestPaymentActivityCancel {...componentProps} />}
      {selected && (
        <RequestPaymentActivityInsufficientFunds {...componentProps} />
      )}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ position: 'absolute', bottom: 20 }}>
          <Button onPress={onNext} label={' New Request '} />
        </View>
      </View>
    </View>
  );
}
