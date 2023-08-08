export const getToken = state => state.auth.token;
export const getCompany = state => state.auth.company;
export const getAuthUser = state => state.auth.user;
export const getWallets = state => state.accounts.wallets;

export const authStateSelector = state => state.auth;
export const themeStateSelector = state => state.config.theme;

export const userSelector = state => state.user;
export const userStateSelector = state => state.user;
export const rewardsSelector = state => state.rewards;

export const cryptoSelector = state => state.crypto;

export const contactsStateSelector = state => state.contacts;
