import Rehive from 'rehive';
import { getUserGroup, paramsToSearch } from './general';
import { pick } from 'lodash';

const staging = false;

let rehive_base_url = '';
let stellar_service_url = '';
let indacoin_service_url = '';
let stellar_testnet_service_url = '';
let bitcoin_service_url = '';
let bitcoin_testnet_service_url = '';
let ethereum_service_url = '';
let ethereum_testnet_service_url = '';
let rewards_service_url = '';
let product_service_url = '';
let conversion_service_url = '';
let notification_service_url = '';
let lightning_service_url = '';
let stripe_service_url = '';
let wyre_testnet_service_url = 'https://wyre.s.services.rehive.io/api';
let wyre_service_url = 'https://wyre.services.rehive.io/api';
let chipless_card_service_url = '';
let payment_request_service_url = '';
let mass_send_service_url = '';
const google_places_details = 'https://functions.rehive.io/places-details';
const google_places_predictions =
  'https://functions.rehive.io/places-autocomplete';
let business_service_url = '';
let app_service_url = 'https://app.services.rehive.io/api';

if (staging) {
  /* STAGING */
  rehive_base_url = 'https://api.staging.rehive.com/3';
  stellar_service_url = 'https://stellar.s.services.rehive.io/api/1';
  stellar_testnet_service_url =
    'https://stellar-testnet.s.services.rehive.io/api/1';
  bitcoin_service_url = 'https://bitcoin.s.services.rehive.io/api/1';
  bitcoin_testnet_service_url =
    'https://bitcoin-testnet.s.services.rehive.io/api/1';
  ethereum_service_url = 'https://ethereum.s.services.rehive.io/api/1';
  ethereum_testnet_service_url =
    'https://ethereum-testnet.s.services.rehive.io/api/1';
  rewards_service_url = 'https://reward.s.services.rehive.io/api';
  product_service_url = 'https://product.s.services.rehive.io/api';
  conversion_service_url = 'https://conversion.s.services.rehive.io/api';
  mass_send_service_url = 'https://csv-to-rehive.s.services.rehive.io';
  notification_service_url = 'https://notification.s.services.rehive.io/api';
  stripe_service_url = 'https://stripe.s.services.rehive.io/api';
  chipless_card_service_url = 'https://chipless-card.s.services.rehive.io/api';
  payment_request_service_url =
    'https://payment-requests.s.services.rehive.io/api';
  business_service_url = 'https://business.s.services.rehive.io/api';
} else {
  rehive_base_url = 'https://api.rehive.com/3';
  stellar_service_url = 'https://stellar.services.rehive.io/api/1';
  stellar_testnet_service_url =
    'https://stellar-testnet.services.rehive.io/api/1';
  bitcoin_service_url = 'https://bitcoin.services.rehive.io/api/1';
  bitcoin_testnet_service_url =
    'https://bitcoin-testnet.services.rehive.io/api/1';
  ethereum_service_url = 'https://ethereum.services.rehive.io/api/1';
  ethereum_testnet_service_url =
    'https://ethereum-testnet.services.rehive.io/api/1';
  rewards_service_url = 'https://reward.services.rehive.io/api';
  product_service_url = 'https://product.services.rehive.io/api';
  conversion_service_url = 'https://conversion.services.rehive.io/api';
  mass_send_service_url = 'https://csv-to-rehive.services.rehive.io';
  notification_service_url = 'https://notification.services.rehive.io/api';
  lightning_service_url = 'https://service-lightning.services.rehive.io/api';
  stripe_service_url = 'https://stripe.services.rehive.io/api';
  indacoin_service_url = 'https://indacoin.services.rehive.io/api';
  chipless_card_service_url = 'https://chipless-card.services.rehive.io/api';
  payment_request_service_url =
    'https://payment-requests.services.rehive.io/api';
  business_service_url = 'https://business.services.rehive.io/api';
}

// SDK initialization
export let r = null;
let token = '';
export const initWithoutToken = () => {
  if (r) {
    r.removeToken();
  } else {
    r = new Rehive({
      apiVersion: 3,

      network: staging ? 'staging' : 'production',
    });
  }
  token = '';
};
export const initWithToken = apiToken => {
  r = new Rehive({
    apiVersion: 3,
    apiToken,
    network: staging ? 'staging' : 'production',
  });
  token = apiToken;
};
// export const verifyToken = token => r.auth.tokens.verify({ token });
export const verifyToken = token =>
  callApi('GET', rehive_base_url + '/auth/', null, { customToken: token });

/* AUTHENTICATION */
export const login = data => r.auth.login(data);

export const register = data => r.auth.register(data);

export const logout = () => r.auth.logout();

export const resendEmailVerification = (email, company) =>
  r.auth.email.resendEmailVerification({ email, company });

export const resendMobileVerification = (mobile, company) =>
  r.auth.mobile.resendMobileVerification({ mobile, company });

export const resetPassword = data => r.auth.password.reset(data);

export const changePassword = data => r.auth.password.change(data);

export const submitOTP = otp => r.auth.mobile.verify({ otp });

/* MULTI FACTOR AUTHENTICATION */
export const getMFA = () => r.auth.mfa.status.get();

export const enableAuthSMS = mobile => r.auth.mfa.sms.enable({ mobile });

export const disableAuthSMS = () => r.auth.mfa.sms.disable();

export const sendAuthSMS = () => r.auth.mfa.sms.send();

export const enableAuthToken = () => r.auth.mfa.token.enable();

