/* eslint-disable import/namespace */
import * as inputs from 'config/inputs/inputs';
import * as customInputs from '../config/inputs';
import { intersection, flatten, uniq, isEmpty } from 'lodash';
import { checkWyreService } from 'extensions/wyre/util';

export function completedRequiredFields(item, fields, props = {}) {
  let complete = true;
  let { type = 'user' } = props;

  fields.forEach(field => {
    switch (field) {
      case 'mobile_number':
        complete = item?.verification?.mobile;
        break;
      case 'address':
        complete = !Boolean(
          [
            `${type === 'business' ? 'address_' : ''}line_1`,
            `${type === 'business' ? 'address_' : ''}city`,
            `${type === 'business' ? 'address_' : ''}state_province`,
            `${type === 'business' ? 'address_' : ''}country`,
            `${type === 'business' ? 'address_' : ''}postal_code`,
          ].find(x => !item?.[x]),
        );
        break;
      case 'proof_of_income':
      case 'proof_of_address':
      case 'proof_of_identity':
        complete =
          Boolean(item?.find(x => x.document_category === field)) &&
          (field === 'proof_of_identity' ? props?.user?.id_number : true);
        break;
      default:
        if (!item?.[field]) complete = false;
        break;
    }
  });

  return complete;
}

export function validateRequiredFields(item, fields, props = {}) {
  let errors = {};
  let { type = 'user' } = props;

  fields.forEach(field => {
    switch (field) {
      case 'mobile_number':
        if (!item?.verification?.mobile) errors.mobile_number = 'required';
        break;
      case 'address':
        [
          `${type === 'business' ? 'address_' : ''}line_1`,
          `${type === 'business' ? 'address_' : ''}city`,
          `${type === 'business' ? 'address_' : ''}state_province`,
          `${type === 'business' ? 'address_' : ''}country`,
          `${type === 'business' ? 'address_' : ''}postal_code`,
        ].map(x => {
          if (!item?.[x]) {
            errors.x = 'required';
          }
        });

        break;
      default:
        // if (
        //   field === 'nationality' &&
        //   checkWyreService(props?.services) &&
        //   !(item?.nationality === 'US' || item?.nationality?.cca2 === 'US')
        // )
        //   errors[field] = 'App only available in United States';
        if (!item?.[field]) errors[field] = 'required';
        break;
    }
  });

  return isEmpty(errors) ? false : errors;
}

export function intersectTierRequirements({ section, tiers, applyOverrides }) {
  const mappedRequirements =
    (tiers?.length &&
      flatten(
        tiers?.map(x => x.requirements?.map(y => y.requirement) ?? []),
      )) ??
    [];

  let set = [];
  let overrides = [];

  switch (section) {
    case 'user-basic_info':
      set = [
        'first_name',
        'last_name',
        'birth_date',
        'nationality',
        'id_number',
        'gender',
        'title',
        'marital_status',
        'fathers_name',
        'mothers_name',
        'grandfathers_name',
        'grandmothers_name',
      ];
      overrides = [
        'first_name',
        'last_name',
        'birth_date',
        'nationality',
        'id_number',
      ];
      break;
    case 'user-central_bank_number':
      set = ['central_bank_number'];
      break;
    case 'user-verify_mobile':
      set = ['mobile_number'];
      break;
    case 'user-address':
    case 'business-business_location':
      set = ['address'];
      break;
    case 'user-finances':
      set = ['proof_of_income'];
      break;
    case 'user-address_verification':
      set = ['proof_of_address'];
      break;
    case 'user-identity':
      set = ['proof_of_identity'];
      break;
    default:
      return set;
  }

  const matches = intersection(set, uniq(mappedRequirements));
  return uniq([...(applyOverrides ? overrides : []), ...flatten(matches)]);
}

export function mapFieldsToInputs({ fields, user, props }) {
  const functionInputs = {
    mobile_number: customInputs.verify_mobile({
      existing: user?.mobile,
    }),
    address: [
      inputs.line_1,
      inputs.line_2,
      inputs.city,
      inputs.country,
      inputs.state_province,
      inputs.postal_code,
    ],
  };

  return flatten(
    fields?.map(
      x =>
        functionInputs[x] ??
        (customInputs[x] &&
          (typeof customInputs[x] === 'function'
            ? customInputs[x](props)
            : customInputs[x])) ??
        inputs[x],
    ) ?? [],
  );
}

export function calculateOnboardingComplete(sections = []) {
  const completedSections =
    sections.filter(x => Boolean(x.completed))?.length ?? 0;
  return sections?.length === completedSections?.length;
}
