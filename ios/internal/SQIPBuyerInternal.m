#import "SQIPBuyerInternal.h"
#import "ErrorUtilities.h"
#import "SQIPBuyerAction+RNSQIPAdditions.h"
#import "SQIPCardEntryInternal.h"
#import "SQIPContact+RNSQIPAdditions.h"
#import "UiUtilities.h"
#import <UIKit/UIKit.h>
#import <SquareBuyerVerificationSDK/SQIPBuyerVerificationSDK.h>
#import <SquareBuyerVerificationSDK/SQIPBuyerVerifiedDetails.h>
#import <SquareBuyerVerificationSDK/SQIPMoney.h>
#import <SquareBuyerVerificationSDK/SQIPVerificationParameters.h>
#import <SquareInAppPaymentsSDK/SQIPErrorConstants.h>

static NSString *_preparedLocationId = nil;
static NSString *_preparedBuyerActionString = nil;
static NSDictionary *_preparedMoneyMap = nil;
static NSDictionary *_preparedContactMap = nil;
static NSDictionary *_preparedCardDetails = nil;
static RCTResponseSenderBlock _preparedSuccess = nil;
static RCTResponseSenderBlock _preparedFailure = nil;

static NSString *_SQIPFlowMaskId(NSString *idValue) {
  if (idValue == nil || idValue.length == 0) {
    return @"(none)";
  }
  return idValue;
}

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

@implementation SQIPBuyerInternal

