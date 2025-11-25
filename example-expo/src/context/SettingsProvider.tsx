import { createContext, useContext, useEffect, useState } from 'react';
import { SQIPBuyer } from 'react-native-square-in-app-payments';

export const SettingsContext = createContext({
  useMockBackend: false,
  setUseMockBackend: (_: boolean) => {},
  useDeprecatedMethods: false,
  setUseDeprecatedMethods: (_: boolean) => {},
  useWithBuyerVerification: false,
  setUseWithBuyerVerification: (_: boolean) => {},
  mockBuyerVerificationSuccess: false,
  setMockBuyerVerificationSuccess: (_: boolean) => {},
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
  const [mockBuyerVerificationSuccess, setMockBuyerVerificationSuccess] =
    useState(false);

  // FIXME: Dev Testing
  useEffect(() => {
    if (mockBuyerVerificationSuccess) {
      SQIPBuyer.setMockBuyerVerificationSuccess(true);
    } else {
      SQIPBuyer.setMockBuyerVerificationSuccess(false);
    }
  }, [mockBuyerVerificationSuccess]);

  return (
    <SettingsContext.Provider
      value={{
        useMockBackend,
        setUseMockBackend,
        useDeprecatedMethods,
        setUseDeprecatedMethods,
        useWithBuyerVerification,
        setUseWithBuyerVerification,
        mockBuyerVerificationSuccess,
        setMockBuyerVerificationSuccess,
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
