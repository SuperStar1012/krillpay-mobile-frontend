import { Dimensions, Platform, PixelRatio } from 'react-native';
import { getName } from 'country-list';
import { get } from 'lodash';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { FileSystem } from 'expo';
import countryDialCodes from 'scripts/country_dial_codes.json';
import Big from 'big.js';

export function formatDivisibility(amount, divisibility) {
  amount = parseFloat(amount ? amount : 0);
  if (divisibility > 0) {
    amount = amount / 10 ** divisibility;
  }
  const diff = amount.toString().length - Math.floor(amount).toString().length;
  if (diff > divisibility) {
    return parseFloat(amount).toFixed(divisibility);
  }
  if (diff > 2) {
    return scientificToDecimal(parseFloat(amount)).toString();
  }
  return parseFloat(amount).toFixed(2);
}

export const displayFormatDivisibility = (amount = 0, divisibility) => {
  let value = formatDivisibility(amount, divisibility);
  if (value && value.includes('.')) {
    const split = value.toString().split('.');
    value = `${split[0]}.${split[1].slice(0, 4)}`;
  }
  return value;
};

export function toDivisibility(amount, currency) {
  amount = parseFloat(amount ? amount : 0);
  return typeof amount === 'number' && currency
    ? parseInt(Big(amount).times(10 ** (currency?.divisibility ?? currency)))
    : '';
}
export function fromDivisibility(amount, currency) {
  amount = parseFloat(amount ? amount : 0);
  return amount
    ? parseInt(
        Big(typeof amount === 'number' ? amount : 0).div(
          10 ** (currency?.divisibility ?? currency ?? 1),
        ),
      )
    : '';
}

export function getUserGroup(user) {
  return user?.groups?.[0]?.name ?? 'user';
}

export function getActiveTier(tiers) {
  return tiers?.items?.length > 0
    ? tiers?.items?.find(item => item.active)
    : null;
}

export const parseDivisibility = (raw, divisibility, newCharacter) => {
  let amountString = raw.replace('.', '');
  let pos = amountString.length - divisibility;
  let amountInt = parseInt(amountString);

  if (newCharacter) {
    if ((newCharacter === '.' || newCharacter === ',') && pos > 0) {
      amountInt = amountInt * 10 ** divisibility;
    } else {
      newCharacter = parseInt(newCharacter);
      if (!isNaN(newCharacter)) {
        amountInt = amountInt * 10 + newCharacter;
      }
    }
  } else {
    // console.log('no newChar');
  }

  return isNaN(amountInt) ? 0 : amountInt;
};

export const standardizeString = (string, capitalize = true) => {
  if (string) {
    if (capitalize) {
      return (string.charAt(0).toUpperCase() + string.slice(1)).replace(
        /_/g,
        ' ',
      );
    } else {
      return string.replace(/_/g, ' ');
    }
  }
  return '';
};

export const snakeString = string => {
  if (string) {
    return string.toLowerCase().replace(' ', '_');
  }
  return '';
};

export const decodeQR = string => {
  string = decodeURIComponent(string);
  let values = {};
  if (string) {
    if (string.includes(':') || string.includes('?')) {
      let temp = [];
      let rest = '';
      if (string.includes(':')) {
        temp = string.split(':');
        values.type = temp[0];
        rest = decodeURIComponent(temp[1]);
      } else {
        rest = decodeURIComponent(string);
      }

      temp = decodeURIComponent(rest).split('?');
      values.recipient = temp[0];
      if (temp[1]) {
        temp = temp[1].split('&');
        for (let i = 0; i < temp.length; i++) {
          let detail = temp[i].split('=');
          values[detail[0]] = decodeURIComponent(detail[1]);
        }
      }
    } else {
      values.recipient = string;
    }
    if (values.type === 'web+stellar') {
      values.recipient = values.destination;
      delete values.destination;
    }
  }
  return values;
};

