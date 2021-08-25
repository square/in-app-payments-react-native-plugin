import VerificationResult from './VerificationResult';

interface BuyerVerificationSuccessCallback {
  (verificationResult:VerificationResult): void;
}

export default BuyerVerificationSuccessCallback;
