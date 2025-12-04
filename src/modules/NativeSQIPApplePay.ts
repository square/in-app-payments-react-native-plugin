import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  initializeApplePay(applePayMerchantId: string): void;
  canUseApplePay(): Promise<boolean>;
  completeApplePayAuthorization(isSuccess: boolean, errorMessage: string): void;
  requestApplePayNonce(
    price: string,
    summaryLabel: string,
    countryCode: string,
    currencyCode: string,
    paymentType: number,
    onApplePayNonceRequestSuccess: (cardDetails: Object) => void,
    onApplePayNonceRequestFailure: (errorDetails: Object) => void,
    onApplePayComplete: () => void
  ): Promise<void>;
  requestApplePayNonceWithBuyerVerification(
    price: string,
    summaryLabel: string,
    countryCode: string,
    currencyCode: string,
    paymentType: number,
    paymentSourceId: string,
    locationId: string,
    buyerAction: string,
    money: Object,
    contact: Object,
    onBuyerVerificationSuccess: (verificationResult: Object) => void,
    onBuyerVerificationFailure: (errorDetails: Object) => void,
    onApplePayNonceRequestSuccess: (cardDetails: Object) => void,
    onApplePayNonceRequestFailure: (errorDetails: Object) => void,
    onApplePayComplete: () => void
  ): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SQIPApplePay');