export const concatAddress = (address, noType) => {
  if (!address) {
    return '';
  }
  let value = '';
  if (address.type && !noType) {
    value = standardizeString(address.type);
  }
  if (address.line_1) {
    value = value + (value ? ' - ' : '') + address.line_1;
  }
  if (address.line_2) {
    value = value + (value ? ', ' : '') + address.line_2;
  }
  if (address.city) {
    value = value + (value ? ', ' : '') + address.city;
  }
  if (address.state_province) {
    value = value + (value ? ', ' : '') + address.state_province;
  }
  if (address.country) {
    value = value + (value ? ', ' : '') + getName(address.country);
  }
  if (address.postal_code) {
    value = value + (value ? ', ' : '') + address.postal_code;
  }
  if (address.state_code) {
    value = value + (value ? ', ' : '') + address.state_code;
  }
  return value;
};

export const concatBankAccount = (account = {}, multiline, noName) => {
  if (!account) return '';
  let { name } = account;
  let value = '';
  if (account.bank_name) {
    value = account.bank_name;
  }
  if (account.number) {
    value = value + (value ? ', ' : '') + account.number;
  }
  if (account.type) {
    value = value + (value ? ', ' : '') + account.type;
  }
  if (noName) {
    return value;
  }

  if (multiline) {
    return [name + ' ', value];
  }
  return name + ' - ' + value;
};

export const concatCryptoAccount = (account, multiline) => {
  if (!account) {
    return '';
  }
  let value = '';
  let name = '';
  let { address } = account;
  let memo = account.metadata && account.metadata.memo;

  if (account.name || (account.metadata && account.metadata.name)) {
    name = account.name ? account.name : account.metadata.name;
  }

  if (
    (account.network && account.network === 'testnet') ||
    (account.metadata && account.metadata.testnet)
  ) {
    name = name + ' (testnet) ';
  }
  value = name;

  if (multiline) {
    return [name, address, memo];
  }

  if (memo) {
    value = value + (value ? ' ' : '') + (memo + '*');
  }

  if (address) {
    value = value + (value ? '' : '') + address;
  }

  return value;
};
export const safe = (item, field, value = '') =>
  item && item[field] ? item[field] : value;

export const bounds = (value, min, max) => Math.min(max, Math.max(min, value));

export function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export function getPrimaryOrFirst(data) {
  const temp = data.find(item => item.primary === true);
  return temp ? temp : data[0] ? data[0] : {};
}

export const getCryptoAddress = (currency, crypto, stellarTransactionType) => {
  switch (currency.crypto) {
    case 'XBT':
    case 'TXBT':
      return getBitcoinAddress(currency, crypto);
    case 'XLM':
    case 'TXLM':
      return getStellarAddress(currency, crypto, stellarTransactionType);
    case 'ETH':
    case 'TETH':
      return getEthereumAddress(currency, crypto);
    default:
      return '';
  }
};

export const getStellarAddress = (currency, crypto, stellarTransactionType) => {
  let address = '';
  if (stellarTransactionType === 'public') {
    address = get(
      crypto,
      [currency.crypto, 'user', 'crypto', 'public_address'],
      '',
    );
  } else {
    const currentCrypto = get(crypto, [currency.crypto], null);
    if (currentCrypto) {
      const { company, user } = currentCrypto;
      address =
        (user.username ? user.username : user.memo) +
        '*' +
        get(company, 'federation_domain', '');
    }
  }

  return address;
};

export const getBitcoinAddress = (currency, crypto) =>
  get(crypto, [currency.crypto, 'user', 'account_id'], '');

export const getEthereumAddress = (currency, crypto) =>
  get(crypto, [currency.crypto, 'user', 'crypto', 'address'], '');

export const compareCryptoType = (acc, currency) => {
  if (
    (acc.crypto_type === 'stellar' &&
      acc.network.match(/livenet|mainnet/) &&
      currency.crypto === 'XLM') ||
    (acc.crypto_type === 'stellar' &&
      acc.network === 'testnet' &&
      currency.crypto === 'TXLM') ||
    (acc.crypto_type === 'bitcoin' &&
      acc.network.match(/livenet|mainnet/) &&
      currency.crypto.match(/XBT|BTC/)) || // wyre_code is BTC
    (acc.crypto_type === 'bitcoin' &&
      acc.network === 'testnet' &&
      currency.crypto.match(/TXBT|XBT|BTC/)) ||
    (acc.crypto_type === 'ethereum' &&
      acc.network.match(/livenet|mainnet/) &&
      currency.crypto === 'ETH') ||
    (acc.crypto_type === 'ethereum' &&
      acc.network === 'testnet' &&
      currency.crypto.match(/TETH|ETH/))
  ) {
    return true;
  }
  return false;
};

