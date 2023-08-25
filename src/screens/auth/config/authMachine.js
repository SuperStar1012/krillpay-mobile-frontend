import { createMachine } from 'xstate';

// Constants (actions / states)
const LOGIN = 'LOGIN';
const REGISTER = 'REGISTER';
const PRE_AUTH_SLIDES = 'PRE_AUTH_SLIDES';
const POST_AUTH_SLIDES = 'POST_AUTH_SLIDES';
const FORGOT = 'FORGOT';
const LANDING = 'LANDING';
const SUCCESS = 'SUCCESS';
const BACK = 'BACK';
const COMPANY = 'COMPANY';
const AUTH_INIT = 'AUTH_INIT';
const MFA_VERIFY = 'MFA_VERIFY';
const MFA_SET = 'MFA_SET';
const LOCAL_AUTH_SET = 'LOCAL_AUTH_SET';
const LOCAL_AUTH_VERIFY = 'LOCAL_AUTH_VERIFY';
const EMAIL_VERIFY = 'EMAIL_VERIFY';
const MOBILE_VERIFY = 'MOBILE_VERIFY';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const GROUP = 'GROUP';

const ABOUT = 'ABOUT';
const DISCLAIMER = 'DISCLAIMER';

const authMachine = createMachine({
  predictableActionArguments: true,
  id: 'auth',
  initial: AUTH_INIT,
  states: {
    [AUTH_INIT]: {
      on: { COMPANY, LOCAL_AUTH_VERIFY, LANDING },
    },
    [COMPANY]: {
      on: { [SUCCESS]: PRE_AUTH_SLIDES, LOCAL_AUTH_VERIFY },
    },
    [PRE_AUTH_SLIDES]: {
      on: { [SUCCESS]: LANDING, [BACK]: COMPANY },
    },
    [LANDING]: {
      on: { LOGIN, REGISTER, GROUP, [BACK]: COMPANY, ABOUT, LOCAL_AUTH_VERIFY },
    },
    [LOGIN]: {
      on: {
        [BACK]: LANDING,
        REGISTER,
        GROUP,
        FORGOT,
        [SUCCESS]: MFA_VERIFY,
        ABOUT,
      },
    },
    [GROUP]: {
      on: { [SUCCESS]: REGISTER, [BACK]: LANDING, ABOUT },
    },
    [REGISTER]: {
      on: { [BACK]: LANDING, LOGIN, [SUCCESS]: DISCLAIMER, ABOUT, GROUP },
    },
    [FORGOT]: {
      on: { [BACK]: LOGIN, ABOUT },
    },
    [ABOUT]: {
      on: {
        LANDING,
        LOGIN,
        REGISTER,
        DISCLAIMER,
        FORGOT,
        GROUP,
      },
    },
    [DISCLAIMER]: {
      on: {
        [SUCCESS]: MFA_SET,
        [BACK]: LANDING,
        ABOUT,
      },
    },
    [MFA_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: EMAIL_VERIFY, MFA_SET },
    },
    [MFA_SET]: {
      on: { [BACK]: LANDING, [SUCCESS]: EMAIL_VERIFY },
    },
    [EMAIL_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: MOBILE_VERIFY },
    },
    [MOBILE_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: LOCAL_AUTH_SET },
    },
    [LOCAL_AUTH_SET]: {
      on: { [BACK]: LANDING, [SUCCESS]: POST_AUTH_SLIDES },
    },
    [LOCAL_AUTH_VERIFY]: {
      on: { [BACK]: LANDING, [SUCCESS]: POST_AUTH_SLIDES },
    },
    [POST_AUTH_SLIDES]: {
      on: { [SUCCESS]: AUTH_SUCCESS },
    },
    [AUTH_SUCCESS]: { on: { COMPANY, LOCAL_AUTH_VERIFY, LANDING } },
  },
});

export default authMachine;
export {
  LOGIN,
  REGISTER,
  FORGOT,
  LANDING,
  COMPANY,
  BACK,
  SUCCESS,
  LOCAL_AUTH_SET,
  LOCAL_AUTH_VERIFY,
  EMAIL_VERIFY,
  MOBILE_VERIFY,
  MFA_VERIFY,
  MFA_SET,
  ABOUT,
  DISCLAIMER,
  PRE_AUTH_SLIDES,
  POST_AUTH_SLIDES,
  GROUP,
  AUTH_SUCCESS,
  AUTH_INIT,
};
