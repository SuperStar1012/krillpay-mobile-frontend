const EMPTY_ADDRESS = {
  line_1: '',
  line_2: '',
  city: '',
  state_province: '',
  country: '',
  postal_code: '',
};

const EMPTY_BANK_ACCOUNT = {
  name: '',
  number: '',
  type: '',
  bank_name: '',
  bank_code: '',
  branch_code: '',
  swift: '',
  iban: '',
  currencies: [],
  ...EMPTY_ADDRESS,
};
const EMPTY_PROFILE = {
  first_name: '',
  last_name: '',
  nationality: '',
  id_number: '',
  // language: '',
  timezone: '',
  birth_date: null,
  gender: '',
  title: '',
  marital_status: '',
  fathers_name: '',
  mothers_name: '',
  grandfathers_name: '',
  grandmothers_name: '',
};

const EMPTY_MOBILE = { number: '' };

const EMPTY_CENTRAL_BANK_NUMBER = { central_bank_number: '' };

const EMPTY_EMAIL = { email: '' };

const EMPTY_CRYPTO = { address: '', crypto_type: '' };

export {
  EMPTY_ADDRESS,
  EMPTY_CENTRAL_BANK_NUMBER,
  EMPTY_BANK_ACCOUNT,
  EMPTY_CRYPTO,
  EMPTY_EMAIL,
  EMPTY_MOBILE,
  EMPTY_PROFILE,
};
