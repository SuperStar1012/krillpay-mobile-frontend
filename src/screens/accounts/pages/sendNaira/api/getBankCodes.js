import { CONSTANTS } from 'config/constants';

export default async function getBankCodes() {
  return [
    { bankCode: '123', bankName: 'Bank 1' },
    { bankCode: '2344', bankName: 'bank 2' },
    { bankCode: '234d4', bankName: 'bank 3' },
    { bankCode: '123d', bankName: 'Bank 1' },
    { bankCode: '2344r', bankName: 'bank 2' },
    { bankCode: '234d422', bankName: 'bank 3' },
    { bankCode: '234q4', bankName: 'bank 2' },
    { bankCode: '234eeqd4', bankName: 'bank 3' },
    { bankCode: '123wwd', bankName: 'Bank 1' },
    { bankCode: '2344fffr', bankName: 'bank 2' },
    { bankCode: '234d422pp', bankName: 'bank 3' },
  ];
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
