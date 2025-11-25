import NativeSQIPCore from './modules/NativeSQIPCore';
import NativeSQIPCardEntry from './modules/NativeSQIPCardEntry';
import NativeSQIPBuyer from './modules/NativeSQIPBuyer';
import {
  createInAppPaymentsError,
  verifyBooleanType,
  verifyIntegerType,
  verifyNumberType,
  verifyObjectType,
  verifyStringType,
  verifyThemeType,
} from './utils';
import {
  type BuyerVerificationSuccessCallback,
  type CancelAndCompleteCallback,
  type CardDetails,
  type CardEntryConfig,
  type FailureCallback,
  GooglePayEnvironment,
  type GooglePayConfig,
  type NonceSuccessCallback,
  type NonceSuccessCallbackWithResult,
  type ErrorDetails,
  type ThemeType,
  type ApplePayConfig,
  PaymentType,
  type ApplePayNonceSuccessCallbackWithResult,
  type ApplePayCancelAndCompleteCallback,
  ApplePayNonceSuccessState,
} from './types';
import { ErrorCodes, GooglePayPriceStatus } from './types';
import NativeSQIPGooglePay from './modules/NativeSQIPGooglePay';
import NativeSQIPApplePay from './modules/NativeSQIPApplePay';

export * from './types';

let onCardNonceRequestSuccessCached:
  | ((cardDetails: CardDetails) => void)
  | undefined;

let lastApplePayNonceRequestState: {
  state: ApplePayNonceSuccessState;
  errorMessage?: string;
} = { state: ApplePayNonceSuccessState.Canceled, errorMessage: undefined };

export namespace SQIPCore {
  export function setSquareApplicationId(applicationId: string): void {
    verifyStringType(applicationId, 'applicationId should be a valid string');
    NativeSQIPCore.setSquareApplicationId(applicationId);
  }
  export function getSquareApplicationId(): string | null {
    return NativeSQIPCore.getSquareApplicationId();
  }
}

export namespace SQIPCardEntry {
  /**
   * @deprecated Use
   * `startCardEntryFlow(
   *  collectPostalCode: boolean,
   *  onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,
   *  onCardEntryCancel?: CancelAndCompleteCallback
   * )` instead. Now you don't need to completeCardEntry
   */
  export function startCardEntryFlow(
    config: CardEntryConfig,
    onCardNonceRequestSuccess: NonceSuccessCallback,
    onCardEntryCancel: CancelAndCompleteCallback
  ): void;
  export function startCardEntryFlow(
    collectPostalCode: boolean,
    onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,
    onCardEntryCancel?: CancelAndCompleteCallback
  ): void;
  export function startCardEntryFlow(
    param: CardEntryConfig | boolean,
    onCardNonceRequestSuccess?:
      | NonceSuccessCallback
      | NonceSuccessCallbackWithResult,
    onCardEntryCancel?: CancelAndCompleteCallback
  ): void {
    let collectPostalCode: boolean = true;
    if (typeof param === 'boolean') {
      verifyBooleanType(param, 'collectPostalCode should be a boolean.');
      collectPostalCode = param;
    } else {
      let cardEntryInternalConfig: CardEntryConfig = {
        collectPostalCode: true,
      };
      if (param) {
        verifyObjectType(param, 'cardEntryConfig should be an object.');
        cardEntryInternalConfig = param;
      }
      if (cardEntryInternalConfig.collectPostalCode != null) {
        verifyBooleanType(
          cardEntryInternalConfig.collectPostalCode,
          'cardEntryConfig.collectPostalCode should be a boolean.'
        );
      } else {
        cardEntryInternalConfig.collectPostalCode = true;
      }
      collectPostalCode = cardEntryInternalConfig.collectPostalCode;
    }
    onCardNonceRequestSuccessCached = (cardDetails: CardDetails) => {
      if (onCardNonceRequestSuccess) {
        Promise.resolve(onCardNonceRequestSuccess(cardDetails))
          .then((result) => {
            if (result) {
              if (result.success) {
                NativeSQIPCardEntry.completeCardEntry(() => {
                  if (result.onCardEntryComplete) {
                    result.onCardEntryComplete();
                  }
                });
                onCardNonceRequestSuccessCached = undefined;
              } else {
                showCardNonceProcessingInternal(
                  result.errorMessage ?? 'Unknown error'
                );
              }
            }
          })
          .catch((error: any) => {
            showCardNonceProcessingInternal(String(error) ?? 'Unknown error');
          });
      } else {
        NativeSQIPCardEntry.completeCardEntry(() => {});
      }
    };
    NativeSQIPCardEntry.startCardEntryFlow(
      collectPostalCode,
      (cardDetails: CardDetails) => {
        if (onCardNonceRequestSuccessCached) {
          onCardNonceRequestSuccessCached(cardDetails);
        }
      },
      () => {
        if (onCardEntryCancel) onCardEntryCancel();
      }
    );
  }

