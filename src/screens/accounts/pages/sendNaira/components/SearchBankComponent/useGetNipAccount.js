import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import getNIPAccount from '../../api/getNIPAccount';

export default function useGetNipAccount({
  beneficiaryDetail,
  setAccountName,
}) {
  const getNIPAccountMutation = useMutation(getNIPAccount, {
    mutationKey: 'GET_NIP_ACCOUNT',
  });

  const { accountNumber, bankDetails } = beneficiaryDetail;

  async function fetchNIPAccountDetail() {
    try {
      const response = await getNIPAccountMutation.mutateAsync(
        beneficiaryDetail,
      );

      setAccountName(response?.accountName);
    } catch (error) {
      //! handle error
      console.log(error);
    }
  }

  useEffect(() => {
    if (accountNumber.length === 10 && bankDetails?.bankCode) {
      fetchNIPAccountDetail();
    }
  }, [accountNumber, bankDetails?.bankCode]);

  const { data, isLoading, isError } = getNIPAccountMutation;

  return { data, isLoading, isError };
}
