import React from 'react';
import Logo from '../../../../../assets/svgs/Authentication.svg';

export default function MobileVerify(props) {
  const { width = 150, height = 150, colors } = props;
  const { primary } = colors;

  return <Logo width={width} height={height} />;
}
