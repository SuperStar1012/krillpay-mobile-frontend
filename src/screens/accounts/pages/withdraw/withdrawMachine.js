const withdrawMachine = {
  id: 'withdraw',
  initial: 'accounts',
  states: {
    accounts: {
      on: { NEXT: 'amount' },
    },
    amount: {
      on: { NEXT: 'note', BACK: 'accounts' },
    },
    note: {
      on: { NEXT: 'confirm', BACK: 'amount' },
    },
    confirm: {
      on: {
        SUCCESS: 'success',
        NEXT: 'success',
        BACK: 'note',
        FAIL: 'fail',
        LIMIT: 'amount',
      },
    },
    success: {
      type: 'final',
    },
    fail: {
      type: 'final',
    },
  },
};

export default withdrawMachine;
// export {
//   LOGIN,

// };
