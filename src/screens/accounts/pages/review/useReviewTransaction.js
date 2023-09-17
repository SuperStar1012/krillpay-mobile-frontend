import React from 'react';
import { useMutation, useQuery } from 'react-query';
import getNIPAccount from '../sendNaira/api/getNIPAccount';
import transferFunds from './api/transferNaira';
/**
 * @typedef {{bankName: string, bankCode: string}} BankDetails
 * @typedef {{ accountNumber: string, amount: string, bankDetails: BankDetails, narration: string}}ReviewTransactionRouteParams
 * @param {{route: { params : ReviewTransactionRouteParams}}} param0
 * @returns
 */
export default function useReviewTransaction({ route, navigation }) {
  const transferFundsMutation = useMutation(transferFunds, {
    mutationKey: 'TRANSFER_FUNDS',
  });

  async function transferNairaFunds() {
    /**
     * @type {TransferFundsModel}
     */
    //! get sender details from Rehive
    const payload = {
      currencyCode: 'NGN',
      narration: route.params.narration,
      beneficiaryAccountName: route?.params?.accountName,
      beneficiaryAccountNumber: route?.params?.accountNumber,
      transactionAmount: route.params.amount,
      beneficiaryBank: route.params.bankDetails?.bankName,
      sourceAccountName: 'Account Name',
    };

    try {
      await transferFundsMutation.mutateAsync(payload);
    } catch (error) {
      console.log({ error });
    } finally {
      // ! Add logic if sending fails
      //! Navigation to [home, transactionReview] with index 2, so back button goes to home page
      navigation.navigate('Transaction_Complete');
    }
  }

  return {
    data: route.params,
    transferNairaFunds,
    isLoading: transferFundsMutation.isLoading,
  };
}
