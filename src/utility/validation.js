import { StrKey } from './strkey';
import { PhoneNumberUtil } from 'google-libphonenumber';
// import WAValidator from './crypto/wallet-address-validator/src/wallet_address_validator';
import isValidDomain from 'is-valid-domain';
import { validate } from 'bitcoin-address-validation';
import { isEmpty } from 'lodash';

export const IsEmail = email => {
  let reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (reg.test(email)) {
    return true;
  }
  return false;
};

export const IsUuid = string => {
  let reg =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (reg.test(string)) {
    return true;
  }
  return false;
};

export const validateEmail = email => {
  if (!IsEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = password => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters in length';
  }
  return '';
};

export const validateGeneral = input => {
  if (!input || input.length < 0) {
    return 'Cannot be blank';
  }
  return '';
};

export const validateMobile = mobile => {
  try {
    if (mobile.charAt(0) != '+') return 'Please include a country code';

    const phoneUtil = PhoneNumberUtil.getInstance();
    // const countryCode = mobile.includes('+') ? '' : 'US';
    const number = phoneUtil.parse(mobile, '');
    const type = phoneUtil.getNumberType(number);
    let resp = phoneUtil.isValidNumber(number);
    if (!resp || type === 0) {
      return 'Please enter a valid mobile number';
    }
  } catch (e) {
    if (e.message === 'Invalid country calling code') {
      return 'Please include a country code';
    }
    return 'Please enter a valid mobile number';
  }

  return '';
};

export const validateAddress = (values = {}, wyre) => {
  let errors = {};
  let { line_1, state_province = '', city, postal_code, country } = values;
  if (country?.cca2) country = country?.cca2;
  if (!line_1) errors.line_1 = 'Please enter address line 1';
  if (!state_province) errors.state_province = 'Please enter state/province';
  if (!city) errors.city = 'Please enter city';
  if (!postal_code) errors.postal_code = 'Please enter postal/zip code';
  if (!country) errors.country = 'Please select country';
  if (wyre && state_province.match(/Texas|New York/))
    errors.state_province = 'App not available in ' + state_province;

  if (
    postal_code?.length !== 5 &&
    (country === 'US' || country === 'United States')
  )
    errors.postal_code = 'Zip code must be 5 numerical digits';

  if (isEmpty(errors)) return false;
  else return errors;
};

export const isMobile = mobile => {
  try {
    if (mobile.charAt(0) != '+') return false;

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(mobile, '');
    const type = phoneUtil.getNumberType(number);
    let resp = phoneUtil.isValidNumber(number);
    if (!resp || type === 0) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

export const validateCrypto = (address, type) => {
  let result = {
    valid: false,
    error: 'Please enter a valid ' + cryptoName(type) + ' address',
  };

  if (address) {
    switch (type) {
      case 'XLM':
      case 'TXLM':
        if (
          (address.includes('*') && isValidDomain(address.split('*')[1])) ||
          StrKey.isValidEd25519PublicKey(address)
        )
          return { valid: true };
        break;
      case 'XBT':
      case 'TXBT':
      case 'BTC':
        const temp = validate(address, type === 'TXBT' ? 'testnet' : 'mainnet');
        if (temp) return { valid: true };
        break;
    }
  }
  return result;
};
export const validateCrypto2 = (address, type, testnet) => {
  if (address) {
    try {
      switch (type) {
        case 'stellar':
          if (
            StrKey.isValidEd25519PublicKey(address) ||
            address.includes('*')
          ) {
            return '';
          }
          break;
        case 'bitcoin':
          // TODO: should check testnet for testnet address and mainnet for main address.
          // Currently checking bitcoin address for both mainnet and testnet.
          // Because: for wyre active company the currency code is XBT, that's why
          // this method can't decide about testnet or mainnet.
          let temp;
          temp = validate(address, 'mainnet');
          if (!temp) temp = validate(address, 'testnet');
          if (temp) {
            return '';
          }
          break;
        case 'ethereum':
          // if (WAValidator.validate(address, 'ETH', testnet)) {
          return '';
        // }
        // break;
        default:
          return '';
      }
    } catch (e) {
      console.log('TCL: e', e);
    }
  }
  return (
    'Please enter a valid ' + type + (testnet ? ' testnet' : '') + ' address'
  );
};

export const validateCryptoNew = (address, code) => {
  const type = cryptoType(code);
  const testnet = Boolean(code?.[0] === 'T');
  if (address) {
    try {
      switch (type) {
        case 'stellar':
          if (
            StrKey.isValidEd25519PublicKey(address) ||
            address.includes('*')
          ) {
            return '';
          }
          break;
        case 'bitcoin':
          // TODO: should check testnet for testnet address and mainnet for main address.
          // Currently checking bitcoin address for both mainnet and testnet.
          // Because: for wyre active company the currency code is XBT, that's why
          // this method can't decide about testnet or mainnet.
          let temp;
          temp = validate(address, 'mainnet');
          if (!temp) temp = validate(address, 'testnet');
          if (temp) {
            return '';
          }
          break;
        case 'ethereum':
          // if (WAValidator.validate(address, 'ETH', testnet)) {
          return '';
        // }
        // break;
        default:
          return (
            'Please enter a valid ' +
            type +
            (testnet ? ' testnet' : '') +
            ' address'
          );
      }
    } catch (e) {
      console.log('TCL: e', e);
    }
  }
  return (
    'Please enter a valid ' + type + (testnet ? ' testnet' : '') + ' address'
  );
};

export const cryptoName = crypto => {
  switch (crypto) {
    case 'TXLM':
      return 'stellar testnet';
    case 'XLM':
      return 'stellar';
    case 'TETH':
      return 'ethereum testnet';
    case 'ETH':
      return 'ethereum';
    case 'TXBT':
      return 'bitcoin testnet';
    case 'XBT':
    case 'BTC':
      return 'bitcoin';
    default:
      return '';
  }
};

export const cryptoType = crypto => {
  switch (crypto) {
    case 'TXLM':
    case 'XLM':
      return 'stellar';
    case 'TETH':
    case 'ETH':
      return 'ethereum';
    case 'TXBT':
    case 'XBT':
    case 'BTC':
      return 'bitcoin';
    default:
      return '';
  }
};

const ssnPattern = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
export const isSSN = ssn => {
  if (ssnPattern.test(ssn)) {
    return true;
  }
  return false;
};
export const validateSSN = ssn => {
  if (!isSSN(ssn)) return 'ssn_required';

  return '';
};
