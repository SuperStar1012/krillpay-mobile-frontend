import {
  validateEmail,
  validateMobile,
  validateCryptoNew,
} from 'utility/validation';
import { cryptoCodeToType } from 'utility/general';

export function getRecipientType(value, wallet, wyreCrypto) {
  if (!value) return null;
  if (!validateEmail(value)) return 'email';
  if (!validateMobile(value)) return 'mobile';
  if (!validateCryptoNew(value, wallet?.crypto ? wallet?.crypto : wyreCrypto))
    return 'crypto';
  if (value?.length === 10 && value?.[0] !== '+' && isNaN(value))
    return 'account';
}

// export function getRecipientConfig(value, wallet) {
//   const type = getRecipientType(value, wallet);

//   return {type}
// }
