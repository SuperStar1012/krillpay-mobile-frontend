import * as _inputs from './inputs';

export const profile = {
  profile: _inputs.profile_pic,
};
export const central_bank = {
  central_bank_number: _inputs.central_bank_number,
};
export const user = {
  first_name: _inputs.first_name,
  last_name: _inputs.last_name,
  id_number: _inputs.id_number,
  nationality: _inputs.nationality,
  timezone: _inputs.timezone,
  birth_date: _inputs.birth_date,
  gender: _inputs.gender,
  title: _inputs.title,
  marital_status: _inputs.marital_status,
  fathers_name: _inputs.fathers_name,
  mothers_name: _inputs.mothers_name,
  grandfathers_name: _inputs.grandfathers_name,
  grandmothers_name: _inputs.grandmothers_name,
  // mobile: _inputs.mobile,
  // username: _inputs.username,
};

export const address = {
  line_1: _inputs.line_1,
  line_2: _inputs.line_2,
  city: _inputs.city,
  postal_code: _inputs.postal_code,
  state_province: _inputs.state_province,
  country: _inputs.country,
  type: _inputs.addressType,
};

export const email = {
  email: _inputs.email,
};

export const mobile = {
  number: _inputs.mobile_number,
};

export const bank_account = {
  name: _inputs.account_name,
  number: _inputs.account_number,
  type: _inputs.type,
  bank_name: _inputs.bank_name,
  bank_code: _inputs.bank_code,
  branch_code: _inputs.branch_code,
  swift: _inputs.swift,
  iban: _inputs.iban,
  currencies: _inputs.currencies,
};

export const crypto_account = {
  name: _inputs.account_name,
  address: _inputs.cryptoAddress,
  memo: _inputs.memo,
  memoSkip: _inputs.memoSkipAccount,
  federationAddress: _inputs.federationAddressAccount,
};

export const auth = {
  id_number: _inputs.id_number,
  first_name: _inputs.first_name,
  last_name: _inputs.last_name,
  mobile: _inputs.mobile,
  username: _inputs.username,
  nationality: _inputs.nationality,
  email: _inputs.email,
  password: _inputs.password,
  confirm_password: _inputs.confirm_password,
  merchant: _inputs.merchant,
  referral: _inputs.referral,
};

export const password = {
  new_password: _inputs.new_password,
  old_password: _inputs.old_password,
  confirm_password: _inputs.confirm_password,
};

export const send = {
  amount: _inputs.amount,
  emailRecipient: _inputs.emailRecipient,
  mobileRecipient: _inputs.mobileRecipient,
  cryptoRecipient: _inputs.cryptoRecipient,
  note: _inputs.note,
  memo: _inputs.memo,
  currency: _inputs.currency,
  recipient: _inputs.recipient,
  recipientSearch: _inputs.recipientSearch,
};

export const receive = {
  amount: _inputs.amount,
  emailRecipient: _inputs.emailRecipient,
  mobileRecipient: _inputs.mobileRecipient,
  cryptoRecipient: _inputs.cryptoRecipient,
  note: _inputs.note,
  memo: _inputs.memo,
  currency: _inputs.currency,
};

export const request = {
  amount: _inputs.amount,
};

export const exchange = {
  buy: _inputs.buy,
  sell: _inputs.sell,
  exchangeCurrency: _inputs.exchangeCurrency,
};

export const redeemVoucher = {
  code: _inputs.voucher_code,
};

export const Inputs = _inputs;