export const disableAuthToken = () => r.auth.mfa.token.disable();

export const verifyMFA = (payload, customToken) =>
  callApi('POST', rehive_base_url + '/auth/mfa/verify/', payload, {
    customToken,
    doThrow: true,
  });

// Start - NEW MFA helper method added

export const getMFAAuthenticators = (query = '') =>
  // @param query // example: verified=1
  // alternate to getMFA
  callApi('GET', `${rehive_base_url}/auth/mfa/authenticators/?${query}`);

export const createMFAAuthenticator = (type, details = {}) => {
  // alternate to enableSMS, enableToken
  // type: "totp", "sms", "static"

  const payload = { type, details };
  return callApi(
    'POST',
    rehive_base_url + '/auth/mfa/authenticators/',
    payload,
    { doThrow: true },
  );
};

export const deleteMfaAuthenticator = identifier =>
  // alternate to disable sms/token
  callApi(
    'DELETE',
    `${rehive_base_url}/auth/mfa/authenticators/${identifier}/`,
  );

export const deliverTokenForMFA = payload => {
  // alternate to sendAuthSMS
  return callApi('POST', rehive_base_url + '/auth/mfa/deliver/', payload);
};

// End - NEW MFA helper method added

/* USERS */
// Profile
export const getProfile = () => r.user.get();
export const getUser = token =>
  callApi('GET', rehive_base_url + '/user/', null, { customToken: token });

export const updateProfile = data => r.user.update(data);

export const updateProfileImage = file => {
  let formData = new FormData();
  formData.append('profile', file);

  let resp;
  try {
    resp = r.user.update(formData);
  } catch (error) {
    console.log(error.message);
  }
  return resp;
};

// Address
export const getAddresses = id => r.user.addresses.get(id);

export const createAddress = data => r.user.addresses.create(data);

export const updateAddress = data => r.user.addresses.update(data);

export const deleteAddress = id => r.user.addresses.delete(id);

// Bank Accounts

export const listAddress = () => r.user.addresses.get();
export const getBankAccount = id => r.user.bankAccounts.get(id);

export const getBankAccountsByFilter = (filter = '') =>
  callApi('GET', `${rehive_base_url}/user/bank-accounts/?${filter}`);

export const getBankAccounts = id => r.user.bankAccounts.get(id);

export const createBankAccount = data => r.user.bankAccounts.create(data);

export const updateBankAccount = (id, data) =>
  r.user.bankAccounts.update(id, data);

export const deleteBankAccount = id => r.user.bankAccounts.delete(id);

export const addBankAccountCurrency = (id, currency) =>
  callApi(
    'POST',
    rehive_base_url + '/user/bank-accounts/' + id + '/currencies/',
    { currency },
  );

export const deleteBankAccountCurrency = (id, currency) =>
  callApi(
    'DELETE',
    rehive_base_url +
      '/user/bank-accounts/' +
      id +
      '/currencies/' +
      currency +
      '/',
  );

// Crypto Accounts
export const getCryptoAccounts = id => r.user.cryptoAccounts.get(id);

export const createCryptoAccount = data => r.user.cryptoAccounts.create(data);

export const updateCryptoAccount = (id, data) =>
  r.user.cryptoAccounts.update(id, data);

export const deleteCryptoAccount = id => r.user.cryptoAccounts.delete(id);

// Documents
export const getDocuments = () => r.user.documents.get();

export const createDocument = (file, category, type) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('document_category', category);
  formData.append('document_type', type);
  return r.user.documents.create(formData);
};

export const createDocumentNew = (file, type, metadata = '') => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', type);
  formData.append('metadata', metadata);
  return r.user.documents.create(formData);
};

// Emails
export const getEmails = id => r.user.emails.get(id);

export const createEmail = data => r.user.emails.create(data);

export const updateEmail = (id, data) => r.user.emails.update(id, data);

export const deleteEmail = id => r.user.emails.delete(id);

// Mobiles
export const getMobiles = id => r.user.mobiles.get(id);

export const updateMobile = (id, data) => r.user.mobiles.update(id, data);

export const createMobile = data => r.user.mobiles.create(data);

export const deleteMobile = id => r.user.mobiles.delete(id);
// Mobiles
export const getDevices = (doThrow = false) =>
  callApi('GET', rehive_base_url + '/user/devices/', null, {
    doThrow,
  });

export const getDevice = id =>
  callApi('GET', rehive_base_url + '/user/devices/' + id + '/');

export const addDevice = data =>
  callApi('POST', rehive_base_url + '/user/devices/', data);

export const addDeviceApp = (id, data) =>
  callApi('POST', rehive_base_url + '/user/devices/' + id + '/apps/', data);

export const deleteDevice = id =>
  callApi('DELETE', rehive_base_url + '/user/devices/' + id + '/');

export const deleteDeviceApp = (id, appId) =>
  callApi(
    'DELETE',
    rehive_base_url + '/user/devices/' + id + '/apps/' + appId + '/',
  );

/* TRANSACTIONS */
export const getTransactions = filters => r.transactions.get({ filters });

export const getNextTransactions = () => r.transactions.getNext();

export const getTransactionCollections = filters =>
  r.transaction_collections.get({ filters });

export const getNextTransactionCollections = filters =>
  r.transaction_collections.getNext({ filters });

export const createCredit = (amount, currency) =>
  r.transactions.createCredit({
    amount: parseInt(amount, 0),
    currency,
  });

export const createDebit = data => r.transactions.createDebit(data);

export const createTransfer = data => r.transactions.createTransfer(data);