export const renderCountry = country => {
  return getName(country);
};

export function addCommas(str) {
  var parts = (str + '').split('.'),
    main = parts[0],
    len = main.length,
    output = '',
    first = main.charAt(0),
    i;

  if (first === '-') {
    main = main.slice(1);
    len = main.length;
  } else {
    first = '';
  }
  i = len - 1;
  while (i >= 0) {
    output = main.charAt(i) + output;
    if ((len - i) % 3 === 0 && i > 0) {
      output = ',' + output;
    }
    --i;
  }
  output = first + output;
  if (parts.length > 1) {
    output += '.' + parts[1];
  }
  return output;
}

export const concatCryptoAccountNoName = account => {
  let value = '';

  let { address } = account;
  let memo = account.metadata && account.metadata.memo;

  if (memo) {
    value = value + (value ? ' ' : '') + (memo + '*');
  }

  if (address) {
    value = value + (value ? ' ' : '') + address;
  }

  return value;
};

export const formatTime = (time, format = 'lll', profile) => {
  if (!time) return '';
  const timezone = profile?.timezone;
  return timezone
    ? momentTz.tz(time, timezone).format(format)
    : moment(time).format(format);
};

export function scientificToDecimal(num) {
  var nsign = Math.sign(num);
  //remove the sign
  num = Math.abs(num);
  //if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    var zero = '0',
      parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
      e = parts.pop(), //store the exponential part
      l = Math.abs(e), //get the number of zeros
      sign = e / l,
      coeff_array = parts[0].split('.');
    if (sign === -1) {
      l = l - coeff_array[0].length;
      if (l < 0) {
        num =
          coeff_array[0].slice(0, l) +
          '.' +
          coeff_array[0].slice(l) +
          (coeff_array.length === 2 ? coeff_array[1] : '');
      } else {
        num = zero + '.' + new Array(l + 1).join(zero) + coeff_array.join('');
      }
    } else {
      var dec = coeff_array[1];
      if (dec) l = l - dec.length;
      if (l < 0) {
        num = coeff_array[0] + dec.slice(0, l) + '.' + dec.slice(l);
      } else {
        num = coeff_array.join('') + new Array(l + 1).join(zero);
      }
    }
  }

  return nsign < 0 ? '-' + num : num;
}

export const arrayToObject = (arr = [], keyField = 'id') =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

export const arrayToObjectNested = (arr, keyField, keyField2) => {
  if (!arr) {
    return {};
  }
  try {
    return Object.assign(
      {},
      ...arr.map(item => ({ [item[keyField][keyField2]]: item })),
    );
  } catch (e) {}
};

export const objectToArray = (obj, keyField) => {
  if (!obj) {
    return [];
  }
  return Object.keys(obj).map(key => {
    let item = obj?.[key];
    if (keyField && item) {
      item[keyField] = key;
    }
    return item;
  });
};

