const sellMachine = {
  id: 'sell',
  initial: 'options',
  states: {
    options: {
      on: { NEXT: 'amount' },
    },
    amount: {
      on: { NEXT: 'confirm', BACK: 'options' },
    },
    confirm: {
      on: {
        SUCCESS: 'success',
        NEXT: 'success',
        LIMIT: 'amount',
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

export default sellMachine;
