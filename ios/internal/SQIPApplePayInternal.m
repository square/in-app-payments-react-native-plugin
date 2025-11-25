#import "SQIPApplePayInternal.h"
#import "ErrorUtilities.h"
#import "SQIPBuyerInternal.h"
#import "SQIPCardDetails+RNSQIPAdditions.h"
#import "UiUtilities.h"
#import <SquareInAppPaymentsSDK/PKPaymentRequest+Square.h>
#import <SquareInAppPaymentsSDK/SQIPApplePayNonceRequest.h>
#import <SquareInAppPaymentsSDK/SQIPErrorConstants.h>
#import <SquareInAppPaymentsSDK/SQIPInAppPaymentsSDK.h>

API_AVAILABLE(ios(11.0))
typedef void (^CompletionHandler)(PKPaymentAuthorizationResult *_Nonnull);

static NSString *_applePayMerchantId = nil;
static NSString *_price = nil;
static NSString *_summaryLabel = nil;
static NSString *_countryCode = nil;
static NSString *_currencyCode = nil;
static double _paymentType = 0;

static SQIPApplePayInternal *_delegate = nil;

static CompletionHandler _completionHandler = nil;

static RCTResponseSenderBlock _onApplePayNonceRequestSuccessCallback = nil;
static RCTResponseSenderBlock _onApplePayNonceRequestFailureCallback = nil;
static RCTResponseSenderBlock _onApplePayCompleteCallback = nil;

@implementation SQIPApplePayInternal

+ (void)canUseApplePay:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject {
  resolve(@(SQIPInAppPaymentsSDK.canUseApplePay));
}

+ (void)completeApplePayAuthorization:(BOOL)isSuccess
                         errorMessage:(nonnull NSString *)errorMessage {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (_completionHandler != nil) {
      if (isSuccess) {
        PKPaymentAuthorizationResult *authResult =
            [[PKPaymentAuthorizationResult alloc]
                initWithStatus:PKPaymentAuthorizationStatusSuccess
                        errors:nil];
        _completionHandler(authResult);
      } else {
        NSDictionary *userInfo =
            errorMessage == nil || errorMessage.length == 0
                ? nil
                : @{NSLocalizedDescriptionKey : errorMessage};
        NSError *error = [NSError errorWithDomain:NSGlobalDomain
                                             code:RNSQIPApplePayErrorCode
                                         userInfo:userInfo];
        if (@available(iOS 11.0, *)) {
          PKPaymentAuthorizationResult *authResult =
              [[PKPaymentAuthorizationResult alloc]
                  initWithStatus:PKPaymentAuthorizationStatusFailure
                          errors:@[ error ]];
          _completionHandler(authResult);
        } else {
          // This should never happen as we require target to be 11.0 or above
          NSAssert(false, @"No Apple Pay support for iOS 10 or below.");
        }
      }
      _completionHandler = nil;
    }
  });
}

+ (void)initializeApplePay:(nonnull NSString *)applePayMerchantId {
  _applePayMerchantId = applePayMerchantId;
}

