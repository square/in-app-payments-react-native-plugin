#import "SQIPBuyerInternal.h"
#import "SQIPApplePayInternal.h"
#import "ErrorUtilities.h"
#import "SQIPBuyerAction+RNSQIPAdditions.h"
#import "SQIPCardEntryInternal.h"
#import "SQIPContact+RNSQIPAdditions.h"
#import "UiUtilities.h"
#import <SquareBuyerVerificationSDK/SQIPBuyerVerificationSDK.h>
#import <SquareBuyerVerificationSDK/SQIPBuyerVerifiedDetails.h>
#import <SquareBuyerVerificationSDK/SQIPMoney.h>
#import <SquareBuyerVerificationSDK/SQIPVerificationParameters.h>
#import <SquareInAppPaymentsSDK/SQIPErrorConstants.h>

static BOOL _shouldContinueWithGiftCardEntry = NO;
static BOOL _shouldContinueWithCardEntry = NO;
static BOOL _shouldContinueWithApplePayNonceRequest = NO;

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
            NSDictionary *verificationResult = @{
              @"nonce" : paymentSourceId,
              @"token" : verifiedDetails.verificationToken
            };
            onBuyerVerificationSuccess(@[ verificationResult ]);
            [SQIPBuyerInternal shouldContinue];
          }
          failure:^(NSError *_Nonnull error) {
            NSString *debugCode = error.userInfo[SQIPErrorDebugCodeKey];
            NSString *debugMessage = error.userInfo[SQIPErrorDebugMessageKey];
            [SQIPBuyerInternal invalidateShouldContinue];
            onBuyerVerificationFailure(@[ [ErrorUtilities
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

+ (void)shouldContinue {
  if (_shouldContinueWithCardEntry) {
    [SQIPBuyerInternal invalidateShouldContinue];
    [SQIPCardEntryInternal startCardEntryFlowFromBuyerVerification];
  } else if (_shouldContinueWithGiftCardEntry) {
    [SQIPBuyerInternal invalidateShouldContinue];
    [SQIPCardEntryInternal startGiftCardEntryFlowFromBuyerVerification];
  } else if (_shouldContinueWithApplePayNonceRequest) {
    [SQIPBuyerInternal invalidateShouldContinue];
    [SQIPApplePayInternal requestApplePayNonceFromBuyerVerification];
  }
}

+ (void)applyShouldContinueWithGiftCardEntry {
  _shouldContinueWithGiftCardEntry = YES;
  _shouldContinueWithCardEntry = NO;
  _shouldContinueWithApplePayNonceRequest = NO;
}

+ (void)applyShouldContinueWithCardEntry {
  _shouldContinueWithCardEntry = YES;
  _shouldContinueWithGiftCardEntry = NO;
  _shouldContinueWithApplePayNonceRequest = NO;
}

+ (void)applyShouldContinueWithApplePayEntry {
  _shouldContinueWithApplePayNonceRequest = YES;
  _shouldContinueWithCardEntry = NO;
  _shouldContinueWithGiftCardEntry = NO;
}

+ (void)invalidateShouldContinue {
  _shouldContinueWithGiftCardEntry = NO;
  _shouldContinueWithCardEntry = NO;
  _shouldContinueWithApplePayNonceRequest = NO;
}

+ (void)reVerifyBuyer:(nonnull NSString *)paymentSourceId {
}

@end
