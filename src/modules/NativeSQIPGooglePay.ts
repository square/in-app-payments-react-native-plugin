import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  initializeGooglePay(squareLocationId: string, environment: number): void;
  canUseGooglePay(): Promise<boolean>;
  requestGooglePayNonce(
    googlePayConfig: Object,
    onGooglePayNonceRequestSuccess: (cardDetails: Object) => void,
    onGooglePayNonceRequestFailure: (errorDetails: Object) => void,
    onGooglePayCanceled: () => void
  ): Promise<void>;
  requestGooglePayNonceWithBuyerVerification(
    googlePayConfig: Object,
    paymentSourceId: string,
    locationId: string,
    buyerAction: string,
    money: Object,
    contact: Object,
    onBuyerVerificationSuccess: (verificationResult: Object) => void,
    onBuyerVerificationFailure: (errorDetails: Object) => void,
    onGooglePayNonceRequestSuccess: (cardDetails: Object) => void,
    onGooglePayNonceRequestFailure: (errorDetails: Object) => void,
    onGooglePayCanceled: () => void
  ): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SQIPGooglePay');