export function shiftToStart(array, field, value) {
  const index = array.findIndex(item => get(item, field) === value);
  array.unshift(array.splice(index, 1)[0]);
  return array;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUrl(scheme, address, options) {
  let url = '';
  if (scheme) {
    url = scheme + ':';
  }
  url = url + address + generateQueryString(options);
  return url;
}

export function generateQueryString(options) {
  let query = '';
  for (var key in options) {
    if (query !== '') {
      query += '&';
    } else {
      query = '?';
    }
    query += key + '=' + encodeURIComponent(options[key]);
  }
  return query;
}

export async function convertUriToBase64(uri) {
  const options = { encoding: FileSystem.EncodingTypes.Base64 };

  return await FileSystem.readAsStringAsync(uri, options);
}

export function cleanMobile(mobile) {
  return mobile.replace(/[()-]/g, '');
}

export function normalizeFontSize(size) {
  // return size;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const scale = SCREEN_WIDTH / 420;
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export function formatVoucherCode(code, separator = '-') {
  if (code.match(/-/)) return code;

  var parts = code.match(/[\s\S]{1,4}/g) || [];

  return parts.join(separator);
}

export function arrayToPlaceholder(array, options = {}) {
  const { deliminator = ',', lastDeliminator = 'or', crypto } = options ?? {};
  let placeholder;
  if (array?.length === 1) placeholder = array[0];
  else {
    if (crypto) {
      const index = array.findIndex(item => item === 'crypto');
      if (index !== -1) array[index] = cryptoCodeToType(crypto) + ' address';
    }
    const last = array.pop();
    placeholder = `${array.join(`${deliminator} `)} ${lastDeliminator} ${last}`;
  }

  return placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
}

export function cryptoCodeToType(code) {
  switch (code) {
    case 'XLM':
    case 'TXLM':
      return 'stellar';
    case 'XBT':
    case 'TXBT':
    case 'BTC':
      return 'bitcoin';
    case 'ETH':
    case 'TETH':
      return 'ethereum';
    default:
      return null;
  }
}

export function paramsToSearch(params) {
  let keys = Object.keys(params);
  if (keys.length === 0) return '';
  let search = '?';
  for (let key of keys) {
    search = search + key + '=' + encodeURIComponent(params[key]) + '&';
  }
  search = search.substring(0, search.length - 1);
  return search;
}
export function searchToObj(search = '') {
  search = search.replace('?', '');
  try {
    return JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}',
    );
  } catch (e) {
    console.log('🚀 ~ file: general.js ~ line 550 ~ searchToObj ~ e', e);
    return {};
  }
}

export function paramsToObj(search = '') {
  if (!search) return {};
  const urlParams = new URLSearchParams(search);
  const entries = urlParams.entries();
  let result = {};
  for (let entry of entries) {
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
}

export function getQueryVariable(query, variable) {
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return null;
}

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export function addCountryCode(number = '', country) {
  if (!country) country = 'US';
  const config = countryDialCodes.find(item => item.code === country);

  return cleanMobile(
    config?.dial_code + number.substring(number?.[0] === '0' ? 1 : 0),
  );
}

export function sentenceCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateInvoiceTotal(items, divisibility) {
  let totalAmount = 0;

  try {
    if (items && items.length > 0)
      items.map(item =>
        item
          ? (totalAmount = Big(totalAmount).plus(
              invoiceTotal(item, divisibility),
            ))
          : 0,
      );

    return totalAmount;
  } catch (e) {
    return 0;
  }
}
function invoiceTotal(item, divisibility) {
  const amount = parseFloat(item?.price ?? 0);
  const quantity = parseInt(item?.quantity ?? 1);
  const temp = parseFloat(
    Big(amount)
      .times(divisibility ? 10 ** divisibility : 1)
      .times(quantity),
  );
  return temp;
}

export function flattenPaginatedData(data) {
  return (data?.pages?.map(item => item?.results) ?? [])?.flat() ?? [];
}

export function concatName({ first_name, last_name }) {
  return first_name + (first_name && last_name && ' ') + last_name;
}

export function replaceAll(string, searchString = '', replaceString = '') {
  return typeof string === 'string'
    ? string.split(searchString).join(replaceString)
    : '';
}

const valueColors = {
  // defaults to font
  Paid: 'success',
  Refunded: 'info',
  'Partially refunded': 'info',
  'Overpaid & partially refunded': 'info',
  // Overpaid: 'success',
  Complete: 'success',
  Accepted: 'success',
  Underpaid: 'error',
  Rejected: 'error',
  Failed: 'error',
  Overpaid: 'info',
  // Draft: 'font',
  // Processing: 'font', //'primary',
  Available: 'success',
  Redeemed: 'info',

  Pending: 'warning',
  pending: 'warning',
  Placed: 'success',
  pending_settled: 'info',

  Enabled: 'success',
};

export function statusToColor(status) {
  return valueColors?.[status] ?? 'font';
}
