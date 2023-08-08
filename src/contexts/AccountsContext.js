import { useSelector, useDispatch } from 'react-redux';
import {
  currenciesSelector,
  conversionRatesSelector,
} from 'screens/accounts/redux/reducer';
import { cryptoSelector } from '@redux/selectors';
import { fetchAccounts } from '@redux/actions';
// import { useState, useEffect } from 'react';

function useAccounts() {
  const wallets = useSelector(currenciesSelector);
  const dispatch = useDispatch();
  const rates = useSelector(conversionRatesSelector);
  const crypto = useSelector(cryptoSelector);

  function refresh() {
    dispatch(fetchAccounts());
  }

  // const loading = rates?.loading || wallets?.loading || crypto?.loading;

  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   if (!rates?.loading || !wallets?.loading || !crypto?.loading)
  //     setLoaded(true);
  // }, [wallets?.loading, rates?.loading, crypto?.loading]);

  //TODO: add logic to only create/update context once all data is loaded
  const context = { wallets, rates, crypto };

  return { context, refresh };
}

export { useAccounts };
export default useAccounts;
