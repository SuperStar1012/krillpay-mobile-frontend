import React, { useContext } from 'react';
import { fetchData } from 'utility/data/actions';

const DataContext = React.createContext({});

function DataProvider({ children, context, refresh }) {
  return (
    <DataContext.Provider value={{ context, refresh }}>
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  const { context, refresh } = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return { context, refresh, fetchData };
}

export { DataContext, DataProvider, useData };
