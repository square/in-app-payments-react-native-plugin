import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  startCardEntryFlow(
    collectPostalCode: boolean,
    onCardNonceRequestSuccess: (cardDetails: Object) => void,
    onCardEntryCancel: () => void
  ): void;
  updateOnCardNonceRequestSuccessCallback(
    onCardNonceRequestSuccess: (cardDetails: Object) => void
  ): void;
  completeCardEntry(onCardEntryComplete: () => void): void;
  showCardNonceProcessingError(errorMessage: string): void;
  startGiftCardEntryFlow(
    onCardNonceRequestSuccess: (cardDetails: Object) => void,
    onCardEntryCancel: () => void
  ): void;
  startCardEntryFlowWithBuyerVerification(
    collectPostalCode: boolean,
    paymentSourceId: string,
    locationId: string,
    buyerAction: string,
    money: Object,
    contact: Object,
    onBuyerVerificationSuccess: (verificationResult: Object) => void,
    onBuyerVerificationFailure: (errorDetails: Object) => void,
    onCardNonceRequestSuccess: (cardDetails: Object) => void,
    onCardEntryCancel: () => void
  ): void;
  startGiftCardEntryFlowWithBuyerVerification(
    paymentSourceId: string,
    locationId: string,
    buyerAction: string,
    money: Object,
    contact: Object,
    onBuyerVerificationSuccess: (verificationResult: Object) => void,
    onBuyerVerificationFailure: (errorDetails: Object) => void,
    onCardNonceRequestSuccess: (cardDetails: Object) => void,
    onCardEntryCancel: () => void
  ): void;
  setIOSCardEntryTheme(theme: Object): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SQIPCardEntry');
