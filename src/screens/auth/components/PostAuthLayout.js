import React from 'react';
import { FullScreenForm } from 'components';

const PostAuthLayout = props => {
  const { onSuccess, onBack, skip, children } = props;

  return <FullScreenForm type="auth">{children}</FullScreenForm>;
};

export default PostAuthLayout;
