import { CONSTANTS } from 'config/constants';

export default async function getBankCodes() {
  const response = await fetch(`${CONSTANTS.providus_api}/third/banks`);
  if (!response.ok) {
    console.log('Network response was not ok');
    return [];
  }
  const JSONresponse = await response.json();
  const bankCodes = JSONresponse?.data?.banks || [];

  return bankCodes.map(el => ({ label: el.bankName, value: el }));
}
