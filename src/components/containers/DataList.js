import React, { useState } from 'react';
import CardList from '../card/CardListNew';
import { paramsToSearch } from 'utility/general';

import { useRehiveContext } from 'contexts/RehiveContext';
import { useQuery } from 'react-query';
import { useModal } from 'utility/hooks';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
export default function DataList(props) {
  const { item = {}, navigation, active, context = {} } = props;

  const {
    fetchData,
    renderItem: RenderItem,
    emptyListMessage,
    id,
    type,
    props: listProps = {},
    renderHeader,
    renderHeaderFixed,
    filter,
    gaurd,
    modals,
  } = item;

  const { filters, categories, loading: categoriesLoading } = context;
  const [error, setError] = useState('');
  const {
    context: { user, company },
  } = useRehiveContext();

  // change this to useRehive hook?
  const query = useQuery(
    [company?.id, user?.id, type ?? id],
    () => fetchData(paramsToSearch(filters ?? {})),
    { enabled: active },
  );
  const loading = (query?.isLoading || query?.isFetching) ?? false;
  const items = query?.data?.data?.results ?? query?.data?.results ?? [];
  const next = query?.data?.data?.next ?? query?.data?.next ?? [];
  async function handleFetchData() {
    query.refetch();
  }

  function handleNext() {}

  const { modalVisible, hideModal, showModal } = useModal();
  const ModalComp = modals?.[modalVisible?.id];

  const data = typeof filter === 'function' ? items.filter(filter) : items;

  return (
    <>
      <CardList
        noPadding
        type={type ?? id}
        data={{ items: data, loading, error, next }}
        onRefresh={handleFetchData}
        getNext={handleNext}
        renderItem={renderProps => (
          <RenderItem
            {...renderProps}
            navigation={navigation}
            context={{}}
            showModal={showModal}
            refresh={handleFetchData}
          />
        )}
        emptyListMessage={emptyListMessage ?? ''}
        renderHeader={renderHeader}
        context={context}
        renderHeaderFixed={renderHeaderFixed}
        {...listProps}
      />
      {Boolean(ModalComp && modalVisible) && (
        <PopUpGeneral
          docked
          visible={Boolean(ModalComp && modalVisible)}
          onDismiss={hideModal}>
          <ModalComp
            {...(modalVisible?.props ?? {})}
            hideModal={hideModal}
            refresh={handleFetchData}
          />
        </PopUpGeneral>
      )}
    </>
  );
}