  /**
   * @deprecated Use
   * `onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,`
   *  see `startCardEntryFlow` instead. Now you don't need to completeCardEntry
   *  manually.
   */
  export function completeCardEntry(
    onCardEntryComplete?: CancelAndCompleteCallback
  ): void {
    NativeSQIPCardEntry.completeCardEntry(() => {
      if (onCardEntryComplete) {
        onCardEntryComplete();
      }
    });
  }

  /**
   * @deprecated Use
   * `onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,`
   *  see `startCardEntryFlow`. Now you don't need
   *  to showCardNonceProcessingError manually.
   */
  export function showCardNonceProcessingError(errorMessage: string): void {
    showCardNonceProcessingInternal(errorMessage);
  }

  function showCardNonceProcessingInternal(errorMessage: string): void {
    if (onCardNonceRequestSuccessCached) {
      NativeSQIPCardEntry.updateOnCardNonceRequestSuccessCallback(
        onCardNonceRequestSuccessCached
      );
    }
    verifyStringType(errorMessage, 'errorMessage should be a string');
    NativeSQIPCardEntry.showCardNonceProcessingError(errorMessage);
  }

  export function startGiftCardEntryFlow(
    onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,
    onCardEntryCancel?: CancelAndCompleteCallback
  ): void;
  /**
   * @deprecated Use
   * `startGiftCardEntryFlow(
   *  onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,
   *  onCardEntryCancel?: CancelAndCompleteCallback
   * )` instead. Now you don't need to completeCardEntry
   */
  export function startGiftCardEntryFlow(
    onCardNonceRequestSuccess: NonceSuccessCallback,
    onCardEntryCancel: CancelAndCompleteCallback
  ): void;
  export function startGiftCardEntryFlow(
    onCardNonceRequestSuccess?:
      | NonceSuccessCallbackWithResult
      | NonceSuccessCallback,
    onCardEntryCancel?: CancelAndCompleteCallback
  ): void {
    onCardNonceRequestSuccessCached = (cardDetails: CardDetails) => {
      if (onCardNonceRequestSuccess) {
        Promise.resolve(onCardNonceRequestSuccess(cardDetails))
          .then((result) => {
            if (result) {
              if (result.success) {
                NativeSQIPCardEntry.completeCardEntry(() => {
                  if (result.onCardEntryComplete) {
                    result.onCardEntryComplete();
                  }
                });
                onCardNonceRequestSuccessCached = undefined;
              } else {
                showCardNonceProcessingInternal(
                  result.errorMessage ?? 'Unknown error'
                );
              }
            }
          })
          .catch((error: any) => {
            showCardNonceProcessingInternal(String(error) ?? 'Unknown error');
          });
      } else {
        NativeSQIPCardEntry.completeCardEntry(() => {});
      }
    };
    NativeSQIPCardEntry.startGiftCardEntryFlow(
      (cardDetails: CardDetails) => {
        if (onCardNonceRequestSuccessCached) {
          onCardNonceRequestSuccessCached(cardDetails);
        }
      },
      () => {
        if (onCardEntryCancel) onCardEntryCancel();
      }
    );
  }

  /**
   * @deprecated Use
   * `SQIPBuyer.startBuyerVerificationFlow(
   *  paymentSourceId: string,
   *  cardEntryConfig: CardEntryConfig,
   *  onBuyerVerificationSuccess?: BuyerVerificationSuccessCallback,
   *  onBuyerVerificationFailure?: FailureCallback,
   * )` instead.
   */
  export function startBuyerVerificationFlow(
    paymentSourceId: string,
    cardEntryConfig: CardEntryConfig,
    onBuyerVerificationSuccess: BuyerVerificationSuccessCallback,
    onBuyerVerificationFailure: FailureCallback,
    onCardEntryCancel: CancelAndCompleteCallback
  ): void {
    // ? : why is this callback needed?
    onCardEntryCancel = onCardEntryCancel || (() => {});
    SQIPBuyer.startBuyerVerificationFlow(
      paymentSourceId,
      cardEntryConfig,
      onBuyerVerificationSuccess,
      onBuyerVerificationFailure
    );
  }

