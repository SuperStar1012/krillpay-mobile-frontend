import React from 'react';
import OutputList from 'components/outputs/OutputList';
import { displayFormatDivisibility, standardizeString } from 'utility/general';

const lang = {
  max: 'Maximum',
  day_max: 'Maximum per day',
  month_max: 'Maximum per month',
  min: 'Minimum',
  overdraft: 'Overdraft',
};

const LimitsList = props => {
  const { tier, subtype, currency } = props;
  if (!tier) {
    return null;
  }
  const { limits } = tier;
  let items = [];
  if (limits) {
    const subtypeLimits = limits.filter(
      limit =>
        limit.subtype === subtype && limit.currency === currency.currency.code,
    );
    items = subtypeLimits.map(limit => {
      return {
        label: standardizeString(
          lang[limit.type] + ' ' + (subtype ? subtype : ''),
        ),
        value:
          displayFormatDivisibility(
            limit.value,
            currency.currency.divisibility,
          ) +
          ' ' +
          currency.currency.code,
        horizontal: true,
      };
    });
  }

  return <OutputList items={items} />;
};

export default LimitsList;
