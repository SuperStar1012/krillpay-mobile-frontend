import React from 'react';
import {
  useRehiveContext,
  useRehiveMethods,
  RehiveProvider,
} from './RehiveContext';
import { useToast, ToastProvider } from './ToastContext';
import { LocalAuthProvider } from './LocalAuthContext';
import { ThemeProvider } from './ThemeContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LanguageProvider } from './LanguageContext';
import { useAccounts } from './AccountsContext';
import { I18nProvider } from './I18nContext';
import { BusinessProvider, useBusiness } from './BusinessContext';
const queryClient = new QueryClient();

function Providers({ children, localAuth, initialAuth }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider value={{}}>
        <LocalAuthProvider initial={localAuth}>
          <RehiveProvider initial={initialAuth}>
            <ThemeProvider>
              <LanguageProvider>
                <BusinessProvider>
                  <I18nProvider>{children}</I18nProvider>
                </BusinessProvider>
              </LanguageProvider>
            </ThemeProvider>
          </RehiveProvider>
        </LocalAuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export {
  Providers,
  useRehiveContext,
  useRehiveMethods,
  useToast,
  useAccounts,
  useBusiness,
};
