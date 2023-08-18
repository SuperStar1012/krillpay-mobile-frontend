import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import getBankCodes from './api/getBankCodes';

export default function useSendNaira({ navigation }) {
  const { data, isLoading, isError } = useQuery('GET_BANK_CODES', {
    queryFn: getBankCodes,
    staleTime: Infinity,
  });

  function navigateToReview(routeParams) {
    navigation.navigate('Review_Transaction', routeParams);
  }

  return { data, isLoading, isError, navigateToReview };
}
