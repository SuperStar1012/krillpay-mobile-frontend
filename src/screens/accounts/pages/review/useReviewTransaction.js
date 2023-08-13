import React from 'react';
import { useMutation, useQuery } from 'react-query';
import getNIPAccount from './api/getNIPAccount';

export default function useReviewTransaction({ route }) {
  const { data, isLoading, isError } = useQuery(
    ['GET_NIP_ACCOUNT', route.params],
    async () => await getNIPAccount(route.params),
  );

  return {
    data: { ...data, bankName: route.params.bankName },
    isLoading,
    isError,
  };
}
