import Tier from './TierRequirements';
import ReferralPage from './ReferralPage';
import ProfileOverview from './ProfileOverview';
import ProfilePage from '../components/ProfilePage';
import Logout from './logout';

const pages = {
  Profile: ProfileOverview,

  ProfilePage,
  Tier: Tier,
  Referral: ReferralPage,
  Logout: Logout,
};

export default pages;
