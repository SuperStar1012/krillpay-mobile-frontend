import DataList from 'components/containers/DataList';
import React from 'react';

function TabScene({ route, ...restProps }) {
  const { props = {}, component } = route ?? {};
  const { item } = props;

  if (component || item?.component) {
    const Component = component ?? item?.component;
    return <Component {...restProps} {...props} />;
  }

  return <DataList {...restProps} {...props} />;
}

export default React.memo(TabScene);
