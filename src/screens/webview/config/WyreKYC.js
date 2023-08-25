import React from 'react';
import Image from '../components/images/sumsub.svg';

function onLoad() {
  // fetch user and get url
}

export default {
  id: 'sumsub',
  name: 'Sumsub',
  uri: ({ context, query } = {}) => query?.context?.items?.onboarding_url ?? '',
  onLoad,
  data: 'wyre-user-onboarding',
  description: 'sumsub_redirect',
  image: <Image {...{ width: 250, height: 80 }} />,
};
