import bankAccounts from './bank';
// import bitcoin from './bitcoin';
// import stellar from './stellar';
import overview from './overview';
import mfa from './mfa';
import password from './password';
import cryptoAccounts from './crypto';
import displayCurrency from './displayCurrency';
import primaryCurrency from './primaryCurrency';
import notifications from './notifications';
import localAuth from './localAuth';
import devices from './devices';
import language from './language';
import accDelete from './accDelete';

const pages = {
  '': overview,
  bankAccounts,
  cryptoAccounts,
  accDelete,
  // bitcoin,
  // stellar,
  mfa,
  password,
  notifications,
  language,
  displayCurrency,
  localAuth,
  primaryCurrency,
  // faqs,
  devices,
};

export default pages;
