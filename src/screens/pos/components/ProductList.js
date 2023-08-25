import React, { useState, useEffect } from 'react';
import CardList from 'components/card/CardListNew';
import { paramsToSearch } from 'utility/general';
import {
  getProductsNew as getProducts,
  getMerchantProducts,
} from 'utility/rehive';
// import CategoryCard from 'screens/products/components/CategoryCard';
import { useQuery } from 'react-query';
import { useToast } from 'contexts/ToastContext';
import { useRehiveContext } from 'contexts/RehiveContext';
import PoSProductCategoryChips from './PoSProductCategoryChips';

export default function ProductList(props) {
  const {
    config = {},
    navigation,
    active,
    context = {},
    items,
    setItems,
  } = props;
  const { showToast } = useToast();
  const {
    context: { company },
  } = useRehiveContext();

  const {
    renderItem: RenderItem,
    emptyListMessage,
    id,
    type,
    props: listProps = {},
    renderHeader: Header,
  } = config;

  const { currency, business } = context;

  const [category, setCategory] = useState('');
  let filters = {
    currency: currency?.code ?? currency ?? '',
  };
  if (category) filters.categories = category;
  const enabled = filters?.currency && active;
  const { error, data, isSuccess, isFetching, refetch } = useQuery(
    [company?.id, 'products', filters],
    () => getMerchantProducts(business?.id, paramsToSearch(filters ?? {})),
    null,
    {
      enabled,
    },
  );

  function refresh() {
    refetch();
  }

  useEffect(() => {
    refresh();
  }, [filters?.currency, filters?.seller]);

  function handleNext() {}

  const [selected, setSelected] = useState(null);

  function handleAddItem(item) {
    const index = items.findIndex(i => item?.id === i?.id);
    let newItems = Array.isArray(items) ? [...items] : [];
    if (index !== -1)
      newItems[index].quantity = newItems[index].quantity + item?.quantity;
    else newItems.push(item);
    setItems(newItems);
  }

  return (
    <CardList
      tabLabel="Products"
      noPadding
      skeletont
      type={type ?? id}
      data={{ items: data?.results, loading: isFetching, error }}
      // onRefresh={handleFetchData}
      getNext={handleNext}
      renderItem={renderProps => (
        <RenderItem
          {...props}
          {...renderProps}
          showToast={showToast}
          context={context}
          selected={selected}
          setSelected={setSelected}
          handleAddItem={handleAddItem}
        />
      )}
      onRefresh={refetch}
      emptyListMessage={emptyListMessage ?? ''}
      renderHeader={Header && <Header {...props} />}
      context={context}
      renderHeaderFixed={PoSProductCategoryChips}
      navigation={navigation}
      category={category}
      setCategory={setCategory}
      {...listProps}
    />
  );
}
