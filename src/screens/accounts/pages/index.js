import Send from './send';
import CurrencyDetail from '../components/CurrencyDetailPage';
import WalletList from './list';

import SellCredit from './sellCredit';
import Receive from './receive';
// import InputScanner from '../components/inputScannerScreen';
import Scan from './scan';

import Deposit from './deposit';
import Withdraw from './withdraw';
import Transfer from './transfer';
import Pay from './pay';
import ReceivePay from './receivePayment';
import Exchange from './exchange';
// import Prepaid from './prepaid';
import ChiplessCard from './card';
import Request from './request';
import Buy from './buy';
import Sell from './sell';
import Wyre from './wyre';
// // import QuickBuy from './QuickBuy';

import ContactListPage from './contacts';

const pages = {
  SellCredit,
  ChiplessCard,
  Request,
  Send,
  Receive,
  Deposit,
  Withdraw,
  Transfer,
  Buy,
  Sell,
  // // Prepaid,
  // // // QuickBuy,
  Wyre,
  Pay,
  ReceivePay,
  Exchange,
  CurrencyDetail,
  Scan,
  ContactListPage,
};
const pagesLocal = {
  List: WalletList,
  CurrencyDetail,
};

export default { pages, pagesLocal };