  export function startCardEntryFlowWithBuyerVerification(
    collectPostalCode: boolean,
    paymentSourceId: string,
    cardEntryConfig: CardEntryConfig,
    onBuyerVerificationSuccess?: BuyerVerificationSuccessCallback,
    onBuyerVerificationFailure?: FailureCallback,
    onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,
    onCardEntryCancel?: CancelAndCompleteCallback
  ): void {
    verifyBooleanType(
      collectPostalCode,
      'collectPostalCode should be a boolean.'
    );
    verifyStringType(
      paymentSourceId,
      'paymentSourceId should be a valid string'
    );
    verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object');
    verifyStringType(
      cardEntryConfig.squareLocationId,
      'squareLocationId should be a valid string'
    );
    verifyStringType(
      cardEntryConfig.buyerAction,
      'buyerAction should be a valid string'
    );
    verifyNumberType(cardEntryConfig.amount, 'amount should be a valid number');
    verifyStringType(
      cardEntryConfig.currencyCode,
      'currencyCode should be a valid string'
    );
    const money = {
      amount: cardEntryConfig.amount,
      currencyCode: cardEntryConfig.currencyCode,
    };
    const contact = {
      givenName: cardEntryConfig.givenName,
      familyName: cardEntryConfig.familyName,
      addressLines: cardEntryConfig.addressLines,
      city: cardEntryConfig.city,
      countryCode: cardEntryConfig.countryCode,
      email: cardEntryConfig.email,
      phone: cardEntryConfig.phone,
      postalCode: cardEntryConfig.postalCode,
      region: cardEntryConfig.region,
    };
    onCardNonceRequestSuccessCached = (cardDetails: CardDetails) => {
      if (onCardNonceRequestSuccess) {
        Promise.resolve(onCardNonceRequestSuccess(cardDetails))
          .then((result) => {
            if (result) {
              if (result.success) {
                NativeSQIPCardEntry.completeCardEntry(() => {
                  if (result.onCardEntryComplete) {
                    result.onCardEntryComplete();
                  }
                });
                onCardNonceRequestSuccessCached = undefined;
              } else {
                showCardNonceProcessingInternal(
                  result.errorMessage ?? 'Unknown error'
                );
              }
            }
          })
          .catch((error: any) => {
            showCardNonceProcessingInternal(String(error) ?? 'Unknown error');
          });
      } else {
        NativeSQIPCardEntry.completeCardEntry(() => {});
      }
    };
    NativeSQIPCardEntry.startCardEntryFlowWithBuyerVerification(
      collectPostalCode,
      paymentSourceId,
      cardEntryConfig.squareLocationId!,
      cardEntryConfig.buyerAction!,
      money,
      contact,
      (verificationResult) => {
        if (onBuyerVerificationSuccess) {
          onBuyerVerificationSuccess(verificationResult);
        }
      },
      (errorDetails) => {
        if (onBuyerVerificationFailure) {
          onBuyerVerificationFailure(errorDetails as ErrorDetails);
        }
      },
      (cardDetails: CardDetails) => {
        if (onCardNonceRequestSuccessCached) {
          onCardNonceRequestSuccessCached(cardDetails);
        }
      },
      () => {
        if (onCardEntryCancel) onCardEntryCancel();
      }
    );
  }

