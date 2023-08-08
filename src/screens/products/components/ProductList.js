import React, { useEffect } from 'react';
import CardList from 'components/card/CardListNew';
import {
  paramsToSearch,
  getQueryVariable,
  flattenPaginatedData,
} from 'utility/general';
import { useCart } from '../util/contexts/CartContext';
import { getProductsNew as getProducts } from 'utility/rehive';
import { useInfiniteQuery } from 'react-query';
import CurrencyConfigErrorPlaceholder from './CurrencyConfigErrorPlaceholder';

export default function ProductList(props) {
  const { item, navigation, context = {} } = props;

  const {
    renderItem: RenderItem,
    emptyListMessage,
    id,
    type,
    props: listProps = {},
    renderHeader: Header,
    renderHeaderFixed: HeaderFixed,
    filter,
  } = item;

  const { currency, cart, filters, openDrawer } = useCart();

  const all_filters = {
    ...filters,
    currency: currency?.code ?? currency ?? '',
    seller: cart?.seller?.id ?? '',
    page_size: 16,
  };
  const enabled = !!all_filters?.currency; // && !cartLoading && active);
  const query = useInfiniteQuery(
    ['products', all_filters],
    ({ pageParam = 1 }) =>
      getProducts(paramsToSearch({ ...all_filters, page: pageParam } ?? {})),
    {
      enabled,
      getNextPageParam: lastGroup =>
        getQueryVariable(lastGroup?.next?.split('?')?.[1] ?? '', 'page') ||
        null,
    },
  );

  const {
    error,
    data,
    isFetching,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = query;

  const flattenedData = flattenPaginatedData(data);
  const items =
    typeof filter === 'function'
      ? flattenedData?.filter(filter)
      : flattenedData;

  function refresh() {
    refetch();
  }

  useEffect(() => {
    refresh();
  }, [filters?.currency, filters?.seller]);

  function handleNext() {
    fetchNextPage();
  }

  if (!currency) return <CurrencyConfigErrorPlaceholder />;

  return (
    <CardList
      tabLabel="Products"
      noPadding
      skeletont
      type={type ?? id}
      data={{
        items,
        loading: isLoading,
        error,
        more: hasNextPage,
        nextLoading: isFetching && !isLoading,
      }}
      // onRefresh={handleFetchData}
      getNext={handleNext}
      renderItem={renderProps => (
        <RenderItem {...props} {...renderProps} context={{}} />
      )}
      onRefresh={refetch}
      emptyListMessage={emptyListMessage ?? ''}
      renderHeader={<Header {...props} />}
      context={context}
      renderHeaderFixed={<HeaderFixed {...props} setDrawerOpen={openDrawer} />}
      // {renderHeaderFixed}
      navigation={navigation}
      {...listProps}
    />
  );
}

// if (showCategories) {
//   const data = {
//     items: categories.filter(item => !item.parent),
//     loadin: categoriesLoading,
//   };
// //   // console.log('handleNext -> data', data);
//   return (
//     <CardList
//       noPadding
//       type="categories"
//       emptyListMessage={'No product categories found'}
//       data={data}
//       context={context}
//       renderHeaderFixed={renderHeaderFixed}
//       renderItem={({ item, index: i }) => (
//         <CategoryCard
//           filters={filters}
//           setFilters={context?.setFilters ?? null}
//           item={item}
//           key={item.id}
//           index={i}
//         />
//       )}
//       {...listProps}
//     />
//   );
// }

// useEffect(() => {
//   // console.log('ProductList -> query', query, filters, oldFilters);
//   if (query?.isSuccess && isEqual(filters, oldFilters)) {
//     // console.log('ProductList -> query inside save');
//     setItems(query?.data?.results); // toDo add id normalising
//     setLoading(false);
//   }
// }, [query]);

// function saveData(items, fetchFilters) {
//   if (isEqual(filters, fetchFilters)) {
//     setItems(items);
//   }
// }

// async function handleFetchData() {
//   setLoading(true);
//   setOldFilters(filters);
//   try {
//     const resp = await getProducts(paramsToSearch(filters ?? {}));
//     if (resp?.status === 'success') {
//       saveData(resp?.data?.results, filters);
//       setNext(resp?.data?.next);
//     } else {
//       setError(resp?.message ?? 'Something went wrong...');
//     }
//   } catch (e) {
//     // console.log('handleFetchData -> e', e);
//   }
//   setLoading(false);
// // }

// useEffect(() => {
//   if (fetchData && active) {
//     setItems([]);

//     if (!cartLoading) {
//       handleFetchData();
//     }
//   }
// }, [active, filters?.currency, filters?.seller, cartLoading]); //item, filters, active
