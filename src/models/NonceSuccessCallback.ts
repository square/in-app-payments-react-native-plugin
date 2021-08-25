import CardDetails from './CardDetails';

interface NonceSuccessCallback {
  (cardDetails: CardDetails): void;
}

export default NonceSuccessCallback;