  export function startGiftCardEntryFlowWithBuyerVerification(
    paymentSourceId: string,
    cardEntryConfig: CardEntryConfig,
    onBuyerVerificationSuccess?: BuyerVerificationSuccessCallback,
    onBuyerVerificationFailure?: FailureCallback,
    onCardNonceRequestSuccess?: NonceSuccessCallbackWithResult,
    onCardEntryCancel?: CancelAndCompleteCallback
  ): void {
    verifyStringType(
      paymentSourceId,
      'paymentSourceId should be a valid string'
    );
    verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object');
    verifyStringType(
      cardEntryConfig.squareLocationId,
      'squareLocationId should be a valid string'
    );
    verifyStringType(
      cardEntryConfig.buyerAction,
      'buyerAction should be a valid string'
    );
    verifyNumberType(cardEntryConfig.amount, 'amount should be a valid number');
    verifyStringType(
      cardEntryConfig.currencyCode,
      'currencyCode should be a valid string'
    );
    const money = {
      amount: cardEntryConfig.amount,
      currencyCode: cardEntryConfig.currencyCode,
    };
    const contact = {
      givenName: cardEntryConfig.givenName,
      familyName: cardEntryConfig.familyName,
      addressLines: cardEntryConfig.addressLines,
      city: cardEntryConfig.city,
      countryCode: cardEntryConfig.countryCode,
      email: cardEntryConfig.email,
      phone: cardEntryConfig.phone,
      postalCode: cardEntryConfig.postalCode,
      region: cardEntryConfig.region,
    };
    onCardNonceRequestSuccessCached = (cardDetails: CardDetails) => {
      if (onCardNonceRequestSuccess) {
        Promise.resolve(onCardNonceRequestSuccess(cardDetails))
          .then((result) => {
            if (result) {
              if (result.success) {
                NativeSQIPCardEntry.completeCardEntry(() => {
                  if (result.onCardEntryComplete) {
                    result.onCardEntryComplete();
                  }
                });
                onCardNonceRequestSuccessCached = undefined;
              } else {
                showCardNonceProcessingInternal(
                  result.errorMessage ?? 'Unknown error'
                );
              }
            }
          })
          .catch((error: any) => {
            showCardNonceProcessingInternal(String(error) ?? 'Unknown error');
          });
      } else {
        NativeSQIPCardEntry.completeCardEntry(() => {});
      }
    };
    NativeSQIPCardEntry.startGiftCardEntryFlowWithBuyerVerification(
      paymentSourceId,
      cardEntryConfig.squareLocationId!,
      cardEntryConfig.buyerAction!,
      money,
      contact,
      (verificationResult) => {
        if (onBuyerVerificationSuccess) {
          onBuyerVerificationSuccess(verificationResult);
        }
      },
      (errorDetails) => {
        if (onBuyerVerificationFailure) {
          onBuyerVerificationFailure(errorDetails as ErrorDetails);
        }
      },
      (cardDetails: CardDetails) => {
        if (onCardNonceRequestSuccessCached) {
          onCardNonceRequestSuccessCached(cardDetails);
        }
      },
      () => {
        if (onCardEntryCancel) onCardEntryCancel();
      }
    );
  }

  export function setIOSCardEntryTheme(theme: ThemeType): void {
    verifyThemeType(theme);
    NativeSQIPCardEntry.setIOSCardEntryTheme(theme);
  }
}

export namespace SQIPBuyer {
  export function startBuyerVerificationFlow(
    paymentSourceId: string,
    cardEntryConfig: CardEntryConfig,
    onBuyerVerificationSuccess?: BuyerVerificationSuccessCallback,
    onBuyerVerificationFailure?: FailureCallback
  ): void {
    verifyStringType(
      paymentSourceId,
      'paymentSourceId should be a valid string'
    );
    verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object');
    verifyStringType(
      cardEntryConfig.squareLocationId,
      'squareLocationId should be a valid string'
    );
    verifyStringType(
      cardEntryConfig.buyerAction,
      'buyerAction should be a valid string'
    );
    verifyNumberType(cardEntryConfig.amount, 'amount should be a valid number');
    verifyStringType(
      cardEntryConfig.currencyCode,
      'currencyCode should be a valid string'
    );
    const money = {
      amount: cardEntryConfig.amount,
      currencyCode: cardEntryConfig.currencyCode,
    };
    const contact = {
      givenName: cardEntryConfig.givenName,
      familyName: cardEntryConfig.familyName,
      addressLines: cardEntryConfig.addressLines,
      city: cardEntryConfig.city,
      countryCode: cardEntryConfig.countryCode,
      email: cardEntryConfig.email,
      phone: cardEntryConfig.phone,
      postalCode: cardEntryConfig.postalCode,
      region: cardEntryConfig.region,
    };
    NativeSQIPBuyer.startBuyerVerificationFlow(
      paymentSourceId,
      cardEntryConfig.squareLocationId!,
      cardEntryConfig.buyerAction!,
      money,
      contact,
      (verificationResult) => {
        if (onBuyerVerificationSuccess) {
          onBuyerVerificationSuccess(verificationResult);
        }
      },
      (errorDetails) => {
        if (onBuyerVerificationFailure) {
          onBuyerVerificationFailure(errorDetails as ErrorDetails);
        }
      }
    );
  }

