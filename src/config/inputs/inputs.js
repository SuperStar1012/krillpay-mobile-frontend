export const line_1 = {
  id: 'line_1',
  label: 'line_1',
  placeholder: 'line_1_placeholder',
};

export const line_2 = {
  id: 'line_2',
  label: 'line_2',
  placeholder: 'line_2_placeholder',
};

export const city = {
  id: 'city',
  placeholder: 'city_placeholder',
  textContentType: 'addressCity',
};

export const postal_code = {
  id: 'postal_code',
  placeholder: 'postal_code_placeholder',
};

const stateProvinceOptions = [
  { label: 'Alabama', value: 'alabama', key: 'alabama' },
  { label: 'Alaska', value: 'alaska', key: 'alaska' },
  { label: 'Arizona', value: 'arizona', key: 'arizona' },
  { label: 'Arkansas', value: 'arkansas', key: 'arkansas' },
];

export const state_province = {
  id: 'state_province',
  type: 'location',
  placeholder: 'state_province_placeholder',
  type: 'select',
  options: stateProvinceOptions,
};

export const country = {
  id: 'country',
  type: 'country',
  placeholder: 'country_placeholder',
};

export const addressType = {
  id: 'addressType',
  label: 'address_type',
  type: 'addressType',
};

export const account_holder = {
  id: 'name',
  placeholder: 'e.g. John Snow',
};

export const account_name = {
  id: 'name',
  placeholder: 'e.g. Personal account',
};

export const account_number = {
  id: 'number',
  placeholder: 'e.g. 4083764677',
};

export const type = {
  id: 'type',
  label: 'account_type',
  placeholder: 'e.g. Check account',
};

export const bank_name = {
  id: 'bank_name',
  placeholder: 'e.g. South Bank',
};

export const bank_code = {
  id: 'bank_code',
  placeholder: 'e.g. 12324',
};

export const branch_code = {
  id: 'branch_code',
  placeholder: 'e.g. 46589',
};

export const iban = {
  id: 'iban',
  placeholder: 'e.g. PT50002700000001234567833',
  helper: 'iban_helper',
};

export const cryptoAddress = {
  id: 'address',
  multiline: true,
  // type: 'crypto',
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
};

export const memoSkipAccount = {
  id: 'memoSkip',
  label: 'memo_skip_account_label',
  type: 'checkbox',
};

export const federationAddressAccount = {
  id: 'federationAddress',
  label: 'Federated stellar address',
  helper: 'Your easily identifiable stellar address',
};

export const first_name = {
  id: 'first_name',
  validation: { required: 'true' },
  placeholder: 'e.g. John',
};

export const last_name = {
  id: 'last_name',
  validation: { required: 'true' },
  placeholder: 'e.g. Smith',
};

export const username = {
  id: 'username',
  validation: { required: 'true' },
  placeholder: 'e.g. johnsmith88',
};

export const id_number = {
  id: 'id_number',
  // helper: 'SSN, Passport, BSN or ID number',
  type: 'id_number',
  validation: { length: 8, required: 'true' },
  placeholder: 'e.g. 4001023456789',
};

export const nationality = {
  id: 'nationality',
  label: 'nationality',
  type: 'country',
  placeholder: 'e.g. South Africa',
};

export const timezone = {
  id: 'timezone',
  type: 'timezone',
};
export const birth_date = {
  id: 'birth_date',
  type: 'date',
  label: 'Date Of Birth',
  placeholder: 'e.g. yyyy-mm-dd',
};

export const mobile = {
  id: 'mobile',
  type: 'mobile',
  label: 'mobile_number',
  helper: 'Please include country code, e.g. +1',
  validation: {},
  placeholder: 'e.g. +1821234567',
};

export const mobile_number = {
  id: 'number',
  type: 'mobile',
  label: 'mobile_number',
  helper: 'Please include country code',
  validation: {},
  placeholder: 'e.g. +1821234567',
};

export const mobile_mfa = {
  id: 'mobile_mfa',
  label: 'mobile_number',
  type: 'mobile',
  helper: 'Please include country code',
  validation: {},
  placeholder: 'e.g. +1821234567',
};

export const email = {
  id: 'email',
  type: 'email',
  validation: { required: 'true' },
  enum: null,
  placeholder: 'e.g. hello@gmail.com',
};

export const password = {
  id: 'password',
  type: 'password',
  helper: 'password_helper',
  validation: { required: true, min: 12 },
};

export const confirm_password = {
  id: 'confirm_password',
  type: 'password',
  helper: 'password_helper',
  validation: { required: true, min: 12 },
  autoCompleteType: 'off',
};

export const referral = {
  id: 'referral',
  label: 'referral_code',
  type: 'optional',
};