export const createTransactionCollection = transactions =>
  r.transaction_collections.create({ transactions });

export const getTransactionMessages = id =>
  callApi('GET', `${rehive_base_url}/transactions/${id}/messages/`);

export const getSubtypes = () =>
  callApi('GET', rehive_base_url + '/subtypes/', null, { doThrow: true });

export const getSubtype = id =>
  callApi('GET', rehive_base_url + '/subtypes/' + id + '/');

export const getExports = (resource, page) =>
  callApi(
    'GET',
    rehive_base_url +
      '/exports/?resource=' +
      resource +
      '&page_size=5' +
      (page ? '&page=' + page : ''),
    null,
    { doThrow: true },
  );

export const getExport = id =>
  callApi('GET', rehive_base_url + '/exports/' + id + '/', null, {
    doThrow: true,
  });

export const createExport = (resource, query, file_format) => {
  const data = { resource, page_size: 10000, query, file_format };
  return callApi('POST', rehive_base_url + '/exports/', data);
};

/* ACCOUNTS */
export const getAccounts = () => r.accounts.get();

export const getGroups = () => callApi('GET', rehive_base_url + '/groups/');

export const getTier = group =>
  callApi(
    'GET',
    rehive_base_url + '/groups/' + group + '/tiers/?active=true',
    null,
    { doThrow: true },
  );

export const getTiers = (group, doThrow = false) =>
  callApi('GET', rehive_base_url + '/groups/' + group + '/tiers/', null, {
    doThrow,
  });

// Create, retrieve, currencies?

export const setActiveCurrency = (reference, currencyCode) =>
  r.accounts.currencies.update(reference, currencyCode, { active: true });

/* COMPANY */
export const getCompany = () => r.company.get();

export const getCompanyCurrencies = () => r.company.currencies.get();

export const getCompanyBankAccounts = () => r.company.bankAccounts.get();

/* STRIPE */
export const setupStripeSession = data =>
  callApi('POST', stripe_service_url + '/user/sessions/', {
    mode: 'setup',
    ...data,
  });

export const makeStripePayment = data =>
  callApi('POST', stripe_service_url + '/user/payments/', data);

export const getStripePayment = id =>
  callApi('GET', stripe_service_url + '/user/payments/' + id + '/');

export const getStripeUser = () =>
  callApi('GET', stripe_service_url + '/user/');

export const getStripeCompany = () =>
  callApi('GET', stripe_service_url + '/user/company/');

export const getStripePaymentMethods = () =>
  callApi('GET', stripe_service_url + '/user/payment-methods/');

export const getStripeSessionStatus = id =>
  callApi('GET', stripe_service_url + '/user/session/' + id + '/');

export const getIndacoinUser = () =>
  callApi('GET', indacoin_service_url + '/user/');
export const getIndacoinCompany = () =>
  callApi('GET', indacoin_service_url + '/user/company/');

export const createIndacoinTransaction = data =>
  callApi('POST', indacoin_service_url + '/user/transactions/', data);

export const getIndacoinTransactions = filters =>
  callApi(
    'GET',
    indacoin_service_url +
      '/user/transactions/' +
      (filters ? '?' + filters : ''),
  );

export const getIndacoinRate = (
  currencyFrom,
  currencyTo,
  amount,
  partner,
  userId, //{currencyFrom}/{currencyTo}/{amount:decimal}/{partner?}/{userId?}
) =>
  callApi(
    'GET',
    'https://indacoin.com/api/GetCoinConvertAmount/' +
      currencyFrom +
      '/' +
      currencyTo +
      '/' +
      amount +
      '/' +
      partner +
      '/' +
      userId +
      '/',
    null,
    false,
    { is_file: true },
  );

/* PUBLIC */

export const getPublicCompanies = () => r.public.companies.get();

export const getPublicCompany = company =>
  callApi('GET', rehive_base_url + '/public/companies/' + company + '/');

export const getPublicCompanyGroups = company =>
  callApi('GET', rehive_base_url + '/public/companies/' + company + '/groups/');

export const getPublicCompanyGroup = (company, group) =>
  callApi(
    'GET',
    rehive_base_url + '/public/companies/' + company + '/groups/' + group + '/',
  );

export const getPublicWalletCompany = (bundleId, isAndroid) =>
  callApi(
    'GET',
    `${wallet_service_url}/public/company?${
      isAndroid ? 'android_package' : 'ios_bundle_identifier'
    }=${bundleId}`,
    null,
    { doThrow: true },
  );

/* CHIPLESS CARD */
export const getChiplessCards = () =>
  callApi('GET', chipless_card_service_url + '/user/cards/');

export const createChiplessCard = data =>
  callApi('POST', chipless_card_service_url + '/user/cards/', data);

export const updateChiplessCard = (cardId, data) =>
  callApi(
    'PATCH',
    chipless_card_service_url + '/user/cards/' + cardId + '/',
    data,
  );

export const getChiplessCardLimits = cardId =>
  callApi(
    'GET',
    chipless_card_service_url + '/user/cards/' + cardId + '/limits/',
  );

export const createChiplessCardLimit = (cardId, data) =>
  callApi(
    'POST',
    chipless_card_service_url + '/user/cards/' + cardId + '/limits/',
    data,
  );

export const removeChiplessCardLimit = (cardId, limitId) =>
  callApi(
    'DELETE',
    chipless_card_service_url +
      '/user/cards/' +
      cardId +
      '/limits/' +
      limitId +
      '/',
  );