  // FIXME: Dev Testing
  export function setMockBuyerVerificationSuccess(
    mockBuyerVerificationSuccess: boolean
  ): void {
    NativeSQIPBuyer.setMockBuyerVerificationSuccess(
      mockBuyerVerificationSuccess
    );
  }
}

export namespace SQIPGooglePay {
  export function initializeGooglePay(
    squareLocationId: string,
    environment: GooglePayEnvironment
  ): void {
    verifyStringType(
      squareLocationId,
      'squareLocationId should be a valid string'
    );
    verifyIntegerType(
      environment.valueOf(),
      'environment should be a valid integer'
    );
    NativeSQIPGooglePay.initializeGooglePay(
      squareLocationId,
      environment.valueOf()
    );
  }

  export async function canUseGooglePay(): Promise<boolean> {
    try {
      return await NativeSQIPGooglePay.canUseGooglePay();
    } catch (error) {
      throw createInAppPaymentsError(error);
    }
  }

  export async function requestGooglePayNonce(
    googlePayConfig: GooglePayConfig,
    onGooglePayNonceRequestSuccess?: NonceSuccessCallback,
    onGooglePayNonceRequestFailure?: FailureCallback,
    onGooglePayCanceled?: CancelAndCompleteCallback
  ): Promise<void> {
    verifyObjectType(
      googlePayConfig,
      'googlePayConfig should be a valid object'
    );
    verifyStringType(
      googlePayConfig.price,
      'googlePayConfig.price should be a valid string'
    );
    verifyStringType(
      googlePayConfig.currencyCode,
      'googlePayConfig.currencyCode should be a valid string'
    );
    verifyIntegerType(
      googlePayConfig.priceStatus.valueOf(),
      'googlePayConfig.priceStatus should be a valid integer'
    );
    try {
      await NativeSQIPGooglePay.requestGooglePayNonce(
        googlePayConfig,
        (cardDetails: CardDetails) => {
          if (onGooglePayNonceRequestSuccess) {
            onGooglePayNonceRequestSuccess(cardDetails);
          }
        },
        (errorDetails) => {
          if (onGooglePayNonceRequestFailure) {
            onGooglePayNonceRequestFailure(errorDetails as ErrorDetails);
          }
        },
        () => {
          if (onGooglePayCanceled) {
            onGooglePayCanceled();
          }
        }
      );
    } catch (error) {
      throw createInAppPaymentsError(error);
    }
  }

  export async function requestGooglePayNonceWithBuyerVerification(
    paymentSourceId: string,
    cardEntryConfig: CardEntryConfig,
    googlePayConfig: GooglePayConfig,
    onBuyerVerificationSuccess?: BuyerVerificationSuccessCallback,
    onBuyerVerificationFailure?: FailureCallback,
    onGooglePayNonceRequestSuccess?: NonceSuccessCallback,
    onGooglePayNonceRequestFailure?: FailureCallback,
    onGooglePayCanceled?: CancelAndCompleteCallback
  ): Promise<void> {
    verifyStringType(
      paymentSourceId,
      'paymentSourceId should be a valid string'
    );
    verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object');
    verifyObjectType(googlePayConfig, 'googlePayConfig should be an object');
    verifyStringType(
      googlePayConfig.price,
      'googlePayConfig.price should be a valid string'
    );
    verifyStringType(
      googlePayConfig.currencyCode,
      'googlePayConfig.currencyCode should be a valid string'
    );
    verifyIntegerType(
      googlePayConfig.priceStatus.valueOf(),
      'googlePayConfig.priceStatus should be a valid integer'
    );
    verifyStringType(
      cardEntryConfig.squareLocationId,
      'squareLocationId should be a valid string'
    );
    verifyStringType(
      cardEntryConfig.buyerAction,
      'buyerAction should be a valid string'
    );
    verifyNumberType(cardEntryConfig.amount, 'amount should be a valid number');
    verifyStringType(
      cardEntryConfig.currencyCode,
      'currencyCode should be a valid string'
    );
    const money = {
      amount: cardEntryConfig.amount,
      currencyCode: cardEntryConfig.currencyCode,
    };
    const contact = {
      givenName: cardEntryConfig.givenName,
      familyName: cardEntryConfig.familyName,
      addressLines: cardEntryConfig.addressLines,
      city: cardEntryConfig.city,
      countryCode: cardEntryConfig.countryCode,
      email: cardEntryConfig.email,
      phone: cardEntryConfig.phone,
      postalCode: cardEntryConfig.postalCode,
      region: cardEntryConfig.region,
    };
    try {
      await NativeSQIPGooglePay.requestGooglePayNonceWithBuyerVerification(
        googlePayConfig,
        paymentSourceId,
        cardEntryConfig.squareLocationId!,
        cardEntryConfig.buyerAction!,
        money,
        contact,
        (verificationResult) => {
          if (onBuyerVerificationSuccess) {
            onBuyerVerificationSuccess(verificationResult);
          }
        },
        (errorDetails) => {
          if (onBuyerVerificationFailure) {
            onBuyerVerificationFailure(errorDetails as ErrorDetails);
          }
        },
        (cardDetails: CardDetails) => {
          if (onGooglePayNonceRequestSuccess) {
            onGooglePayNonceRequestSuccess(cardDetails);
          }
        },
        (errorDetails) => {
          if (onGooglePayNonceRequestFailure) {
            onGooglePayNonceRequestFailure(errorDetails as ErrorDetails);
          }
        },
        () => {
          if (onGooglePayCanceled) {
            onGooglePayCanceled();
          }
        }
      );
    } catch (error) {
      throw createInAppPaymentsError(error);
    }
  }

