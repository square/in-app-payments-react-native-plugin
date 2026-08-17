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

#define SQIPFlowLog(fmt, ...) \
  NSLog(@"[SQIPFlow] " fmt, ##__VA_ARGS__)

static NSString *_SQIPCollectVerifyStepMessage(
    NSInteger step, NSString *_Nullable paymentUiOverride) {
  switch (step) {
  case 1:
    return paymentUiOverride
               ? [NSString stringWithFormat:@"Open %@ first", paymentUiOverride]
               : @"Open card entry / Apple Pay / Google Pay first";
  case 2:
    return @"Buyer picks or types a card → we get a nonce";
  case 3:
    return @"Run 3DS verification on that nonce";
  case 4:
    return @"Return the nonce + the verification token together";
  default:
    return @"unknown step";
  }
}

#define SQIPCollectVerifyStep(step, paymentUiOverride)                         \
  SQIPFlowLog(@"[%ld/4] ✓ %@", (long)(step),                                   \
              _SQIPCollectVerifyStepMessage(step, paymentUiOverride))

#define SQIPCollectVerifyStepWithNonce(step, paymentUiOverride, nonce)         \
  SQIPFlowLog(@"[%ld/4] ✓ %@ nonce code: %@", (long)(step),                   \
              _SQIPCollectVerifyStepMessage(step, paymentUiOverride), nonce)

static NSString *_SQIPFlowMaskId(NSString *idValue) {
  if (idValue == nil || idValue.length == 0) {
    return @"(none)";
  }
  return idValue;
}

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
  [SQIPBuyerInternal clearPreparedBuyerVerification];

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

  [SQIPBuyerInternal prepareBuyerVerificationWithLocationId:locationId
                                                buyerAction:buyerAction
                                                      money:money
                                                    contact:contact
                                 onBuyerVerificationSuccess:onBuyerVerificationSuccess
                                 onBuyerVerificationFailure:onBuyerVerificationFailure];
  SQIPCollectVerifyStep(1, @"Apple Pay");

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
  void (^afterDismiss)(void) = ^{
    if ([SQIPBuyerInternal isBuyerVerificationPrepared]) {
      BOOL started = [SQIPBuyerInternal startPreparedBuyerVerification];
      if (!started) {
        [SQIPApplePayInternal onApplePayCompleteCallback];
      }
    } else {
      [SQIPApplePayInternal onApplePayCompleteCallback];
    }
  };
  if ([controller isKindOfClass:[UINavigationController class]]) {
    [controller.navigationController popViewControllerAnimated:YES];
    afterDismiss();
  } else {
    [controller dismissViewControllerAnimated:YES completion:afterDismiss];
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

          [SQIPBuyerInternal clearPreparedBuyerVerification];
          [SQIPApplePayInternal
              onApplePayNonceRequestFailureCallback:
                  [ErrorUtilities callbackErrorObject:RNSQIPUsageError
                                              message:error.localizedDescription
                                            debugCode:debugCode
                                         debugMessage:debugMessage]];
        } else if ([SQIPBuyerInternal isBuyerVerificationPrepared]) {
          // Auto-complete the Apple Pay sheet, then 3DS runs after dismiss.
          SQIPCollectVerifyStepWithNonce(2, @"Apple Pay", result.nonce);
          [SQIPBuyerInternal setPreparedCardDetails:[result jsonDictionary]];
          if (_completionHandler != nil) {
            PKPaymentAuthorizationResult *authResult =
                [[PKPaymentAuthorizationResult alloc]
                    initWithStatus:PKPaymentAuthorizationStatusSuccess
                            errors:nil];
            _completionHandler(authResult);
            _completionHandler = nil;
          }
        } else {
          [SQIPApplePayInternal
              onApplePayNonceRequestSuccessCallback:[result jsonDictionary]];
        }
      }];
}

@end
