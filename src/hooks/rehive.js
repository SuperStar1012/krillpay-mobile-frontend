import { useMemo } from 'react';
import { fetchItems, getProfile } from 'utility/rehive';
import { useQueries, useQuery } from 'react-query';

export const rehiveSelector = state => ({
  items: state?.data?.results ?? state?.data ?? [],
  // ...state,
  loading: state?.isLoading ?? true,
  error: state?.error ?? '',
});

export function useRehive(items, init = true, appContext = {}) {
  let isSingle = typeof items === 'string';

  const userId = appContext?.user?.id;
  const enabled = init && Boolean(userId);

  const rehiveQueries = useQueries(
    init
      ? (isSingle ? [items] : items).map(id => {
          return {
            queryKey: [id, userId],
            queryFn: () => fetchItems(id, appContext),
            options: { enabled },
          };
        })
      : [],
  );

  function refresh(id, data) {
    if (id) {
      const index = isSingle ? 0 : items.findIndex(item => item === id);
      rehiveQueries?.[index]?.refetch();
    } else {
      for (let i = 0; i < items.length; i++) {
        rehiveQueries?.[i]?.refetch();
      }
    }
  }

  let { context, loading } = useMemo(
    () => mapContext(items, rehiveQueries),
    [rehiveQueries],
  );

  return { context, refresh, loading };
}

function mapContext(items, rehiveQueries) {
  let context = {};
  let loading = {};
  let isSingle = typeof items === 'string';

  for (let i = 0; i < items.length; i++) {
    const query = rehiveQueries[i];
    const id = items[i];
    let temp = rehiveSelector(query);
    if (temp?.items?.length < 0) temp.items = [];
    loading = {
      [id]: temp?.loading,
    };
    context = { ...context, [id]: temp };
    if (isSingle) return { context: temp, loading: temp?.loading };
  }
  return { context, loading };
}

export function useGetProfile(key, enabled = true) {
  const queryResult = useQuery(['user', 'profile', key], getProfile, {
    enabled,
    staleTime: 2500,
  });

  return queryResult;
}
