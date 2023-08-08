const sendMachine = {
  id: 'send',
  initial: 'amount',
  states: {
    amount: {
      on: { NEXT: 'recipient' },
    },
    recipient: {
      on: { NEXT: 'confirm', BACK: 'amount' },
    },
    note: {
      on: { NEXT: 'confirm', BACK: 'recipient' },
    },
    metadata: {
      on: { NEXT: 'confirm', BACK: 'recipient' },
    },
    confirm: {
      on: {
        SUCCESS: 'success',
        PENDING: 'pending',
        NEXT: 'success',
        LIMIT: 'amount',
        BACK: 'recipient',
        FAIL: 'fail',
      },
    },
    pending: {
      on: {
        NEXT: 'success',
        SUCCESS: 'success',
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

export default sendMachine;
