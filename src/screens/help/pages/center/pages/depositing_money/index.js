import DontKnowHowToDeposit from './DontKnowHowToDeposit';
import DepositNotReflecting from './DepositNotReflecting';
import NeedHelpWithWyre from './NeedHelpWithWyre';
import AddCryptoToWallet from './AddCryptoToWallet';
import { checkWyreService } from 'extensions/wyre/util';

export default {
  sections: [
    {
      id: 'i_dont_know_how_to_deposit',
      component: DontKnowHowToDeposit,
      // questions: [
      //   {
      //     id: 'manual_deposit',
      //     component: ManualDeposit,
      //     // decription: 'manual_deposit_description',
      //     // steps: ['manual_deposit_step_1', 'manual_deposit_step_2'],
      //     // steps: 2,
      //     // warning: 'manual_deposit_warning',
      //   },
      //   {
      //     id: 'wyre_deposit',
      //     component: WyreDeposit,
      //     decription: 'wyre_deposit_description',
      //     steps: 5,
      //     // steps: [
      //     //   'wyre_deposit_step_1',
      //     //   'wyre_deposit_step_2',
      //     //   'wyre_deposit_step_3',
      //     //   'wyre_deposit_step_4',
      //     //   'wyre_deposit_step_5',
      //     // ],
      //   },
      // ],
    },
    {
      id: 'deposit_not_reflecting',
      component: DepositNotReflecting,
    },
    {
      id: 'how_do_i_add_crypto_to_my_wallet',
      component: AddCryptoToWallet,
    },
    {
      id: 'i_need_help_with_wyre',
      component: NeedHelpWithWyre,
      condition: ({ services }) => checkWyreService(services),
    },
  ],
};
