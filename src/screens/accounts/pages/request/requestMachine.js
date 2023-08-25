const requestMachine = {
  id: 'request',
  initial: 'list',
  states: {
    list: {
      on: { NEXT: 'amount', SUCCESS: 'success', FAIL: 'fail' },
    },
    amount: {
      on: { NEXT: 'recipient', BACK: 'list' },
    },
    recipient: {
      on: { NEXT: 'note', BACK: 'amount' },
    },
    note: {
      on: { NEXT: 'confirm', BACK: 'recipient' },
    },
    confirm: {
      on: {
        SUCCESS: 'success',
        NEXT: 'success',
        BACK: 'note',
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

export default requestMachine;
// export {
//   LOGIN,

// };