  /**
   * @deprecated Use `GooglePayPriceStatus` instead.
   * @example 'import { GooglePayPriceStatus } from "react-native-square-in-app-payments";'
   */
  export const TotalPriceStatusNotCurrentlyKnown =
    GooglePayPriceStatus.TotalPriceStatusNotCurrentlyKnown;
  /**
   * @deprecated Use `GooglePayPriceStatus` instead.
   * @example 'import { GooglePayPriceStatus } from "react-native-square-in-app-payments";'
   */
  export const TotalPriceStatusEstimated =
    GooglePayPriceStatus.TotalPriceStatusEstimated;
  /**
   * @deprecated Use `GooglePayPriceStatus` instead.
   * @example 'import { GooglePayPriceStatus } from "react-native-square-in-app-payments";'
   */
  export const TotalPriceStatusFinal =
    GooglePayPriceStatus.TotalPriceStatusFinal;

  /**
   * @deprecated Use `GooglePayEnvironment` instead.
   * @example 'import { GooglePayEnvironment } from "react-native-square-in-app-payments";'
   */
  export const EnvironmentProduction =
    GooglePayEnvironment.EnvironmentProduction;
  /**
   * @deprecated Use `GooglePayEnvironment` instead.
   * @example 'import { GooglePayEnvironment } from "react-native-square-in-app-payments";'
   */
  export const EnvironmentTest = GooglePayEnvironment.EnvironmentTest;
}

export namespace SQIPApplePay {
  export function initializeApplePay(applePayMerchantId: string): void {
    verifyStringType(
      applePayMerchantId,
      'applePayMerchantId should be a valid string'
    );
    NativeSQIPApplePay.initializeApplePay(applePayMerchantId);
  }

  export async function canUseApplePay(): Promise<boolean> {
    try {
      return await NativeSQIPApplePay.canUseApplePay();
    } catch (error) {
      throw createInAppPaymentsError(error);
    }
  }

  /**
   * @deprecated now you don't need to call this method manually.
   * use `requestApplePayNonce` with `ApplePayNonceSuccessCallbackWithResult` instead.
   */
  export function completeApplePayAuthorization(
    isSuccess: boolean,
    errorMessage?: string
  ): void {
    completeApplePayAuthorizationInternal(isSuccess, errorMessage);
  }

  function completeApplePayAuthorizationInternal(
    isSuccess: boolean,
    errorMessage?: string
  ): void {
    verifyBooleanType(isSuccess, 'isSuccess should be a valid boolean');
    if (errorMessage) {
      verifyStringType(errorMessage, 'errorMessage should be a valid string');
    }
    NativeSQIPApplePay.completeApplePayAuthorization(
      isSuccess,
      errorMessage ?? ''
    );
  }

