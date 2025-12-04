export interface ErrorDetails {
  debugMessage: string;
  message: string;
  code?: string;
  debugCode?: string;
}

export interface ColorType {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export const ErrorCodes = {
  UsageError: 'USAGE_ERROR',
};

export interface FontType {
  size: number;
  name?: string;
}

export interface ThemeType {
  font?: FontType;
  saveButtonFont?: FontType;
  backgroundColor?: ColorType;
  textColor?: ColorType;
  placeholderTextColor?: ColorType;
  tintColor?: ColorType;
  messageColor?: ColorType;
  errorColor?: ColorType;
  saveButtonTitle?: string;
  saveButtonTextColor?: ColorType;
  keyboardAppearance?: 'Light' | 'Dark';
  cancelButton?: any;
}

export interface ApplePayConfig {
  price: string;
  summaryLabel: string;
  countryCode: string;
  currencyCode: string;
  paymentType?: PaymentType;
}

export enum PaymentType {
  PaymentTypePending = 1,
  PaymentTypeFinal = 2,
}

export enum Brand {
  OTHER_BRAND,
  VISA,
  MASTERCARD,
  AMERICAN_EXPRESS,
  DISCOVER,
  DISCOVER_DINERS,
  JCB,
  CHINA_UNION_PAY,
  SQUARE_GIFT_CARD,
}

export interface VerificationResult {
  nonce?: string;
  token?: string;
}

export interface BuyerVerificationSuccessCallback {
  (verificationResult: VerificationResult): void;
}

export interface CancelAndCompleteCallback {
  (): void;
}

export enum PrepaidType {
  UNKNOWN,
  NOT_PREPAID,
  PREPAID,
}

export enum Type {
  UNKNOWN,
  CREDIT,
  DEBIT,
}

export interface Card {
  brand?: Brand;
  lastFourDigits?: string;
  expirationMonth?: number;
  expirationYear?: number;
  postalCode?: string;
  type?: Type;
  prepaidType?: PrepaidType;
}

export interface CardDetails {
  nonce?: string;
  card?: Card;
}

export interface CardEntryConfig {
  collectPostalCode: boolean;
  squareLocationId?: string;
  buyerAction?: 'Charge' | 'Store';
  amount?: number;
  currencyCode?: string;
  givenName?: string;
  familyName?: string;
  addressLines?: string[];
  city?: string;
  countryCode?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
  region?: string;
}

export interface FailureCallback {
  (error: ErrorDetails): void;
}

export enum GooglePayPriceStatus {
  TotalPriceStatusNotCurrentlyKnown = 1,
  TotalPriceStatusEstimated = 2,
  TotalPriceStatusFinal = 3,
}

export interface GooglePayConfig {
  price: string;
  currencyCode: string;
  priceStatus: GooglePayPriceStatus;
}

export interface NonceSuccessCallback {
  (cardDetails: CardDetails): void;
}

/**
 * @param success - Whether the card entry was successful
 * @param errorMessage - The error message if the card entry was not successful
 * @param onCardEntryComplete - A callback to be called when the card entry is successfully completed
 */
export interface NonceSuccessResult {
  success: boolean;
  errorMessage?: string;
  onCardEntryComplete?: () => void;
}

export enum ApplePayNonceSuccessState {
  Succeeded = 'succeeded',
  Failure = 'failure',
  Canceled = 'canceled',
}

export interface ApplePayNonceSuccessResult {
  state: ApplePayNonceSuccessState;
  errorMessage?: string;
}

export type NonceSuccessCallbackWithResult = (
  cardDetails: CardDetails
) => NonceSuccessResult | Promise<NonceSuccessResult>;

export enum GooglePayEnvironment {
  EnvironmentProduction = 1,
  EnvironmentTest = 3,
}

export interface ApplePayCancelAndCompleteCallback {
  (status: ApplePayNonceSuccessState, errorMessage?: string): void;
}

export type ApplePayNonceSuccessCallbackWithResult = (
  cardDetails: CardDetails
) => ApplePayNonceSuccessResult | Promise<ApplePayNonceSuccessResult>;
