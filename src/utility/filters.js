import moment from 'moment';
import momentTz from 'moment-timezone';
import { get } from 'lodash';
import {
  paramsToSearch,
  formatTime,
  formatDivisibility,
  standardizeString,
  arrayToObject,
} from './general';
import { TIMES } from './date';
import { getCode, getName } from 'country-list';

// TODO: add prepend filter string

export function amountFilterMap({ type, value, value2, currency }) {
  let filters = {};

  switch (type) {
    case 'more':
      filters['amount__abs__gt'] =
        parseFloat(value) * 10 ** currency.divisibility;
      break;
    case 'less':
      filters['amount__abs__lt'] =
        parseFloat(value) * 10 ** currency.divisibility;
      break;
    case 'between':
      filters['amount__abs__gte'] =
        parseFloat(value) * 10 ** currency.divisibility;
      filters['amount__abs__lte'] =
        parseFloat(value2) * 10 ** currency.divisibility;
      break;
    default:
      filters['amount__abs'] = parseFloat(value) * 10 ** currency.divisibility;
  }

  return filters;
}

export function dateFilterMap({ type, value, value2, profile }) {
  let filters = {};

  let momentValue = null;
  let momentValue2 = null;

  const timezone = get(profile, ['items', 'timezone']);
  if (timezone) {
    momentValue = momentTz(value).tz(timezone);
    momentValue2 = momentTz(value2).tz(timezone);
  } else {
    momentValue = moment(value);
    momentValue2 = moment(value2);
  }

  const start = momentValue.startOf('day').valueOf();
  const end = momentValue.endOf('day').valueOf();
  const start2 = momentValue2.startOf('day').valueOf();
  const end2 = momentValue2.endOf('day').valueOf();

  switch (type) {
    case 'more':
      filters['created__gt'] = parseFloat(start);
      break;
    case 'less':
      filters['created__lt'] = parseFloat(end);
      break;
    case 'between':
      filters['created__gt'] = parseFloat(start);
      filters['created__lt'] = parseFloat(end2);
      break;
    default:
      filters['created__gt'] = parseFloat(start);
      filters['created__lt'] = parseFloat(end);
  }

  return filters;
}

export function categoriesFilterMap({ value = [] }) {
  return value?.map(item => item?.id).join();
}

export function countriesFilterMap({ value = [] }) {
  return value?.map(item => getCode(item)).join();
}

// export function sellerFilterMap({ value = [] }) {
//   return value?.map(item => getCode(item)).join();
// }

const filterMap = (filters, currency = {}, profile) => {
  const activeFilters = {};
  Object.keys(filters).map(filter => {
    if (filter.match(/amount/)) {
    } else if (filter.match(/quantity|total_price/)) {
      const { type, value, value2 } = filters[filter].value;
      switch (type) {
        case 'more':
          activeFilters[filter + '__gt'] = parseFloat(value);
          break;
        case 'less':
          activeFilters[filter + '__lt'] = parseFloat(value);
          break;
        case 'between':
          activeFilters[filter + '__gt'] = parseFloat(value);
          activeFilters[filter + '__lt'] = parseFloat(value2);
          break;
        default:
          activeFilters[filter] = parseFloat(value);
      }
    } else if (filter === 'date') {
      let { type, value, value2 } = filters[filter].value;
      let momentValue = null;
      let momentValue2 = null;

      const timezone = get(profile, ['items', 'timezone']);
      if (timezone) {
        momentValue = momentTz(value).tz(timezone);
        momentValue2 = momentTz(value2).tz(timezone);
      } else {
        momentValue = moment(value);
        momentValue2 = moment(value2);
      }

      const start = momentValue.startOf('day').valueOf();
      const end = momentValue.endOf('day').valueOf();
      const start2 = momentValue2.startOf('day').valueOf();
      const end2 = momentValue2.endOf('day').valueOf();

      switch (type) {
        case 'more':
          activeFilters['created__gt'] = parseFloat(start);
          break;
        case 'less':
          activeFilters['created__lt'] = parseFloat(end);
          break;
        case 'between':
          activeFilters['created__gt'] = parseFloat(start);
          activeFilters['created__lt'] = parseFloat(end2);
          break;
        default:
          activeFilters['created__gt'] = parseFloat(start);
          activeFilters['created__lt'] = parseFloat(end);
      }
    } else if (filter === 'category') {
      const { value } = filters[filter];
      activeFilters['categories'] = value.map(item => item.id);
    } else {
      activeFilters[filter] = filters[filter]?.value ?? filters[filter];
    }
  });
  return activeFilters;
};

export default filterMap;

