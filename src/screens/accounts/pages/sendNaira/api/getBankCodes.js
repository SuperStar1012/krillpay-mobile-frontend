import { CONSTANTS } from 'config/constants';

export default async function getBankCodes() {
  const response = await fetch(`${CONSTANTS.providus_api}/third/banks`);
  if (!response.ok) {
    console.log('Network response was not ok');
    return [];
  }
  const JSONresponse = await response.json();

  /**
   *
   * @type {NIPBank[]}
   */
  const bankCodes = JSONresponse?.data?.banks || [];

  return bankCodes;
}

/**
 * @typedef {{bankCode: string, bankName: string}} NIPBank
 */
