import { getMFA } from 'utility/rehive';
import MultiFactorAuth from '../../components/MultiFactorAuth';

function checkMFA(mfa) {
  if (mfa?.token) {
    return 'token';
  } else if (mfa?.sms) {
    return 'sms';
  } else {
    return '';
  }
}

async function fetchData(cnt, event) {
  try {
    let resp = await getMFA();
    return { mfa: resp };
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

export default {
  id: 'overview',
  value: 'mfa',
  title: 'mfa',
  image: 'mfa',
  renderDetail: MultiFactorAuth,
  services: {
    fetchData,
  },
};
