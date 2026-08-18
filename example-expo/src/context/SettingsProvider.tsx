import { createContext, useContext, useState } from 'react';

export const SettingsContext = createContext({
  useMockBackend: false,
  setUseMockBackend: (_: boolean) => {},
  useDeprecatedMethods: false,
  setUseDeprecatedMethods: (_: boolean) => {},
  useWithBuyerVerification: false,
  setUseWithBuyerVerification: (_: boolean) => {},
});

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [useDeprecatedMethods, setUseDeprecatedMethods] = useState(false);
  const [useWithBuyerVerification, setUseWithBuyerVerification] =
    useState(false);
  const [useMockBackend, setUseMockBackend] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        useMockBackend,
        setUseMockBackend,
        useDeprecatedMethods,
        setUseDeprecatedMethods,
        useWithBuyerVerification,
        setUseWithBuyerVerification,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
