import React, { useState } from 'react';
import { PopUpGeneral } from 'components';
import TransactionFilterList from './TransactionFilterList';
import TransactionExport from './TransactionExport';
import Filter from 'components/filter/Filter';
import { transactionFilterConfig } from 'screens/accounts/config/filters';
import { useToast } from 'contexts/ToastContext';
import { useIsRTL } from 'hooks/general';

const configs = {
  filter: {},
  export_list: { title: 'export_history' },
  export_create: { title: 'select_file_type' },
  export: {},
  // export: { title: 'Export' },
};

const filters = {
  subtype: { type: 'select' },
  type: { title: 'Select file type' },
  status: { title: 'Select file type' },
  date: { title: 'Select file type' },
  amount: { title: 'Select file type' },
};

function Components(props) {
  const { id, filterConfig } = props;

  switch (id) {
    case 'filter':
      return <TransactionFilterList {...props} configs={filters} />;
    case 'export':
    case 'export_list':
      return <TransactionExport {...props} />;

    default:
      return <Filter {...props} {...(filterConfig?.[id] ?? {})} />;
      return null;
  }
}

export default function TransactionFilters(props) {
  const { id, onDismiss, subtypes } = props;

  const [filterId, setFilterId] = useState(null);
  const { showToast } = useToast();

  const filterConfig = transactionFilterConfig({ subtypes });
  const isRTL = useIsRTL();

  const config = filterConfig?.[filterId] ?? configs?.[filterId ?? id] ?? {};

  if (!id) return null;

  return (
    <PopUpGeneral
      docked
      scrollView={false}
      titleColor="font"
      titleBold
      iconTitleLeft={filterId ? (isRTL ? 'chevron-right' : 'chevron-left') : ''}
      onPressTitleLeft={() => setFilterId(null)}
      iconTitleRight={id === 'export' && !filterId ? 'history' : ''}
      onPressTitleRight={() => setFilterId('export_list')}
      visible={!!id}
      onDismiss={onDismiss}
      title={config?.title ?? config?.id ?? filterId ?? id}
      ns="accounts">
      <Components
        {...props}
        id={filterId ?? id}
        showToast={showToast}
        onDismiss={onDismiss}
        // filterId={filterId}
        setId={setFilterId}
        filterConfig={filterConfig}
      />
    </PopUpGeneral>
  );
}