+ (void)requestApplePayNonce:(nonnull NSString *)price
                     summaryLabel:(nonnull NSString *)summaryLabel
                      countryCode:(nonnull NSString *)countryCode
                     currencyCode:(nonnull NSString *)currencyCode
                      paymentType:(double)paymentType
    onApplePayNonceRequestSuccess:
        (nonnull RCTResponseSenderBlock)onApplePayNonceRequestSuccess
    onApplePayNonceRequestFailure:
        (nonnull RCTResponseSenderBlock)onApplePayNonceRequestFailure
               onApplePayComplete:
                   (nonnull RCTResponseSenderBlock)onApplePayComplete
                          resolve:(nonnull RCTPromiseResolveBlock)resolve
                           reject:(nonnull RCTPromiseRejectBlock)reject {
  if (_applePayMerchantId == nil) {
    reject(RNSQIPUsageError,
           [ErrorUtilities
               createNativeModuleError:RNSQIPApplePayNotInitialized
                          debugMessage:RNSQIPMessageApplePayNotInitialized],
           nil);
    return;
  }
  if (!SQIPInAppPaymentsSDK.canUseApplePay) {
    reject(RNSQIPUsageError,
           [ErrorUtilities
               createNativeModuleError:RNSQIPApplePayNotSupport
                          debugMessage:RNSQIPMessageApplePayNotSupported],
           nil);
    return;
  }
  _onApplePayNonceRequestSuccessCallback = onApplePayNonceRequestSuccess;
  _onApplePayNonceRequestFailureCallback = onApplePayNonceRequestFailure;
  _onApplePayCompleteCallback = onApplePayComplete;

  PKPaymentRequest *paymentRequest = [PKPaymentRequest
      squarePaymentRequestWithMerchantIdentifier:_applePayMerchantId
                                     countryCode:countryCode
                                    currencyCode:currencyCode];
  if ((int)paymentType == 1) {
    paymentRequest.paymentSummaryItems = @[ [PKPaymentSummaryItem
        summaryItemWithLabel:summaryLabel
                      amount:[NSDecimalNumber decimalNumberWithString:price]
                        type:PKPaymentSummaryItemTypePending] ];
  } else {
    paymentRequest.paymentSummaryItems = @[ [PKPaymentSummaryItem
        summaryItemWithLabel:summaryLabel
                      amount:[NSDecimalNumber decimalNumberWithString:price]
                        type:PKPaymentSummaryItemTypeFinal] ];
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    PKPaymentAuthorizationViewController *paymentAuthorizationViewController =
        [[PKPaymentAuthorizationViewController alloc]
            initWithPaymentRequest:paymentRequest];

    paymentAuthorizationViewController.delegate =
        [SQIPApplePayInternal delegate];
    UIViewController *rootViewController =
        [UiUtilities activeRootViewController];
    [rootViewController presentViewController:paymentAuthorizationViewController
                                     animated:NO
                                   completion:nil];
    resolve([NSNull null]);
  });
}

+ (void)
    requestApplePayNonceWithBuyerVerification:(nonnull NSString *)price
                                 summaryLabel:(nonnull NSString *)summaryLabel
                                  countryCode:(nonnull NSString *)countryCode
                                 currencyCode:(nonnull NSString *)currencyCode
                                  paymentType:(double)paymentType
                              paymentSourceId:
                                  (nonnull NSString *)paymentSourceId
                                   locationId:(nonnull NSString *)locationId
                                  buyerAction:(nonnull NSString *)buyerAction
                                        money:(nonnull NSDictionary *)money
                                      contact:(nonnull NSDictionary *)contact
                   onBuyerVerificationSuccess:(nonnull RCTResponseSenderBlock)
                                                  onBuyerVerificationSuccess
                   onBuyerVerificationFailure:(nonnull RCTResponseSenderBlock)
                                                  onBuyerVerificationFailure
                onApplePayNonceRequestSuccess:(nonnull RCTResponseSenderBlock)
                                                  onApplePayNonceRequestSuccess
                onApplePayNonceRequestFailure:(nonnull RCTResponseSenderBlock)
                                                  onApplePayNonceRequestFailure
                           onApplePayComplete:(nonnull RCTResponseSenderBlock)
                                                  onApplePayComplete
                                      resolve:(nonnull RCTPromiseResolveBlock)
                                                  resolve
                                       reject:(nonnull RCTPromiseRejectBlock)
                                                  reject {
  if (_applePayMerchantId == nil) {
    reject(RNSQIPUsageError,
           [ErrorUtilities
               createNativeModuleError:RNSQIPApplePayNotInitialized
                          debugMessage:RNSQIPMessageApplePayNotInitialized],
           nil);
    return;
  }
  if (!SQIPInAppPaymentsSDK.canUseApplePay) {
    reject(RNSQIPUsageError,
           [ErrorUtilities
               createNativeModuleError:RNSQIPApplePayNotSupport
                          debugMessage:RNSQIPMessageApplePayNotSupported],
           nil);
    return;
  }
  _onApplePayNonceRequestSuccessCallback = onApplePayNonceRequestSuccess;
  _onApplePayNonceRequestFailureCallback = onApplePayNonceRequestFailure;
  _onApplePayCompleteCallback = onApplePayComplete;
  _price = price;
  _summaryLabel = summaryLabel;
  _countryCode = countryCode;
  _currencyCode = currencyCode;
  _paymentType = paymentType;

  [SQIPBuyerInternal applyShouldContinueWithApplePayEntry];
  [SQIPBuyerInternal startBuyerVerificationFlow:paymentSourceId
                                     locationId:locationId
                                    buyerAction:buyerAction
                                          money:money
                                        contact:contact
                     onBuyerVerificationSuccess:onBuyerVerificationSuccess
                     onBuyerVerificationFailure:onBuyerVerificationFailure];
  resolve([NSNull null]);
}

