import React from 'react';
import { FullScreenForm } from 'components';

const PostAuthLayout = props => {
  const { onSuccess, onBack, skip, children } = props;

  return (
    <FullScreenForm
      type="auth"
      textHeaderLeft={'logout'}
      onPressHeaderLeft={onBack}
      textHeaderRight={skip && 'skip'}
      onPressHeaderRight={onSuccess}>
      {children}
    </FullScreenForm>
  );
};

export default PostAuthLayout;