export function parseFilters(filters = {}, filter) {
  switch (filter) {
    case 'date':
      if (!filters.created__gt && filters.created__lt) {
        return { type: 'less', value: filters.created__lt };
      } else if (filters.created__gt && !filters.created__lt) {
        return { type: 'more', value: filters.created__gt };
      } else if (filters.created__lt - filters.created__gt > TIMES.day) {
        return {
          type: 'between',
          value: filters.created__gt,
          value2: filters.created__lt,
        };
      } else if (filters.created__lt || filters.created__gt) {
        return {
          type: 'equal',
          value: filters.created__gt,
          value2: filters.created__lt,
        };
      }
      return {};

    case 'quantity':
    case 'total_price':
    case 'amount':
      if (!filters.amount__abs__gte && filters.amount__abs__lte) {
        return { type: 'less', value: filters.amount__abs__lte };
      } else if (filters.amount__abs__gte && !filters.amount__abs__lte) {
        return { type: 'more', value: filters.amount__abs__gte };
      } else if (filters.amount__abs__gte && filters.amount__abs__lte) {
        return {
          type: 'between',
          value: filters.amount__abs__gte,
          value2: filters.amount__abs__lte,
        };
      } else if (
        filters.amount__abs__gte ||
        filters.amount__abs__lte ||
        filters.amount__abs
      ) {
        return {
          type: 'equal',
          value: filters.amount__abs ?? filters.amount__abs__gte,
          value2: filters.amount__abs__lte,
        };
      }
      return {};
    // case 'categories':
    //   return value.map((item, index) => (index > 0 ? ' ' : '') + item.name);
    // case 'countries':
    //   return value.map((item, index) => getName(item));
    // case 'enabled':
    //   const config = get(filterConfig, [filter, 'config'], {
    //     trueLabel: 'Yes',
    //     falseLabel: 'No',
    //   });
    //   const { trueLabel, falseLabel } = config;
    //   return value ? trueLabel : falseLabel;

    default:
      return {
        value: filters?.[filter] ? decodeURIComponent(filters?.[filter]) : '',
      }; // ;
  }
}

export function formatValue(filters, filter, context = {}) {
  const {
    profile,
    currency,
    subtypes,
    categories = [],
    loading,
    sellers,
  } = context;
  const { type, value, value2 } = parseFilters(filters, filter) ?? {};

  switch (filter) {
    case 'date':
      switch (type) {
        case 'more':
          return 'after ' + formatTime(value, 'YYYY/MM/DD', profile);
        case 'less':
          return 'before ' + formatTime(value, 'YYYY/MM/DD', profile);
        case 'between':
          return (
            formatTime(value, 'YYYY/MM/DD', profile) +
            ' - ' +
            formatTime(value2, 'YYYY/MM/DD', profile)
          );
        case 'equal':
          return formatTime(value, 'YYYY/MM/DD', profile);
        default:
          return '';
      }
    case 'quantity':
      switch (type) {
        case 'more':
          return 'more than ' + value;
        case 'less':
          return 'less than ' + value;
        case 'between':
          return value + ' - ' + value2;
        case 'equal':
          return value;
        default:
          return '';
      }
    case 'total_price':
    case 'amount':
      switch (type) {
        case 'more':
          return (
            'more than ' + formatDivisibility(value, currency?.divisibility)
          );
        case 'less':
          return (
            'less than ' + formatDivisibility(value, currency?.divisibility)
          );
        case 'between':
          return (
            formatDivisibility(value, currency?.divisibility) +
            ' - ' +
            formatDivisibility(value2, currency?.divisibility)
          );
        case 'equal':
          return formatDivisibility(value, currency?.divisibility);
        default:
          return '';
      }
    case 'subtype':
      const subtype = subtypes?.find(item => item.value === value);
      return subtype?.label ? subtype.label : standardizeString(subtype?.value);
    case 'categories':
      if (loading) {
        return '';
      }
      const categoriesObj = arrayToObject(categories, 'id');
      const temp = value.split(',');

      return temp
        .filter(item => item)
        .map(
          (item, index) =>
            (index === 0 ? '' : index === temp.length - 1 ? ' & ' : ', ') +
            (typeof categoriesObj === 'object'
              ? categoriesObj[item]?.name
              : item),
        )
        .join('');
    case 'countries':
      return value
        .split(',')
        .map((item, index) => getName(item))
        .filter(item => item);
    case 'seller':
      if (loading) {
        return '';
      }
      const sellersObj = arrayToObject(sellers, 'id');

      return sellersObj?.[value]?.name ?? value;
    // case 'enabled':
    //   const config = get(filterConfig, [filter, 'config'], {
    //     trueLabel: 'Yes',
    //     falseLabel: 'No',
    //   });
    //   const { trueLabel, falseLabel } = config;
    //   return value ? trueLabel : falseLabel;

    default:
      return value; // ;
  }
}

export function clearFilters(filters = {}, id) {
  const newFilters = { ...filters };

  if (id === 'date') {
    delete newFilters.created__lt;
    delete newFilters.created__gt;
  } else if (id.match(/amount|number|quantity/)) {
    delete newFilters.amount__abs__gte;
    delete newFilters.amount__abs__lte;
    delete newFilters.amount__abs;
  } else delete newFilters[id];

  return newFilters;
}
