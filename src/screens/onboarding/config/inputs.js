// import AddressVerification from '../components/AddressVerification';
// import IdentityVerification from '../components/IdentityVerification';
import MobileVerification from '../components/MobileVerification';
import DocumentsSelector from 'components/inputs/DocumentSelector';
import moment from 'moment';

export const first_name = {
  name: 'first_name',
  textContentType: 'givenName',
};

export const last_name = {
  name: 'last_name',
  textContentType: 'familyName',
};

export const id_number = {
  name: 'id_number',
  type: 'id_number',
  placeholder: 'e.g. 4001023456789',
  label: 'Identification number',
};

export const birth_date = {
  name: 'birth_date',
  type: 'date',
  maximumDate: new Date(),
  initialFocusedDate: moment().set({ year: 1989, month: 0, date: 1 }),
};

export const display_currency = options => {
  return {
    name: 'display_currency',
    label: 'Display currency',
    type: 'dropdown',
    items: options,
    input: true,
  };
};

export const nationality = {
  name: 'nationality',
  label: 'Nationality',
  type: 'country',
};

export const profile_pic = existing => {
  return {
    name: 'profile',
    type: 'profile_picture',
    existing,
  };
};

export const phone_number = existing => {
  return {
    name: 'mobile',
    label: 'Mobile number',
    type: 'phone',
    existing,
  };
};

export const verify_mobile = existing => {
  return {
    name: 'verify_mobile',
    component: MobileVerification,
    existing,
  };
};

export const location = props => {
  const { label, name, existing } = props;
  return {
    name,
    label,
    type: 'location',
    existing,
  };
};

export const verify_location = categories => {
  return {
    name: 'location_documents',
    label: 'Document type',
    type: 'dropdown',
    items: categories,
  };
};

export const proof_of_identity = ({ title, description } = {}) => {
  return {
    name: 'documents',
    component: DocumentsSelector,
    initialState: 'type',
    initialCategory: 'proof_of_identity',
    allowPreview: true,
    noPadding: true,
    key: 'proof_of_identity',
    title,
    description,
  };
};

export const proof_of_address = ({ title, description } = {}) => {
  return {
    name: 'documents',
    component: DocumentsSelector,
    initialState: 'type',
    initialCategory: 'proof_of_address',
    allowPreview: true,
    noPadding: true,
    key: 'proof_of_address',
    title,
    description,
  };
};

export const proof_of_income = ({ title, description } = {}) => {
  return {
    name: 'documents',
    component: DocumentsSelector,
    initialState: 'type',
    initialCategory: 'proof_of_income',
    allowPreview: true,
    noPadding: true,
    key: 'proof_of_income',
    title,
    description,
  };
};

export const currencies = options => {
  return {
    id: 'currencies',
    name: 'currencies',
    label: 'Currencies',
    type: 'multiselect',
    items: options,
    input: true,
    displayField: 'display_code',
  };
};
