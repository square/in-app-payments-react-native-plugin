import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  startBuyerVerificationFlow(
    paymentSourceId: string,
    locationId: string,
    buyerAction: string,
    money: Object,
    contact: Object,
    onBuyerVerificationSuccess: (verificationResult: Object) => void,
    onBuyerVerificationFailure: (errorDetails: Object) => void
  ): void;
  // FIXME: Dev Testing
  setMockBuyerVerificationSuccess(mockBuyerVerificationSuccess: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SQIPBuyer');