  /** @deprecated Use `requestApplePayNonceWithParams` instead. */
  export async function requestApplePayNonce(
    applePayConfig: ApplePayConfig,
    onApplePayNonceRequestSuccess: NonceSuccessCallback,
    onApplePayNonceRequestFailure: FailureCallback,
    onApplePayComplete: CancelAndCompleteCallback
  ): Promise<void>;
  export async function requestApplePayNonce(
    applePayConfig: ApplePayConfig,
    onApplePayNonceRequestSuccess?: ApplePayNonceSuccessCallbackWithResult,
    onApplePayNonceRequestFailure?: FailureCallback,
    onApplePayComplete?: ApplePayCancelAndCompleteCallback
  ): Promise<void>;
  export async function requestApplePayNonce(
    applePayConfig: ApplePayConfig,
    onApplePayNonceRequestSuccess?:
      | NonceSuccessCallback
      | ApplePayNonceSuccessCallbackWithResult,
    onApplePayNonceRequestFailure?: FailureCallback,
    onApplePayComplete?:
      | CancelAndCompleteCallback
      | ApplePayCancelAndCompleteCallback
  ): Promise<void> {
    verifyObjectType(applePayConfig, 'applePayConfig should be a valid object');
    verifyStringType(
      applePayConfig.price,
      'applePayConfig.price should be a valid string'
    );
    verifyStringType(
      applePayConfig.summaryLabel,
      'applePayConfig.summaryLabel should be a valid string'
    );
    verifyStringType(
      applePayConfig.countryCode,
      'applePayConfig.countryCode should be a valid string'
    );
    verifyStringType(
      applePayConfig.currencyCode,
      'applePayConfig.currencyCode should be a valid string'
    );
    let { paymentType } = applePayConfig;
    if (!applePayConfig.paymentType) {
      paymentType = PaymentType.PaymentTypeFinal;
    } else {
      verifyIntegerType(
        applePayConfig.paymentType,
        'applePayConfig.paymentType should be a valid integer'
      );
    }
    try {
      await NativeSQIPApplePay.requestApplePayNonce(
        applePayConfig.price,
        applePayConfig.summaryLabel,
        applePayConfig.countryCode,
        applePayConfig.currencyCode,
        paymentType!.valueOf(),
        (cardDetails: CardDetails) => {
          if (onApplePayNonceRequestSuccess) {
            Promise.resolve(onApplePayNonceRequestSuccess(cardDetails)).then(
              (result) => {
                if (result) {
                  lastApplePayNonceRequestState = {
                    state: result.state,
                    errorMessage: result.errorMessage,
                  };
                  completeApplePayAuthorizationInternal(
                    result.state === ApplePayNonceSuccessState.Succeeded,
                    result.errorMessage
                  );
                }
              }
            );
          }
        },
        (errorDetails) => {
          if (onApplePayNonceRequestFailure) {
            lastApplePayNonceRequestState = {
              state: ApplePayNonceSuccessState.Failure,
              errorMessage:
                (errorDetails as ErrorDetails).message ?? 'Unknown error',
            };
            completeApplePayAuthorizationInternal(
              false,
              (errorDetails as ErrorDetails).message ?? 'Unknown error'
            );
            onApplePayNonceRequestFailure(errorDetails as ErrorDetails);
          }
        },
        () => {
          if (onApplePayComplete) {
            onApplePayComplete(
              lastApplePayNonceRequestState.state,
              lastApplePayNonceRequestState.errorMessage
            );
            lastApplePayNonceRequestState = {
              state: ApplePayNonceSuccessState.Canceled,
              errorMessage: undefined,
            };
          }
        }
      );
    } catch (error) {
      throw createInAppPaymentsError(error);
    }
  }

