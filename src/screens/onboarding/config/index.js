import {
  completedRequiredFields,
  intersectTierRequirements,
  mapFieldsToInputs,
  validateRequiredFields,
} from '../util';
import { get, groupBy } from 'lodash';
import WyreAddBankAccount from '../components/inputs/WyreBankAccount';
import { validateMobile, validateAddress } from 'utility/validation';
import { checkWyreModeUsers, checkWyreService } from 'extensions/wyre/util';

function checkRequiredFields(item, fields) {
  return !fields.find(field => item && !item[field]);
}

const config = props => {
  let {
    user = {},
    userAddresses = [],
    documents = [],
    tiers,
    tier,
    services,
    wyrePaymentMethods,
    config: appConfig,
  } = props;

  tiers = tiers?.items ?? [];
  tier = tier?.items?.[0] ?? [];
  const hasWyreAccounts = !checkWyreModeUsers(services, appConfig);

  const verificationState = () => {
    let grouped = groupBy(documents, 'document_category');

    for (const category in grouped) {
      const types = groupBy(grouped[category], 'document_type');
      let error = false;
      let verified = false;

      for (const type in types) {
        if (['verified'].includes(types[type]?.[0]?.status)) {
          verified = true;
          error = false;
          break;
        } else if (
          ['declined', 'obsolete', 'incomplete'].includes(
            types[type]?.[0]?.status,
          )
        )
          error = true;
      }

      grouped[category] = {
        complete: Boolean(types) && !error,
        error: error,
        pending: Boolean(types) && !error && !verified,
      };
    }

    return grouped;
  };

  const hasWyreService = checkWyreService(services);

  let sections = [
    {
      id: 'basic_info',
      mappedFields: intersectTierRequirements({
        section: 'user-basic_info',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(user, this.mappedFields);
      },
      validate: (values, mappedFields) =>
        validateRequiredFields(values, mappedFields, { services }),
      get fields() {
        return mapFieldsToInputs({ fields: this.mappedFields });
      },
    },
    {
      id: 'central_bank_number',
      mappedFields: intersectTierRequirements({
        section: 'user-central_bank_number',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(user, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({ fields: this.mappedFields });
      },
    },
    {
      id: 'verify_mobile',
      mappedFields: intersectTierRequirements({
        section: 'user-verify_mobile',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(user, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({ fields: this.mappedFields, user });
      },
      validate: values => validateMobile(values?.mobile),
      hasError:
        checkRequiredFields(user, ['mobile']) &&
        !get(user, ['verification', 'mobile']),

      initialLayout: {
        displayImage: true,
        displayHeading: false,
        displayDescription: false,
        displayButton: false,
      },
    },
    {
      id: 'address',
      mappedFields: intersectTierRequirements({
        section: 'user-address',
        tiers,
      }),
      validate: values => validateAddress(values, hasWyreService),
      get completed() {
        return completedRequiredFields(
          userAddresses.find(x => x.type === 'permanent'),
          this.mappedFields,
        );
      },
      get fields() {
        return mapFieldsToInputs({ fields: this.mappedFields, hasWyreService });
      },
    },
    {
      id: 'address_verification',
      mappedFields: intersectTierRequirements({
        section: 'user-address_verification',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(documents, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
          props: { title: this.title, description: this.description },
        });
      },
      hasError: verificationState()?.proof_of_address?.error,
      pending: verificationState()?.proof_of_address?.pending,
      initialLayout: {
        displayImage: false,
        displayHeading: false,
        displayDescription: false,
        displayButton: false,
      },
    },
    {
      id: 'identity',
      mappedFields: intersectTierRequirements({
        section: 'user-identity',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(documents, this.mappedFields, { user });
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
          props: { title: this.title, description: this.description },
        });
      },
      hasError: verificationState()?.proof_of_identity?.error,
      pending: verificationState()?.proof_of_identity?.pending,
      initialLayout: {
        displayImage: false,
        displayHeading: false,
        displayDescription: false,
        displayButton: false,
      },
    },
    {
      id: 'finances',
      mappedFields: intersectTierRequirements({
        section: 'user-finances',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(documents, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
          props: { title: this.title, description: this.description },
        });
      },
      hasError: verificationState()?.proof_of_income?.error,
      pending: verificationState()?.proof_of_income?.pending,
      initialLayout: {
        displayImage: false,
        displayHeading: false,
        displayDescription: false,
        displayButton: false,
      },
    },
  ].filter(x => x.fields?.length && !x.hidden);

  if (sections?.length > 0 && hasWyreService && hasWyreAccounts)
    sections.push({
      id: 'wyre',
      fields: [{ id: 'wyre', component: WyreAddBankAccount, sections }],
      initialLayout: { displayButton: false },
      completed: wyrePaymentMethods?.results?.length > 0,
    });

  const completedSections = sections.filter(x => Boolean(x.completed))?.length;
  const isOnboardingComplete = Boolean(
    sections?.length > 0 && sections?.length === completedSections,
  );

  let canSkip = true;
  if (tier?.level && appConfig?.authConfig?.tier) {
    canSkip = tier?.level >= appConfig?.authConfig?.tier;
  }

  return {
    sections,
    isOnboardingComplete,
    canSkip,
    hasWyreService,
    completedSections,
  };
};

export default config;