+ (void)startBuyerVerificationFlow:(nonnull NSString *)paymentSourceId
                        locationId:(nonnull NSString *)locationId
                       buyerAction:(nonnull NSString *)buyerActionString
                             money:(nonnull NSDictionary *)moneyMap
                           contact:(nonnull NSDictionary *)contactMap
        onBuyerVerificationSuccess:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
                    onBuyerVerificationFailure:
                        (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure {
  SQIPFlowLog(@"standalone startBuyerVerificationFlow — verify caller-supplied "
              @"paymentSourceId=%@",
              _SQIPFlowMaskId(paymentSourceId));
  [SQIPBuyerInternal verifyPaymentSourceId:paymentSourceId
                                locationId:locationId
                               buyerAction:buyerActionString
                                     money:moneyMap
                                   contact:contactMap
                               cardDetails:nil
                                onSuccess:onBuyerVerificationSuccess
                                onFailure:onBuyerVerificationFailure];
}

+ (void)prepareBuyerVerificationWithLocationId:(nonnull NSString *)locationId
                                   buyerAction:(nonnull NSString *)buyerAction
                                         money:(nonnull NSDictionary *)money
                                       contact:(nonnull NSDictionary *)contact
                    onBuyerVerificationSuccess:
                        (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
                    onBuyerVerificationFailure:
                        (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure {
  SQIPFlowLog(@"setup: 3DS params stored (location, amount, buyer contact)");
  _preparedLocationId = [locationId copy];
  _preparedBuyerActionString = [buyerAction copy];
  _preparedMoneyMap = [money copy];
  _preparedContactMap = [contact copy];
  _preparedCardDetails = nil;
  _preparedSuccess = [onBuyerVerificationSuccess copy];
  _preparedFailure = [onBuyerVerificationFailure copy];
}

+ (BOOL)isBuyerVerificationPrepared {
  return _preparedLocationId != nil && _preparedSuccess != nil;
}

+ (void)setPreparedCardDetails:(nonnull NSDictionary *)cardDetails {
  _preparedCardDetails = [cardDetails copy];
}

+ (BOOL)startPreparedBuyerVerification {
  NSString *nonce = _preparedCardDetails[@"nonce"];
  if (nonce == nil || _preparedLocationId == nil || _preparedSuccess == nil) {
    [SQIPBuyerInternal clearPreparedBuyerVerification];
    return NO;
  }
  SQIPCollectVerifyStepWithNonce(3, nil, nonce);
  [SQIPBuyerInternal verifyPaymentSourceId:nonce
                                locationId:_preparedLocationId
                               buyerAction:_preparedBuyerActionString
                                     money:_preparedMoneyMap
                                   contact:_preparedContactMap
                               cardDetails:_preparedCardDetails
                                onSuccess:_preparedSuccess
                                onFailure:_preparedFailure];
  return YES;
}

+ (void)clearPreparedBuyerVerification {
  _preparedLocationId = nil;
  _preparedBuyerActionString = nil;
  _preparedMoneyMap = nil;
  _preparedContactMap = nil;
  _preparedCardDetails = nil;
  _preparedSuccess = nil;
  _preparedFailure = nil;
}

+ (void)verifyPaymentSourceId:(nonnull NSString *)paymentSourceId
                   locationId:(nonnull NSString *)locationId
                  buyerAction:(nonnull NSString *)buyerActionString
                        money:(nonnull NSDictionary *)moneyMap
                      contact:(nonnull NSDictionary *)contactMap
                  cardDetails:(NSDictionary *_Nullable)cardDetails
                    onSuccess:(nonnull RCTResponseSenderBlock)onSuccess
                    onFailure:(nonnull RCTResponseSenderBlock)onFailure {
  dispatch_async(dispatch_get_main_queue(), ^{
    SQIPBuyerAction *buyerAction =
        [SQIPBuyerAction fromStringDictionary:buyerActionString money:moneyMap];
    SQIPContact *contact = [SQIPContact fromDictionary:contactMap];

    SQIPVerificationParameters *params = [[SQIPVerificationParameters alloc]
        initWithPaymentSourceID:paymentSourceId
                    buyerAction:buyerAction
                     locationID:locationId
                        contact:contact];

    // Capture the success/failure blocks so we can present from the dismissal
    // completion handler. We need to wait for any in-progress dismissal to
    // finish before handing 3DS_SDK a presenter — otherwise it tries to
    // present on a VC whose view is mid-removal from the window hierarchy,
    // which surfaces as "view is not in the window hierarchy" under the new
    // React Native architecture (RCTFabricModalHostViewController).
    void (^presentVerification)(void) = ^{
      UIViewController *presenter = [UiUtilities activeRootViewController];
      [SQIPBuyerVerificationSDK.shared verifyWithParameters:params
          theme:[SQIPCardEntryInternal theme]
          viewController:presenter
          success:^(SQIPBuyerVerifiedDetails *_Nonnull verifiedDetails) {
            NSMutableDictionary *verificationResult =
                [NSMutableDictionary dictionary];
            if (cardDetails != nil) {
              [verificationResult addEntriesFromDictionary:cardDetails];
            } else {
              verificationResult[@"nonce"] = paymentSourceId;
            }
            verificationResult[@"token"] = verifiedDetails.verificationToken;
            SQIPFlowLog(@"[4/4] ✓ Return the nonce + the verification token together");
            SQIPFlowLog(@"     nonce code: %@", verificationResult[@"nonce"] ?: @"(none)");
            SQIPFlowLog(@"     verification token: %@", verificationResult[@"token"] ?: @"(none)");
            onSuccess(@[ verificationResult ]);
            [SQIPBuyerInternal clearPreparedBuyerVerification];
          }
          failure:^(NSError *_Nonnull error) {
            NSString *debugCode = error.userInfo[SQIPErrorDebugCodeKey];
            SQIPFlowLog(@"[3/4] ✗ 3DS failed — %@", debugCode ?: error.localizedDescription);
            NSString *debugMessage = error.userInfo[SQIPErrorDebugMessageKey];
            [SQIPBuyerInternal clearPreparedBuyerVerification];
            onFailure(@[ [ErrorUtilities
                callbackErrorObject:RNSQIPUsageError
                            message:error.localizedDescription
                          debugCode:debugCode
                       debugMessage:debugMessage] ]);
          }];
    };

    UIViewController *activeViewController =
        [UiUtilities activeRootViewController];

    // If a modal (e.g. card entry) is on top, dismiss it first and only
    // present verification once dismissal completes — `presentingViewController`
    // is the VC the active modal will hand control back to.
    if (activeViewController.presentingViewController != nil) {
      [activeViewController.presentingViewController
          dismissViewControllerAnimated:YES
                             completion:presentVerification];
    } else {
      presentVerification();
    }
  });
}

@end
