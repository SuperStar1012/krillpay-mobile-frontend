import { getMFAAuthenticators } from 'utility/rehive';
import MultiFactorAuth from '../../components/MultiFactorAuth';

async function fetchData(cnt, event) {
  try {
    let resp = await getMFAAuthenticators('verified=1');
    return { authenticators: resp?.data };
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
