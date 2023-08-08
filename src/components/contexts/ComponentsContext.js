import React, { useContext } from 'react';

const ComponentsContext = React.createContext({});

function ComponentsProvider({ children, images }) {
  // console.log('ComponentsProvider -> images', images);
  return (
    <ComponentsContext.Provider value={images}>
      {children}
    </ComponentsContext.Provider>
  );
}

function useComponents() {
  const components = useContext(ComponentsContext);
  // console.log('useComponents -> components', components);

  if (components === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return components;
}

export { ComponentsContext, ComponentsProvider, useComponents };
