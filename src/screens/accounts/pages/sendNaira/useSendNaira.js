import { useQuery } from 'react-query';
import getBankCodes from './api/getBankCodes';

export default function useSendNaira({ navigation, route }) {
  const { data, isLoading, isError } = useQuery('GET_BANK_CODES', {
    queryFn: getBankCodes,
    staleTime: Infinity,
  });

  function navigateToAmountSection(formValues) {
    /**
     * @description isWithdraw to handle onNext function on AmountStep Route
     */
    const routeParameters = {
      ...formValues,
      ...route.params,
      isWithDraw: true,
    };

    navigation.navigate('Send', routeParameters);
  }

  return { data, isLoading, isError, navigateToAmountSection };
}
