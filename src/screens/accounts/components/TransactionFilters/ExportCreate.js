import React, { useState, useCallback, useEffect } from 'react';

import RadioSelector from 'components/inputs/RadioSelector';
import { createExport, getExport } from 'utility/rehive';
import { ButtonList, View, Text } from 'components';
import { useQuery } from 'react-query';
import { Share } from 'react-native';

export default function ExportCreate(props) {
  const { filters, setId, showToast, onDismiss } = props;
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('csv');
  const [item, setItem] = useState(null);
  const hasItem = !!item?.id;
  console.log('ExportCreate -> hasItem', hasItem);

  const createNewExport = useCallback(async () => {
    setLoading(true);
    const resp = await createExport('transaction', filters, exportType);
    if (resp?.status === 'success') {
      setItem(resp?.data);
      showToast({ text: 'export_create_success' });
    } else showToast({ text: 'export_create_error' });
    setLoading(false);
  }, [exportType, filters]);

  const { data } = useQuery(
    ['transaction-export', item?.id],
    () => getExport(item?.id),
    {
      enabled: hasItem && item?.progress < 100,
      refetchInterval: 2000,
    },
  );

  useEffect(() => {
    if (data?.id) setItem(data);
  }, [data]);

  // const filterString = filterMap(filters);
  // console.log("ExportCreate -> filterString", filterString)
  const url = item?.pages?.[0]?.file;

  async function handleShare() {
    try {
      await Share.share({
        message: url,
        url,
      });
    } catch (error) {
      // alert(error.message);
    }
  }

  const buttons = [
    hasItem
      ? {
          // label: 'SHARE',
          id: 'share',
          ns: 'accounts',
          color: 'primary',
          disabled: !url,
          loading: !url,
          onPress: handleShare,
        }
      : {
          // label: 'CREATE EXPORT',
          id: 'create_export',
          ns: 'accounts',
          color: 'primary',
          loading,
          onPress: createNewExport,
        },
    {
      id: hasItem ? 'close' : 'cancel',
      type: 'text',
      onPress: () => {
        hasItem && setId(null);
        onDismiss();
      },
    },
  ];

  return (
    <View w={'100%'} fD="column">
      <View ph={1.5} w={'100%'} pb={hasItem ? 1.5 : 1}>
        {hasItem ? (
          url ? (
            <Text tA="center" id="transaction_export_complete" ns="accounts" />
          ) : (
            <Text tA="center" id="transaction_export_pending" ns="accounts" />
          )
        ) : (
          <RadioSelector
            altStyle
            items={[
              { value: 'csv', label: 'CSV' },
              { value: 'json', label: 'JSON' },
            ]}
            value={exportType}
            handleChange={setExportType}
          />
        )}
        {/* <Output label="Filters" value={filterString} /> */}
        {/* <FilterOutputList
              filters={filters}
              filterConfig={TransactionFilterConfig}
            /> */}
      </View>

      <ButtonList items={buttons} />
    </View>
  );
}
