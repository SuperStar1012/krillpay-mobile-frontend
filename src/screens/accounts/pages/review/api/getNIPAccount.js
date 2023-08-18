import { CONSTANTS } from 'config/constants';

/**
 *
 * @param {import('../useReviewTransaction').ReviewTransactionRouteParams} body
 * @returns { Promise<NIPAccountModel> }
 */
export default async function getNIPAccount(body) {
  const requestBody = {
    beneficiaryBank: body.bankDetails.bankCode,
    accountNumber: body.accountNumber,
  };
  const response = await fetch(CONSTANTS.getNIPAccount_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    console.log('Network response was not ok');
    return {};
  }
  const JSONresponse = await response.json();

  return JSONresponse?.data;
}
