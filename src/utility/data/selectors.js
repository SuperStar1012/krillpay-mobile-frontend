import { EMPTY_PROFILE } from 'config/empty_objects';

export const userSelector = state => state.user;

// function userAddressesSelector(state) {
//   return {
//     data: state?.address ?? [],
//     loading: state?.addressLoading ?? false,
//     error: state?.addressError ?? false,
//   };
// }

export const rehiveSelector = (state, id) => {
  return {
    data: state?.[id] ?? [],
    loading: state?.[id + 'Loading'] ?? true,
    error: state?.[id + 'Error'] ?? false,
  };
};

export const userAddressesSelector = user => {
  return {
    data: user?.address ?? [],
    loading: user?.addressLoading ?? true,
    error: user?.addressError ?? false,
  };
};

export const userEmailsSelector = user => ({
  data: user?.email ?? [],
  loading: user?.emailLoading ?? false,
  error: user?.emailError ?? false,
});

export const userMobilesSelector = user => {
  return {
    data: user?.mobile ?? [],
    loading: user?.mobileLoading ?? false,
    error: user?.mobileError ?? false,
  };
};

export const userBankAccountsSelector = user => {
  return {
    data: user?.bank_account ?? [],
    loading: user?.bank_accountLoading ?? false,
    error: user?.bank_accountError ?? false,
  };
};

export const userCryptoAccountsSelector = user => {
  return {
    data: user?.crypto_account ?? [],
    loading: user?.crypto_accountLoading ?? false,
    error: user?.crypto_accountError ?? false,
  };
};

export const userProfileSelector = user => {
  return {
    data: user?.profile ?? [],
    loading: user?.profileLoading ?? false,
    error: user?.profileError ?? false,
  };
};

export const userReferralCodeSelector = user => {
  return {
    data: user?.referralCodes ?? [],
    loading: user?.referralCodesLoading ?? false,
    error: user?.referralCodesError ?? false,
  };
};

export const userDocumentsSelector = user => {
  return {
    data: user?.document ?? [],
    loading: user?.documentLoading ?? false,
    error: user?.documentError ?? false,
  };
};

export const profileSelector = user => {
  return user && user.profile && user.profile.length > 0
    ? user.profile[0]
    : { ...EMPTY_PROFILE, profile: '' };
};

export const companyBankAccountsSelector = user => {
  return {
    items: user.companyBankAccounts ? user.companyBankAccounts : [],
    loading: user.companyBankAccountsLoading
      ? user.companyBankAccountsLoading
      : false,
    error: user.companyBankAccountsError
      ? user.companyBankAccountsError
      : false,
  };
};
