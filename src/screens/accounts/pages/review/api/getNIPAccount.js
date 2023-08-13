import { CONSTANTS } from 'config/constants';

/**
 *
 * @param {{accountNumber: string, beneficiaryBank: string}} body
 * @returns
 */
export default async function getNIPAccount(body) {
  const requestBody = {
    beneficiaryBank: body.bankCode,
    accountNumber: body.accountNumber,
  };
  const response = await fetch(`${CONSTANTS.providus_api}/third/account`, {
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
