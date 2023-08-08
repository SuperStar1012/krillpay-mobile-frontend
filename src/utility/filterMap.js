import moment from 'moment';
import momentTz from 'moment-timezone';
import { get } from 'lodash';

const filterMap = (filters, currency, profile) => {
  const activeFilters = {};
  Object.keys(filters).map(filter => {
    if (filter === 'amount') {
      const { type, value, value2 } = filters[filter].value;

      switch (type) {
        case 'more':
          activeFilters[filter + '__abs__gt'] =
            parseFloat(value) * 10 ** currency.divisibility;
          break;
        case 'less':
          activeFilters[filter + '__abs__lt'] =
            parseFloat(value) * 10 ** currency.divisibility;
          break;
        case 'between':
          activeFilters[filter + '__abs__gte'] =
            parseFloat(value) * 10 ** currency.divisibility;
          activeFilters[filter + '__abs__lte'] =
            parseFloat(value2) * 10 ** currency.divisibility;
          break;
        default:
          activeFilters[filter + '__abs'] =
            parseFloat(value) * 10 ** currency.divisibility;
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
      const value = filters[filter];
      if (value) {
        activeFilters['categories'] = value.map(item => item.id);
      }
    } else {
      const value = filters[filter];
      if (value) {
        activeFilters[filter] = filters[filter];
      }
    }
  });
  return activeFilters;
};

export default filterMap;