export const company = {
  id: 'company',
  label: 'Company',
  validation: { required: 'true' },
};

export const new_password = {
  id: 'new_password',
  label: 'new_password',
  type: 'password',
  helper: 'password_helper',
  validation: { required: 'true', min: 12 },
  autoCompleteType: 'off',
};
export const new_password2 = {
  name: 'new_password2',
  label: 'confirm_new_password',
  type: 'password',
  helper: 'password_helper',
  validation: { required: 'true', min: 12 },
  autoCompleteType: 'off',
};

export const old_password = {
  id: 'old_password',
  label: 'old_password',
  type: 'password',
  helper: 'password_helper',
  validation: { required: 'true', min: 8 },
  autoCompleteType: 'off',
};

export const amount = {
  id: 'amount',
  type: 'currency',
  placeholder: '0.00',
};

export const recipient = {
  id: 'recipient',
  placeholder: 'e.g. user@gmail.com',
};

export const recipientSearch = {
  id: 'recipientSearch',
  label: 'Name, email, mobile or crypto',
  placeholder: '',
};

export const emailRecipient = {
  id: 'emailRecipient',
  type: 'email',
  label: 'Recipient (email/search)',
  validation: { required: 'true' },
  placeholder: 'e.g. user@gmail.com',
};

export const mobileRecipient = {
  id: 'mobileRecipient',
  label: 'Recipient (mobile)',
  type: 'mobile',
  helper: 'Please include country code, e.g. +1',
  placeholder: '+1821234567',
  // placeholder: '+27 82 123 4567',
};

export const cryptoRecipient = {
  id: 'cryptoRecipient',
  label: 'Recipient (crypto address)',
  // type: 'crypto',
  placeholder: 'e.g. GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4...',
};

export const note = {
  id: 'note',
  placeholder: 'e.g. Payment',
};

export const memo = {
  id: 'memo',
  label: 'memo',
  placeholder: 'e.g. 8DLYX2LBKP',
};

export const currency = {
  id: 'currency',
  type: 'currencySelector',
};

export const merchant = {
  id: 'merchant',
  type: 'switch',
  description: 'Would you like to register as a',
  linkText: 'merchant',
};

export const buy = {
  id: 'buy',
  type: 'currency',
  placeholder: '0.00',
};
export const sell = {
  id: 'sell',
  type: 'currency',
  placeholder: '0.00',
};

export const exchangeCurrency = {
  id: 'currency',
  label: 'for_currency',
  type: 'currencySelector',
};

export const currencies = {
  id: 'currencies',
  type: 'multi',
};

export const voucher_code = {
  id: 'code',
  label: 'voucher',
  placeholder: 'e.g. ABC123',
};

export const name = {
  name: 'name',
  placeholder: 'e.g. Current',
};
export const number = {
  name: 'number',
  // placeholder: 'e.g. South Bank',
};

export const swift = {
  name: 'swift',
  id: 'swift',
  helper: 'swift_helper',
  placeholder: 'e.g. CTBAAU2S',
};
export const bic = {
  name: 'bic',
  helper: 'bic_helper',
  placeholder: 'e.g. CTBAAU2S',
};

export const profile_pic = {
  name: 'profile',
  type: 'image',
};

export const fathers_name = {
  name: 'fathers_name',
};

export const mothers_name = {
  name: 'mothers_name',
};

const genderOptions = [
  { label: 'male', value: 'male', key: 'male' },
  { label: 'female', value: 'female', key: 'female' },
  { label: 'other', value: 'other', key: 'other' },
  { label: 'not_specified', value: 'not_specified', key: 'not_specified' },
];

const titleOptions = [
  { label: 'Mr', value: 'mr', key: 'mr' },
  { label: 'Mrs', value: 'mrs', key: 'mrs' },
  { label: 'Ms', value: 'ms', key: 'ms' },
  { label: 'Mx', value: 'mx', key: 'mx' },
];

const relationshipOptions = [
  { label: 'single', value: 'single', key: 'single' },
  { label: 'married', value: 'married', key: 'married' },
  { label: 'divorced', value: 'divorced', key: 'divorced' },
  { label: 'widowed', value: 'widowed', key: 'widowed' },
];

export const gender = {
  name: 'gender',
  type: 'select',
  options: genderOptions,
};

export const marital_status = {
  name: 'marital_status',
  type: 'select',
  options: relationshipOptions,
};

export const title = {
  name: 'title',
  type: 'select',
  options: titleOptions,
};

export const central_bank_number = {
  name: 'central_bank_number',
};

export const doc_dates = {
  type: 'doc_dates',
};

export const grandmothers_name = {
  name: 'grandmothers_name',
};

export const grandfathers_name = {
  name: 'grandfathers_name',
};