+ (void)requestApplePayNonceFromBuyerVerification {
  if (_price != nil && _summaryLabel != nil && _countryCode != nil &&
      _currencyCode != nil && _paymentType != 0) {
    PKPaymentRequest *paymentRequest = [PKPaymentRequest
        squarePaymentRequestWithMerchantIdentifier:_applePayMerchantId
                                       countryCode:_countryCode
                                      currencyCode:_currencyCode];
    if ((int)_paymentType == 1) {
      paymentRequest.paymentSummaryItems = @[ [PKPaymentSummaryItem
          summaryItemWithLabel:_summaryLabel
                        amount:[NSDecimalNumber decimalNumberWithString:_price]
                          type:PKPaymentSummaryItemTypePending] ];
    } else {
      paymentRequest.paymentSummaryItems = @[ [PKPaymentSummaryItem
          summaryItemWithLabel:_summaryLabel
                        amount:[NSDecimalNumber decimalNumberWithString:_price]
                          type:PKPaymentSummaryItemTypeFinal] ];
    }
    // Wait the buyer verification overlay to be dismissed
    int64_t delay = (int64_t)(0.5 * NSEC_PER_SEC);
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, delay), dispatch_get_main_queue(), ^{
      PKPaymentAuthorizationViewController *paymentAuthorizationViewController =
          [[PKPaymentAuthorizationViewController alloc]
              initWithPaymentRequest:paymentRequest];

      paymentAuthorizationViewController.delegate =
          [SQIPApplePayInternal delegate];
      UIViewController *rootViewController =
          [UiUtilities activeRootViewController];

      [rootViewController
          presentViewController:paymentAuthorizationViewController
                       animated:NO
                     completion:nil];
    });
  }
}

+ (void)onApplePayNonceRequestSuccessCallback:(nonnull NSDictionary *)response {
  if (_onApplePayNonceRequestSuccessCallback != nil) {
    _onApplePayNonceRequestSuccessCallback(@[ response ]);
  }
  _onApplePayNonceRequestSuccessCallback = nil;
}

+ (void)onApplePayNonceRequestFailureCallback:(nonnull NSDictionary *)response {
  if (_onApplePayNonceRequestFailureCallback != nil) {
    _onApplePayNonceRequestFailureCallback(@[ response ]);
  }
  _onApplePayNonceRequestFailureCallback = nil;
}

+ (void)onApplePayCompleteCallback {
  if (_onApplePayCompleteCallback != nil) {
    _onApplePayCompleteCallback(@[]);
  }
  _onApplePayCompleteCallback = nil;
  _onApplePayNonceRequestFailureCallback = nil;
  _onApplePayNonceRequestSuccessCallback = nil;
}

#pragma mark - internal methods

+ (SQIPApplePayInternal *)delegate {
  if (_delegate == nil) {
    _delegate = [[SQIPApplePayInternal alloc] init];
  }
  return _delegate;
}

#pragma mark - PKPaymentAuthorizationViewControllerDelegate

- (void)paymentAuthorizationViewControllerDidFinish:
    (nonnull PKPaymentAuthorizationViewController *)controller {
  if ([controller isKindOfClass:[UINavigationController class]]) {
    [controller.navigationController popViewControllerAnimated:YES];
    [SQIPApplePayInternal onApplePayCompleteCallback];
  } else {
    [controller
        dismissViewControllerAnimated:YES
                           completion:^{
                             [SQIPApplePayInternal onApplePayCompleteCallback];
                           }];
  }
}

- (void)paymentAuthorizationViewController:
            (PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                   handler:(CompletionHandler)completion
    API_AVAILABLE(ios(11.0));
{
  SQIPApplePayNonceRequest *nonceRequest =
      [[SQIPApplePayNonceRequest alloc] initWithPayment:payment];
  _completionHandler = completion;

  [nonceRequest
      performWithCompletionHandler:^(SQIPCardDetails *_Nullable result,
                                     NSError *_Nullable error) {
        if (error) {
          NSString *debugCode = error.userInfo[SQIPErrorDebugCodeKey];
          NSString *debugMessage = error.userInfo[SQIPErrorDebugMessageKey];

          [SQIPApplePayInternal
              onApplePayNonceRequestFailureCallback:
                  [ErrorUtilities callbackErrorObject:RNSQIPUsageError
                                              message:error.localizedDescription
                                            debugCode:debugCode
                                         debugMessage:debugMessage]];
        } else {
          [SQIPApplePayInternal
              onApplePayNonceRequestSuccessCallback:[result jsonDictionary]];
        }
      }];
}

@end
