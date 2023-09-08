const depositMachine = {
  id: 'deposit',
  initial: 'accounts',
  states: {
    accounts: {
      on: { NEXT: 'type' },
    },
    type: {
      on: { MANUAL: 'manual', WYRE: 'wyre' },
    },
    manual: {
      on: { BACK: 'manualMethodSelection' },
    },
    manualMethodSelection: {
      on: { NEXT: 'manual' },
    },
    depositNotAvailable: {
      on: {},
    },
    wyre: {
      on: { NEXT: 'amount', BACK: 'type', ADD: 'link_account' },
    },
    link_account: {
      on: { BACK: 'wyre' },
    },
    amount: {
      on: { NEXT: 'confirm', BACK: 'wyre' },
    },
    confirm: {
      on: {
        SUCCESS: 'success',
        NEXT: 'success',
        BACK: 'amount',
        FAIL: 'fail',
      },
    },
    success: {
      on: {},
      type: 'final',
    },
    fail: {
      on: {},
      type: 'final',
    },
  },
};

export default depositMachine;