export const updateChiplessCardLimit = (cardId, limitId, data) =>
  callApi(
    'PATCH',
    chipless_card_service_url +
      '/user/cards/' +
      cardId +
      '/limits/' +
      limitId +
      '/',
    data,
  );

/* NOTIFICATIONS */
export const getNotifications = () =>
  callApi(
    'GET',
    notification_service_url + '/user/notifications/?page_size=250',
    null,
    { doThrow: true }, //
  );

export const updateNotification = (id, data) =>
  callApi(
    'PATCH',
    notification_service_url + '/user/notifications/' + id + '/',
    data,
  );

/* CRYPTO */
export const getStellarAssets = testnet =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/company/assets/',
  );

export const getStellarCompany = testnet =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) + '/company/',
  );

export const setStellarUsername = (data, testnet) =>
  callApi(
    'PATCH',
    (testnet ? stellar_testnet_service_url : stellar_service_url) + '/user/',
    data,
  );

export const getStellarKnownPublicAddresses = testnet =>
  callApi(
    'GET',
    (testnet ? stellar_testnet_service_url : stellar_service_url) +
      '/user/known-public-addresses/',
  );

export const getBitcoinCompany = testnet =>
  callApi(
    'GET',
    (testnet ? bitcoin_testnet_service_url : bitcoin_service_url) + '/company/',
  );

function getCryptoUrl(type) {
  let url = '';
  switch (type) {
    case 'TXBT':
      url = bitcoin_testnet_service_url;
      break;
    case 'XBT':
      url = bitcoin_service_url;
      break;
    case 'TETH':
      url = ethereum_testnet_service_url;
      break;
    case 'ETH':
      url = ethereum_service_url;
      break;
    case 'TXLM':
      url = stellar_testnet_service_url;
      break;
    default:
      url = stellar_service_url;
      break;
  }
  return url;
}

export const getCryptoUser = type => {
  let url = getCryptoUrl(type);
  return callApi('GET', url + '/user/');
};

export const getCryptoCompany = type => {
  let url = getCryptoUrl(type);
  return callApi('GET', url + '/company/', null, { doThrow: true });
};

