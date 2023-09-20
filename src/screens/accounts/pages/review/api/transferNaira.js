import { CONSTANTS } from 'config/constants';

/**
 *
 * @param {TransferFundsModel} body
 * @returns
 */
export default async function transferFunds(body) {
  const response = await fetch(CONSTANTS.transferFunds_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.log('Network response was not ok');
    return {};
  }
  const JSONresponse = await response.json();

  return JSONresponse?.data;
}
