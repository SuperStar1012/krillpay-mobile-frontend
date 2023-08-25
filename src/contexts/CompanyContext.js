import React, { useContext } from 'react';

const initialContext = { company: null };
const CompanyContext = React.createContext(initialContext);

function CompanyProvider({ children, companyData }) {
  // console.log('companyData', companyData);
  const context = {
    company: companyData,
  };

  return (
    <CompanyContext.Provider value={context}>
      {children}
    </CompanyContext.Provider>
  );
}

function useCompany() {
  const value = useContext(CompanyContext);
  return value;
}

export { CompanyContext, CompanyProvider, useCompany };
