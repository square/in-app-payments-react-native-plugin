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

static BOOL _mockBuyerVerification = NO;

static BOOL _shouldContinueWithGiftCardEntry = NO;
static BOOL _shouldContinueWithCardEntry = NO;
static BOOL _shouldContinueWithApplePayNonceRequest = NO;

@implementation SQIPBuyerInternal

+ (void)setMockBuyerVerificationSuccess:(BOOL)mockBuyerVerificationSuccess {
  _mockBuyerVerification = mockBuyerVerificationSuccess;
}

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

    UIViewController *rootViewController =
        [UiUtilities activeRootViewController];

    SQIPVerificationParameters *params = [[SQIPVerificationParameters alloc]
        initWithPaymentSourceID:paymentSourceId
                    buyerAction:buyerAction
                     locationID:locationId
                        contact:contact];

    if ([rootViewController isKindOfClass:[UINavigationController class]]) {
      [rootViewController.navigationController popViewControllerAnimated:YES];
    } else {
      [rootViewController dismissViewControllerAnimated:YES completion:nil];
    }

    [SQIPBuyerVerificationSDK.shared verifyWithParameters:params
        theme:[SQIPCardEntryInternal theme]
        viewController:rootViewController
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
          if (_mockBuyerVerification) {
            NSDictionary *verificationResult =
                @{@"nonce" : paymentSourceId, @"token" : @"mock-token"};
            onBuyerVerificationSuccess(@[ verificationResult ]);
            [SQIPBuyerInternal shouldContinue];
          } else {
            [SQIPBuyerInternal invalidateShouldContinue];
            onBuyerVerificationFailure(@[ [ErrorUtilities
                callbackErrorObject:RNSQIPUsageError
                            message:error.localizedDescription
                          debugCode:debugCode
                       debugMessage:debugMessage] ]);
          }
        }];
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
