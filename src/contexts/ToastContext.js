import React, { useContext, useState } from 'react';

const ToastContext = React.createContext({
  config: {},
  showToast: () => {},
  methods: {
    showToast: () => {},
    deactivate: () => {},
  },
});

function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined)
    throw new Error('useToast must be used within a ToastProvider');

  return context;
}

function ToastProvider({ children }) {
  const defaultConfig = {
    active: false,
    variant: '',
    duration: 2500,
    text: '',
    subtitle: '',
    actionLabel: '',
    actionOnPress: () => {},
  };

  const [config, setConfig] = useState(defaultConfig);

  const showToast = args =>
    !config.active &&
    setConfig({
      ...defaultConfig,
      active: true,
      ...args,
    });

  return (
    <ToastContext.Provider
      value={{
        config,
        showToast,
        methods: {
          showToast,
          deactivate: () => setConfig({ ...config, active: false }),
        },
      }}>
      {children}
    </ToastContext.Provider>
  );
}

export { ToastContext, useToast, ToastProvider };
