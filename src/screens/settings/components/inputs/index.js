import React from 'react';

import PrimaryCurrency from './PrimaryCurrency';
import DisplayCurrency from './DisplayCurrency';
import Language from './Langauge';
import Input from 'components/inputs';
import * as inputs from 'config/inputs';

export default function Inputs(props) {
  const { variant, ...restProps } = props;
  const config = inputs?.[variant];

  switch (variant) {
    case 'primaryCurrency':
      return <PrimaryCurrency {...props} />;
    case 'displayCurrency':
      return <DisplayCurrency {...restProps} />;
    case 'language':
      return <Language {...restProps} />;
    default:
      return <Input {...restProps} config={config} />;
  }
}
