import { useState } from 'react';
import { useRehiveContext } from 'contexts/RehiveContext';

import { useBusiness } from 'contexts';

export function usePoS() {
  const {
    context,
    config: { posConfig },
  } = useRehiveContext();

  const { business } = useBusiness();
  const { currency } = business;

  const [state, setState] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  return {
    items,
    setItems,
    state,
    setState,
    error,
    setError,
    context: { ...context, currency, business, posConfig },
  };
}