export const createCryptoTransfer = data => {
  let url = '';
  switch (data.crypto) {
    case 'TXBT':
      url = bitcoin_testnet_service_url + '/wallet/send/';
      break;
    case 'XBT':
      url = bitcoin_service_url + '/wallet/send/';
      break;
    case 'TETH':
      url = ethereum_testnet_service_url + '/wallet/send/';
      break;
    case 'ETH':
      url = ethereum_service_url + '/wallet/send/';
      break;
    case 'TXLM':
      url = stellar_testnet_service_url + '/transactions/send/';
      break;
    case 'XLM':
    default:
      url = stellar_service_url + '/transactions/send/';
      break;
  }

  delete data.crypto;
  return new Promise((resolve, reject) =>
    callApi('POST', url, data)
      .then(response => {
        if (response.ok || response.status === 'success') {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(err => reject(err)),
  );
};

/* REWARDS */
export const getRewards = (query = '') =>
  callApi('GET', rewards_service_url + '/user/rewards/' + query);

export const getReward = id =>
  callApi('GET', rewards_service_url + '/user/rewards/' + id + '/');

export const claimReward = data =>
  callApi('POST', rewards_service_url + '/user/rewards/', data);

export const getCampaigns = query =>
  callApi('GET', rewards_service_url + '/user/campaigns/' + query);

export const getCampaign = id =>
  callApi('GET', rewards_service_url + '/user/campaigns/' + id + '/');

export const getReferralCode = () =>
  callApi('GET', rewards_service_url + '/user/');

export const setRefereeCode = referee_code =>
  callApi('PATCH', rewards_service_url + '/user/', { referee_code });

/* PRODUCTS */
export const getProducts = (query = '') =>
  callApi('GET', product_service_url + '/user/products/' + query);

export const getProductsNew = (query = '') =>
  callApi('GET', product_service_url + '/user/products/' + query, null, {
    doThrow: true,
  });

export const getVouchers = query =>
  callApi(
    'GET',
    product_service_url + '/user/vouchers/' + (query ? '?' + query : ''),
  );
export const getVoucher = id =>
  callApi('GET', product_service_url + '/user/vouchers/' + id + '/', null, {
    doThrow: true,
  });

export const updateVoucher = (id, status) =>
  callApi('PATCH', product_service_url + '/user/vouchers/' + id + '/', {
    status,
  });

export const updateVoucherAdmin = (id, status) =>
  callApi('PATCH', product_service_url + '/admin/vouchers/' + id + '/', {
    status,
  });

export const getVouchersAdmin = query =>
  callApi(
    'GET',
    product_service_url + '/admin/vouchers/' + (query ? '?' + query : ''),
  );
export const getVouchersMerchant = query =>
  callApi(
    'GET',
    product_service_url + '/merchant/vouchers/' + (query ? '?' + query : ''),
  );

export const updateVoucherMerchant = (id, status) =>
  callApi('PATCH', product_service_url + '/merchant/vouchers/' + id + '/', {
    status,
  });
export const getSellers = () =>
  callApi('GET', product_service_url + `/user/sellers/`, null, {
    doThrow: true,
  });
export const getManagerSellers = () =>
  callApi('GET', product_service_url + `/manager/sellers/`, null, {
    doThrow: true,
  });

export const getSellerVoucherActions = (sellerId, voucherId) =>
  callApi(
    'GET',
    product_service_url +
      `/manager/sellers/${sellerId}/vouchers/${voucherId}/actions/`,
    null,
    {
      doThrow: true,
    },
  );

export const getSellerVoucherAction = (sellerId, voucherId, actionId) =>
  callApi(
    'GET',
    product_service_url +
      `/manager/sellers/${sellerId}/vouchers/${voucherId}/actions/${actionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const getManagerVoucherActions = voucherId =>
  callApi(
    'GET',
    product_service_url + `/manager/vouchers/${voucherId}/actions/`,
    null,
    {
      doThrow: true,
    },
  );

export const getUserVoucherActions = voucherId =>
  callApi(
    'GET',
    product_service_url + `/user/vouchers/${voucherId}/actions/`,
    null,
    {
      doThrow: true,
    },
  );

export const verifyManagerVoucherCode = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + `/manager/sellers/${sellerId}/vouchers/query/`,
    data,
    {
      doThrow: true,
    },
  );

export const createAdminRedemption = data =>
  callApi('POST', product_service_url + `/admin/redemptions/`, data, {
    doThrow: true,
  });

export const getAdminRedemption = redemptionId =>
  callApi(
    'GET',
    product_service_url + `/admin/redemptions/${redemptionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const createManagerRedemption = (sellerId, data) =>
  callApi(
    'POST',
    product_service_url + `/manager/sellers/${sellerId}/redemptions/`,
    data,
    {
      doThrow: true,
    },
  );

export const getManagerRedemptions = sellerId =>
  callApi(
    'GET',
    product_service_url + `/manager/sellers/${sellerId}/redemptions/`,
    null,
    {
      doThrow: true,
    },
  );

export const getManagerRedemption = (sellerId, redemptionId) =>
  callApi(
    'GET',
    product_service_url +
      `/manager/sellers/${sellerId}/redemptions/${redemptionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const createUserRedemption = data =>
  callApi('POST', product_service_url + `/manager/redemptions/`, data, {
    doThrow: true,
  });

export const getUserRedemptions = sellerId =>
  callApi('GET', product_service_url + `/user/redemptions/`, null, {
    doThrow: true,
  });

export const getUserRedemption = (sellerId, redemptionId) =>
  callApi(
    'GET',
    product_service_url + `/user/redemptions/${redemptionId}/`,
    null,
    {
      doThrow: true,
    },
  );

export const getOrders = query =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + (query ? '?' + query : ''),
  );

export const getOrdersNew = query =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + (query ? '?' + query : ''),
    null,
    { doThrow: true },
  );

export const getOrder = id =>
  callApi('GET', product_service_url + '/user/orders/' + id + '/');

export const getOrderItems = orderID =>
  callApi('GET', product_service_url + '/user/orders/' + orderID + '/items/');

export const getOrderItemsNew = orderID => {
  return callApi(
    'GET',
    product_service_url + '/user/orders/' + orderID + '/items/',
    null,
    { doThrow: true },
  );
};

export const getOrderItem = (orderID, itemID, doThrow) =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + orderID + '/items/' + itemID + '/',
    null,
    { doThrow },
  );

export const createOrder = currency =>
  callApi('POST', product_service_url + '/user/orders/', {
    currency,
  });
export const updateOrder = (id, data) =>
  callApi('PUT', product_service_url + '/user/orders/' + id + '/', data);

export const createOrderPayment = id =>
  callApi('POST', product_service_url + '/user/orders/' + id + '/payments/', {
    type: 'rehive',
  });

export const getOrderPayment = (id, paymentId) =>
  callApi(
    'GET',
    product_service_url + '/user/orders/' + id + '/payments/' + paymentId + '/',
    null,
    { doThrow: true },
  );

export const completeOrder = id =>
  callApi('PATCH', product_service_url + '/user/orders/' + id + '/', {
    status: 'complete',
  });

export const deleteOrder = id =>
  callApi('DELETE', product_service_url + '/user/orders/' + id + '/', {
    status: 'complete',
  });

export const createOrderItem = (orderID, product, quantity) =>
  callApi('POST', product_service_url + '/user/orders/' + orderID + '/items/', {
    product,
    quantity,
  });
export const createOrderItemNew = (orderID, data) =>
  callApi(
    'POST',
    product_service_url + '/user/orders/' + orderID + '/items/',
    data,
  );

export const updateOrderItem = (orderID, itemID, quantity) =>
  callApi(
    'PATCH',
    product_service_url + '/user/orders/' + orderID + '/items/' + itemID + '/',
    {
      quantity,
    },
  );

export const deleteOrderItem = (orderID, itemID) =>
  callApi(
    'DELETE',
    product_service_url + '/user/orders/' + orderID + '/items/' + itemID + '/',
    {
      status: 'complete',
    },
  );

export const getProductCategories = () =>
  callApi(
    'GET',
    product_service_url + '/user/categories/?page_size=250',
    null,
    { doThrow: true },
  );

// Merchant products
export const getMerchantProducts = (sellerId, search = '') =>
  callApi(
    'GET',
    product_service_url +
      '/manager/sellers/' +
      sellerId +
      '/products/' +
      search,
    null,
    { doThrow: true },
  );

/* CONVERSION */
export const getConversionRates = keys =>
  callApi(
    'GET',
    conversion_service_url + '/user/rates/snapshot/?key__in=' + keys,
    // null,
    // { doThrow: true },
  );
export const getConversionRate = (currency, created) =>
  callApi(
    'GET',
    conversion_service_url +
      '/user/rates/snapshot/?key__in=' +
      currency +
      '&created__lt=' +
      created,
  );

export const getConversionSettings = (doThrow = false) =>
  callApi('GET', conversion_service_url + '/user/settings/', null, {
    doThrow,
  });

export const getConversionCurrencies = (doThrow = false) =>
  callApi(
    'GET',
    conversion_service_url + '/user/currencies/?page_size=250',
    null,
    {
      doThrow,
    },
  );

export const getConversionCurrency = id =>
  callApi(
    'GET',
    conversion_service_url + '/user/currencies/?code=' + id,
    // null,
    // { doThrow: true },
  );

export const setConversionSettings = data =>
  callApi('PATCH', conversion_service_url + '/user/settings/', data);

export const getConversionPairs = () =>
  callApi(
    'GET',
    conversion_service_url + '/user/conversion-pairs/?page_size=250',
    // null,
    // { doThrow: true },
  );

export const getConversion = id =>
  callApi('GET', conversion_service_url + '/user/conversions/' + id + '/');

export const getConversions = query =>
  callApi(
    'GET',
    conversion_service_url + '/user/conversions/' + (query ? '?' + query : ''),
  );

export const createConversion = data =>
  callApi('POST', conversion_service_url + '/user/conversions/', data);

export const updateConversion = (id, status, doThrow) =>
  callApi(
    'PATCH',
    conversion_service_url + '/user/conversions/' + id + '/',
    {
      status,
    },
    { doThrow },
  );

/* PAYMENT REQUESTS */

export const getPaymentRequests = (query, doThrow = false) =>
  callApi(
    'GET',
    `${payment_request_service_url}/user/requests/${query ? query : ''}`,
    null,
    { doThrow },
  );

export const getReceivedPaymentRequests = (query, doThrow = false) =>
  callApi(
    'GET',
    `${payment_request_service_url}/user/requests/${query ? query : ''}`,
    // {
    //   request_type: 'payer',
    // },
    null,
    { doThrow },
  );

export const getPaymentRequest = (id, doThrow = false) =>
  callApi('GET', payment_request_service_url + '/requests/' + id + '/', null, {
    doThrow,
  });

export const createPaymentRequest = data =>
  callApi('POST', payment_request_service_url + '/user/requests/', {
    ...data,
    status: 'initiated',
  });

export const updatePaymentRequest = (id, data) =>
  callApi('PATCH', payment_request_service_url + '/requests/' + id + '/', {
    ...data,
  });

export const cancelPaymentRequest = (id, { incoming = false }) =>
  callApi(
    'PATCH',
    payment_request_service_url +
      `${incoming ? '' : '/user'}/requests/` +
      id +
      '/',
    {
      status: 'cancelled',
    },
  );

export const notifyPaymentRequest = id =>
  callApi(
    'POST',
    payment_request_service_url + '/user/requests/' + id + '/notify/',
  );

/* LIGHTNING */
export const uploadWithdrawalInvoice = invoice =>
  callApi('POST', lightning_service_url + '/withdrawals/', { invoice });

/* GENERAL */
export const getNext = link => callApi('GET', link);

export const callApi = (method, route, data, options = {}) => {
  const { is_file, customToken, doThrow } = options;
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token || customToken) {
    headers['Authorization'] = 'Token ' + (customToken ? customToken : token);
  }

  let config = {
    method,
    mode: 'cors',
    headers,
  };
  if (data) {
    config['body'] = is_file ? data : JSON.stringify(data);
  }

  return Promise.resolve(
    fetch(route, config)
      .then(response => {
        if (doThrow) {
          return parseApi(response.json());
        }
        return response.json();
      })
      .catch(err => {
        if (doThrow) throw err;
        return err;
      }),
  );
};
async function parseApi(resp) {
  const response = await resp;
  if (response.status == 'success') {
    if (response?.data?.data) {
      return response.data.data;
    } else if (response?.data) {
      return response.data;
    } else if (response?.message) {
      return { message: response.message };
    } else {
      return {};
    }
  } else {
    throw response;
    // if (response.data) {
    //   throw {
    //     status: response.status_code,
    //     message: response.message,
    //     data: response.data,
    //   };
    // } else {
    //   throw { status: response.status_code, message: response.message };
    // }
  }
}
export const primaryItem = (type, data) => {
  return updateItem(type, { ...data, primary: true });
};

export const updateItem = (type, data) => {
  let response = null;

  switch (type) {
    case 'mobile':
      if (data.id) {
        response = updateMobile(data.id, data);
      } else {
        response = createMobile(data);
      }
      break;
    case 'address':
      if (data.id) {
        response = updateAddress(data);
      } else {
        response = createAddress(data);
      }
      break;
    case 'email':
      if (data.id) {
        response = updateEmail(data.id, data);
      } else {
        response = createEmail(data);
      }
      break;
    case 'crypto_account':
      if (data.id) {
        response = updateCryptoAccount(data.id, data);
      } else {
        response = createCryptoAccount(data);
      }
      break;
    case 'bank_account':
      if (data.id) {
        response = updateBankAccount(data.id, data);
      } else {
        response = createBankAccount(data);
      }
      break;
    case 'profile':
      const parts = data?.profile?.uri.split('/');
      const name = parts?.[parts?.length - 1];
      const file = {
        uri: data?.profile?.uri,
        name,
        type: 'image/jpg',
      };
      response = updateProfileImage(file);
      break;
    case 'central_bank':
      response = updateProfile({
        central_bank_number: data.central_bank_number,
      });
      break;
    case 'user':
      response = updateProfile(
        pick(data, [
          'first_name',
          'last_name',
          'id_number',
          'birth_date',
          'nationality',
          'gender',
          'mothers_name',
          'fathers_name',
          'title',
          'marital_status',
          'grandfathers_name',
          'grandmothers_name',
        ]),
      );
      break;
    case 'address':
      response = updateAddress(data);
      break;
  }
  return Promise.resolve(response);
};

export const deleteItem = (type, id) => {
  let response = null;
  switch (type) {
    case 'mobile':
      response = deleteMobile(id);
      break;
    case 'address':
      response = deleteAddress(id);
      break;
    case 'email':
      response = deleteEmail(id);
      break;
    case 'crypto_account':
      response = deleteCryptoAccount(id);
      break;
    case 'bank_account':
      response = deleteBankAccount(id);
      break;
  }

  return Promise.resolve(response);
};

export const resendVerification = async (type, data, company) => {
  let response = null;
  switch (type) {
    case 'mobile':
      response = await resendMobileVerification(
        data?.number ?? data,
        company?.id ?? company,
      );
      break;
    case 'email':
      response = await resendEmailVerification(
        data?.email ?? data,
        company?.id ?? company,
      );
      break;
  }

  return response;
};

export const getPaymentRequestMethods = id =>
  callApi(
    'GET',
    payment_request_service_url + '/requests/' + id + '/payment_processors/',
  );

export const choosePaymentRequestMethod = (id, data) =>
  callApi('PATCH', payment_request_service_url + '/requests/' + id + '/', data);

export const getPlacePredictions = queryString =>
  callApi(
    'GET',
    `${google_places_predictions}?input=${encodeURI(queryString)}`,
  );

export const getPlaceDetails = placeId =>
  callApi('GET', `${google_places_details}?place_id=${placeId}`);

export const getBusinessServiceSettings = () =>
  callApi('GET', business_service_url + '/user/company/', null, {
    doThrow: true,
  });
export const getBusinessProfile = businessId =>
  callApi(
    'GET',
    business_service_url + '/manager/businesses/' + businessId + '/',
  );
export const getBusinesses = () =>
  callApi('GET', business_service_url + '/manager/businesses/', null, {
    doThrow: true,
  });

export const updateBusinessInvoice = (businessId, invoiceId, data) =>
  callApi(
    'PATCH',
    business_service_url +
      '/manager/businesses/' +
      businessId +
      '/invoices/' +
      invoiceId +
      '/',
    data,
  );
export const notifyInvoice = invoiceId =>
  callApi(
    'POST',
    payment_request_service_url + '/user/requests/' + invoiceId + '/notify/',
  );

export const createBusinessInvoice = (businessId, data) =>
  callApi(
    'POST',
    business_service_url + '/manager/businesses/' + businessId + '/invoices/',
    data,
  );

export const fetchItems = (type, context) => {
  let response = null;
  switch (type) {
    case 'wyre-user-onboarding':
      response = getWyreUserOnboarding();
      break;
    case 'mobile':
      response = getMobiles();
      break;
    case 'address':
      response = getAddresses();
      break;
    case 'email':
      response = getEmails();
      break;
    case 'crypto_account':
    case 'cryptoAccount':
      response = getCryptoAccounts();
      break;
    case 'bank_account':
    case 'bankAccount':
      response = getBankAccounts();
      break;

    case 'businessServiceSettings':
      response = getBusinessServiceSettings();
      break;
    case 'businesses':
      response = getBusinesses();
      break;
    case 'sellers':
      response = getSellers();
      break;
    case 'manager-sellers':
      response = getManagerSellers();
      break;

    case 'document':
    case 'documents':
      response = getDocuments();
      break;

    case 'tier':
      response = getTier(getUserGroup(context?.user));
      break;

    case 'tiers':
      response = getTiers(getUserGroup(context?.user), true);
      break;

    case 'conversionCurrencies':
    case 'displayCurrency':
      response = getConversionCurrencies(true);
      break;
    case 'currencies':
    case 'accounts':
    case 'wallets':
      response = getAccounts();
      break;
    case 'conversionRates':
      response = getConversionSettings(true);
      break;
    case 'conversionPairs':
      response = getConversionCurrencies();
      break;
    case 'devices':
      response = getDevices(true);
      break;
    case 'notifications':
      response = getNotifications();
      break;
    case 'referralCode':
      response = getReferralCode();
      break;
    case 'companyBankAccounts':
      response = getCompanyBankAccounts();
      break;
  }

  return Promise.resolve(response);
};

export const fetchItem = (type, id) => {
  let response = null;
  switch (type) {
    case 'mobile':
      response = getMobiles(id);
      break;
    case 'address':
      response = getAddresses(id);
      break;
    case 'email':
      response = getEmails(id);
      break;
    case 'crypto_account':
    case 'cryptoAccount':
      response = getCryptoAccounts(id);
      break;
    case 'bank_account':
    case 'bankAccount':
      response = getBankAccounts(id);
      break;
  }

  return Promise.resolve(response);
};

/* WYRE */
export const createWyreOrderReserve = ({ testnet, data } = {}) =>
  callApi(
    'POST',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/wallet_order_reserve/`,
    data,
  );

export const getWyreUser = ({ testnet = false } = {}) =>
  callApi(
    'GET',
    `${testnet ? wyre_testnet_service_url : wyre_service_url}/user/`,
  );

export const getWyreUserOnboarding = ({ testnet = false } = {}) =>
  callApi(
    'POST',
    `${testnet ? wyre_testnet_service_url : wyre_service_url}/user/onboarding/`,
    null,
    { doThrow: true },
  );

export const getWyreAccounts = ({ testnet = false } = {}) =>
  callApi(
    'GET',
    `${testnet ? wyre_testnet_service_url : wyre_service_url}/user/accounts/`,
    null,
    { doThrow: true },
  );

export const getWyrePaymentMethods = ({ testnet = false, search = '' } = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/payment_methods/` + search,
    null,
    { doThrow: true },
  );

export const getWyrePaymentMethod = ({
  testnet = false,
  paymentMethodId,
  filters,
} = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/payment_methods/${paymentMethodId}/${paramsToSearch(filters)}`,
    null,
    { doThrow: true },
  );

export const createWyrePaymentMethod = ({ testnet = false, id, data } = {}) =>
  callApi(
    'POST',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/account/${id}/payment_methods/`,
    data,
  );

export const getWyreAccountTransfers = ({ testnet = false, id } = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/account/${id}/transfers/`,
  );

export const getWyreTransfer = ({ testnet = false, id } = {}) =>
  callApi(
    'POST',
    `${testnet ? wyre_testnet_service_url : wyre_service_url}/user/transfers/`,
    null,
    { doThrow: true },
  );

export const createWyreTransfer = ({ testnet = false, id, data } = {}) =>
  callApi(
    'POST',
    `${testnet ? wyre_testnet_service_url : wyre_service_url}/user/transfers/`,
    data,
    { doThrow: true },
  );

export const createWyreAccountTransfer = ({ testnet = false, id, data } = {}) =>
  callApi(
    'POST',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/account/${id}/transfers/`,
    data,
    { doThrow: true },
  );

export const getWyreWallets = ({ testnet = false, filters = {} } = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/wallets/${paramsToSearch(filters)}`,
    null,
    { doThrow: true },
  );

export const getWyreWallet = ({ testnet = false, walletId } = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/wallets/${walletId}/`,
    null,
    { doThrow: true },
  );

export const getWyreCurrencies = ({
  testnet = false,
  page = 1,
  pageSize = 100,
} = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/company/currencies/?page=${page}&page_size=${pageSize}`,
    null,
    { doThrow: true },
  );

export const getWyreCurrency = ({ testnet = false, currencyCode } = {}) =>
  callApi(
    'GET',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/company/currencies/${currencyCode}/`,
    null,
    { doThrow: true },
  );

export const createWyreLinkToken = ({ testnet = false } = {}) =>
  callApi(
    'POST',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/plaid_link/create_link_token/`,
    null,
    {
      doThrow: true,
    },
  );

export const exchangeWyrePublicToken = ({ testnet = false, data } = {}) =>
  callApi(
    'POST',
    `${
      testnet ? wyre_testnet_service_url : wyre_service_url
    }/user/plaid_link/exchange_public_token/`,
    data,
    // {
    //   doThrow: true,
    // },
  );

export const exchangePlaidPublicToken = ({ testnet = false, data } = {}) =>
  callApi(
    'POST',
    `https://sandbox.plaid.com/item/public_token/exchange`,
    data,
    // {
    //   doThrow: true,
    // },
  );

export const getAccountInformation = data => {
  // console.log('in account Infotmation', JSON.stringify(data));
  callApi(
    'POST',
    `https://sandbox.plaid.com/auth/get`,
    data,
    // {
    //   doThrow: true,
    // },
  );
};

/* App service (config/locales) */
export const getCompanyAppConfig = (companyId, doThrow = true) =>
  callApi(
    'GET',
    app_service_url + '/public/company/?company_id=' + companyId,
    null,
    {
      doThrow,
    },
  );

export const getUserAppConfig = (doThrow = true) =>
  callApi('GET', app_service_url + '/user/', null, {
    doThrow,
  });

export const updateUserAppConfig = () =>
  callApi('PATCH', app_service_url + '/user/');

export const getUserLocales = (doThrow = true) =>
  callApi('GET', app_service_url + '/user/locales/', null, {
    doThrow,
  });

export const getUserLocale = (id, doThrow = true) =>
  callApi('GET', app_service_url + '/user/locales/' + id + '/', null, {
    doThrow,
  });

export const updateUserLocale = (id, data) =>
  callApi('PATCH', app_service_url + '/user/locales/' + id + '/', data);

export const getLocales = (company, doThrow = true) =>
  callApi(
    'GET',
    app_service_url + `/public/company/${company}/locales/`,
    null,
    {
      doThrow,
    },
  );

export const getLocale = (company, id, doThrow = true) =>
  callApi(
    'GET',
    app_service_url + `/public/company/${company}/locales/${id}/`,
    null,
    {
      doThrow,
    },
  );

export const createDynamicAccount = async data => {
  // console.log("create providus ooo", JSON.stringify(data));
  // callApi('POST','https://providus.krillpay.com/virtual/createdynamicaccount',data);

  let response = await fetch(
    'https://providus.krillpay.com/virtual/createdynamicaccount',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  let json = await response.json();
  return json;
};

export const requestAccDelete = data =>
  callApi('POST', `${rehive_base_url}/auth/deactivate/`, data);

const transactionsUrl = 'https://rehive.krillpay.com/transactions/list';
export const fetchRehiveTransactions = identifier => {
  const payload = {
    apiToken: token,
    identifier: identifier,
  };

  return new Promise((resolve, reject) => {
    fetch(transactionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};