  export async function requestApplePayNonceWithBuyerVerification(
    paymentSourceId: string,
    cardEntryConfig: CardEntryConfig,
    applePayConfig: ApplePayConfig,
    onBuyerVerificationSuccess?: BuyerVerificationSuccessCallback,
    onBuyerVerificationFailure?: FailureCallback,
    onApplePayNonceRequestSuccess?: ApplePayNonceSuccessCallbackWithResult,
    onApplePayNonceRequestFailure?: FailureCallback,
    onApplePayComplete?: ApplePayCancelAndCompleteCallback
  ): Promise<void> {
    verifyObjectType(applePayConfig, 'applePayConfig should be a valid object');
    verifyStringType(
      paymentSourceId,
      'paymentSourceId should be a valid string'
    );
    verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object');
    verifyStringType(
      applePayConfig.price,
      'applePayConfig.price should be a valid string'
    );
    verifyStringType(
      applePayConfig.summaryLabel,
      'applePayConfig.summaryLabel should be a valid string'
    );
    verifyStringType(
      applePayConfig.countryCode,
      'applePayConfig.countryCode should be a valid string'
    );
    verifyStringType(
      applePayConfig.currencyCode,
      'applePayConfig.currencyCode should be a valid string'
    );
    let { paymentType } = applePayConfig;
    if (!applePayConfig.paymentType) {
      paymentType = PaymentType.PaymentTypeFinal;
    } else {
      verifyIntegerType(
        applePayConfig.paymentType,
        'applePayConfig.paymentType should be a valid integer'
      );
    }
    verifyStringType(
      cardEntryConfig.squareLocationId,
      'squareLocationId should be a valid string'
    );
    verifyStringType(
      cardEntryConfig.buyerAction,
      'buyerAction should be a valid string'
    );
    verifyNumberType(cardEntryConfig.amount, 'amount should be a valid number');
    verifyStringType(
      cardEntryConfig.currencyCode,
      'currencyCode should be a valid string'
    );
    const money = {
      amount: cardEntryConfig.amount,
      currencyCode: cardEntryConfig.currencyCode,
    };
    const contact = {
      givenName: cardEntryConfig.givenName,
      familyName: cardEntryConfig.familyName,
      addressLines: cardEntryConfig.addressLines,
      city: cardEntryConfig.city,
      countryCode: cardEntryConfig.countryCode,
      email: cardEntryConfig.email,
      phone: cardEntryConfig.phone,
      postalCode: cardEntryConfig.postalCode,
      region: cardEntryConfig.region,
    };
    try {
      await NativeSQIPApplePay.requestApplePayNonceWithBuyerVerification(
        applePayConfig.price,
        applePayConfig.summaryLabel,
        applePayConfig.countryCode,
        applePayConfig.currencyCode,
        paymentType!.valueOf(),
        paymentSourceId,
        cardEntryConfig.squareLocationId!,
        cardEntryConfig.buyerAction!,
        money,
        contact,
        (verificationResult) => {
          if (onBuyerVerificationSuccess) {
            onBuyerVerificationSuccess(verificationResult);
          }
        },
        (errorDetails) => {
          if (onBuyerVerificationFailure) {
            onBuyerVerificationFailure(errorDetails as ErrorDetails);
          }
        },
        (cardDetails: CardDetails) => {
          if (onApplePayNonceRequestSuccess) {
            Promise.resolve(onApplePayNonceRequestSuccess(cardDetails)).then(
              (result) => {
                if (result) {
                  lastApplePayNonceRequestState = {
                    state: result.state,
                    errorMessage: result.errorMessage,
                  };
                  completeApplePayAuthorizationInternal(
                    result.state === ApplePayNonceSuccessState.Succeeded,
                    result.errorMessage
                  );
                } else {
                  lastApplePayNonceRequestState = {
                    state: ApplePayNonceSuccessState.Failure,
                    errorMessage:
                      'Not returned result from onApplePayNonceRequestSuccess callback',
                  };
                  completeApplePayAuthorizationInternal(
                    false,
                    'Not returned result from onApplePayNonceRequestSuccess callback'
                  );
                }
              }
            );
          }
        },
        (errorDetails) => {
          if (onApplePayNonceRequestFailure) {
            lastApplePayNonceRequestState = {
              state: ApplePayNonceSuccessState.Failure,
              errorMessage:
                (errorDetails as ErrorDetails).message ?? 'Unknown error',
            };
            completeApplePayAuthorizationInternal(
              false,
              (errorDetails as ErrorDetails).message ?? 'Unknown error'
            );
            onApplePayNonceRequestFailure(errorDetails as ErrorDetails);
          }
        },
        () => {
          if (onApplePayComplete) {
            onApplePayComplete(
              lastApplePayNonceRequestState.state,
              lastApplePayNonceRequestState.errorMessage
            );
            lastApplePayNonceRequestState = {
              state: ApplePayNonceSuccessState.Canceled,
              errorMessage: undefined,
            };
          }
        }
      );
    } catch (error) {
      throw createInAppPaymentsError(error);
    }
  }
}

/**
 * @deprecated Use `ErrorCodes` instead.
 * @example 'import { ErrorCodes } from "react-native-square-in-app-payments";'
 */
export const SQIPErrorCodes = ErrorCodes;
