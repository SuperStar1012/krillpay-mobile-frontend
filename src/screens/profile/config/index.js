import pages from '../pages';
import { concatAddress, standardizeString } from 'utility/general';
import locales from './locales';
import Documents from '../components/Documents';
import Finances from '../components/Finances';

/* TODO:
have title / label fall back to id if none
same for detail/list views
*/

const config = {
  user: {
    icon: 'account-circle',
    label: 'basic_info',
    value: item => '',
    // status: ({ profile }) => {
    //   console.log('profile', profile);
    //   const item = profile?.data?.[0] ?? {};

    //   return item.verified
    //     ? 'verified'
    //     : item.first_name && item.last_name
    //     ? 'pending'
    //     : 'incomplete';
    // },
    configs: {
      form: {
        title: 'basic_info',
        image: 'profile',
      },
    },
  },

  central_bank: {
    id: 'central_bank_number',
    label: 'central_bank_number',
    image: 'bank',
    condition: ({ tiers }) =>
      checkTierRequirement(tiers, 'central_bank_number'),
    // component: Documents,
    set: 'MaterialCommunityIcons',
    icon: 'bank',
    value: '',
    configs: {
      form: {
        title: 'central_bank_number',
        image: 'bank',
      },
    },
  },
  profile: {
    title: 'Profile pic',
    label: 'profile_pic',
    // page: 'ProfilePic',
    icon: 'face',
    // status: ({ profile }) => {
    //   const item = profile?.data?.[0] ?? {};

    //   return item.profile ? 'verified' : 'incomplete';
    // },
    configs: {
      form: {
        // image: 'profile',
        title: 'profile_pic',
        description: 'profile_pic_description',
        component: 'profile_pic',
      },
    },
  },
  mobile: {
    title: 'mobile_numbers',
    label: 'mobile_number',
    icon: 'phone-iphone',
    image: 'mobile',
    value: 'number',
    overview: item => item.mobile,
    configs: {
      list: {
        title: 'mobile_numbers',
        image: 'mobile',
        canDelete: item => !item.primary,
      },
      form: {
        title: 'add_mobile_number',
        // icon: 'phone-iphone',
      },
      verify: {
        title: 'verify_mobile',
        variant: 'mobile',
      },
      view: {
        title: 'mobile_number',
        image: 'mobile',
      },
    },
  },
  email: {
    title: 'Email addresses',
    label: 'email',
    icon: 'email',
    image: 'email',
    configs: {
      list: {
        title: 'email_addresses',
        image: 'email',
        canDelete: item => !item.primary,
      },
      form: {
        title: 'add_email_address',
      },
      verify: {
        title: 'verify_email',
        variant: 'email',
      },
      view: {
        title: 'email_address',
        image: 'email',
      },
    },
    // services: { onDelete}
  },
  address: {
    title: 'addresses',
    label: 'address',
    icon: 'add-location',
    value: item => concatAddress(item, true),
    configs: {
      list: {
        title: 'addresses',
        image: 'address',
        label: (item, index) => 'address_' + item?.type,
        canDelete: true,
      },
      form: {
        title: 'add_new_address',
      },
      view: {
        title: 'address',
        image: 'address',
      },
    },
  },
  tier: {
    id: 'tiers_and_limits',
    label: 'tiers_and_limits',
    condition: ({ tiers }) => tiers?.items?.length > 0,
    page: 'Tier',
    icon: 'md-trophy',
    set: 'Ionicons',
    value: item =>
      'Tier ' + item.name + (item.description ? ' - ' + item.description : ''),
  },
  document: {
    id: 'document',
    label: 'documents',
    image: 'document',
    condition: ({ profileConfig }) => !profileConfig?.documents?.hide,
    component: Documents,
    set: 'MaterialCommunityIcons',
    icon: 'file-document',
    value: '',
  },
  finances: {
    id: 'finances',
    label: 'finances',
    image: 'document',
    condition: ({ tiers }) => checkTierRequirement(tiers, 'proof_of_income'),
    // condition: ({ tiers }) => tiers?.items?.length > 0,
    component: Finances,
    set: 'MaterialCommunityIcons',
    icon: 'credit-card-multiple-outline',
    value: '',
  },
};

export default {
  id: 'profile',
  defaultPage: '',
  variant: 'profile',
  pages,
  config,
  locales,
};

function checkTierRequirement(tiers, requirement) {
  if (!tiers) return false;
  return Boolean(
    tiers?.items?.length &&
      tiers?.items?.find(x =>
        Boolean(
          x.requirements?.length &&
            x.requirements?.find(y => y.requirement === requirement),
        ),
      ),
  );
}
