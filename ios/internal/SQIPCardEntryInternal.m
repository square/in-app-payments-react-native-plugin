#import "SQIPCardEntryInternal.h"
#import "ErrorUtilities.h"
#import "SQIPBuyerInternal.h"
#import "SQIPCardDetails+RNSQIPAdditions.h"
#import "SQIPTheme+RNSQIPAdditions.h"
#import "UiUtilities.h"
#import <SquareInAppPaymentsSDK/SQIPTheme.h>

typedef void (^CompletionHandler)(NSError *_Nullable);

static SQIPCardEntryInternal *internalDelegate = nil;

static SQIPTheme *internalTheme = nil;
static CompletionHandler _completionHandler = nil;

static RCTResponseSenderBlock _onCardNonceRequestSuccessCallback = nil;
static RCTResponseSenderBlock _onCardEntryCancelCallback = nil;
static RCTResponseSenderBlock _onCardEntryCompleteCallback = nil;

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

@implementation SQIPCardEntryInternal

+ (void)completeCardEntry:(nonnull RCTResponseSenderBlock)onCardEntryComplete {
  _onCardEntryCompleteCallback = onCardEntryComplete;
  if (_completionHandler != nil) {
    _completionHandler(nil);
    _completionHandler = nil;
  }
}

+ (void)setIOSCardEntryTheme:(nonnull NSDictionary *)theme {
  internalTheme = [SQIPTheme fromDictionary:theme];
}

+ (void)showCardNonceProcessingError:(nonnull NSString *)errorMessage {
  if (_completionHandler != nil) {
    NSDictionary *userInfo = @{NSLocalizedDescriptionKey : errorMessage};
    NSError *error = [NSError errorWithDomain:NSGlobalDomain
                                         code:RNSQIPCardEntryErrorCode
                                     userInfo:userInfo];
    _completionHandler(error);
    _completionHandler = nil;
  }
}

+ (void)startCardEntryFlow:(BOOL)collectPostalCode
    onCardNonceRequestSuccess:
        (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
            onCardEntryCancel:
                (nonnull RCTResponseSenderBlock)onCardEntryCancel {
  dispatch_async(dispatch_get_main_queue(), ^{
    _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
    _onCardEntryCancelCallback = onCardEntryCancel;
    SQIPCardEntryViewController *cardEntryForm =
        [SQIPCardEntryInternal _makeCardEntryForm];
    cardEntryForm.collectPostalCode = collectPostalCode;
    cardEntryForm.delegate = [SQIPCardEntryInternal delegate];
    UIViewController *presentingViewController =
        [UiUtilities activeRootViewController];
    if ([presentingViewController
            isKindOfClass:[UINavigationController class]]) {
      UINavigationController *nav =
          (UINavigationController *)presentingViewController;
      [nav pushViewController:cardEntryForm animated:YES];
    } else {
      UINavigationController *navigationController =
          [[UINavigationController alloc]
              initWithRootViewController:cardEntryForm];
      [presentingViewController presentViewController:navigationController
                                             animated:YES
                                           completion:nil];
    }
  });
}

+ (void)
    startCardEntryFlowWithBuyerVerification:(BOOL)collectPostalCode
                                 locationId:(nonnull NSString *)locationId
                                buyerAction:(nonnull NSString *)buyerAction
                                      money:(nonnull NSDictionary *)money
                                    contact:(nonnull NSDictionary *)contact
                 onBuyerVerificationSuccess:
                     (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
                 onBuyerVerificationFailure:
                     (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure
                  onCardNonceRequestSuccess:
                      (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
                          onCardEntryCancel:(nonnull RCTResponseSenderBlock)
                                                onCardEntryCancel {
  _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  _onCardEntryCancelCallback = onCardEntryCancel;
  [SQIPBuyerInternal prepareBuyerVerificationWithLocationId:locationId
                                                buyerAction:buyerAction
                                                      money:money
                                                    contact:contact
                                 onBuyerVerificationSuccess:onBuyerVerificationSuccess
                                 onBuyerVerificationFailure:onBuyerVerificationFailure];
  SQIPCollectVerifyStep(1, @"card entry");
  [SQIPCardEntryInternal startCardEntryFlow:collectPostalCode
                  onCardNonceRequestSuccess:onCardNonceRequestSuccess
                          onCardEntryCancel:onCardEntryCancel];
}

+ (void)startGiftCardEntryFlow:
            (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
             onCardEntryCancel:
                 (nonnull RCTResponseSenderBlock)onCardEntryCancel {
  dispatch_async(dispatch_get_main_queue(), ^{
    _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
    _onCardEntryCancelCallback = onCardEntryCancel;
    SQIPCardEntryViewController *cardEntryForm =
        [SQIPCardEntryInternal _makeGiftCardEntryForm];
    cardEntryForm.delegate = [SQIPCardEntryInternal delegate];
    UIViewController *presentingViewController =
        [UiUtilities activeRootViewController];
    if ([presentingViewController
            isKindOfClass:[UINavigationController class]]) {
      UINavigationController *nav =
          (UINavigationController *)presentingViewController;
      [nav pushViewController:cardEntryForm animated:YES];
    } else {
      UINavigationController *navigationController =
          [[UINavigationController alloc]
              initWithRootViewController:cardEntryForm];
      [presentingViewController presentViewController:navigationController
                                             animated:YES
                                           completion:nil];
    }
  });
}

+ (void)
    startGiftCardEntryFlowWithBuyerVerification:(nonnull NSString *)locationId
                                    buyerAction:(nonnull NSString *)buyerAction
                                          money:(nonnull NSDictionary *)money
                                        contact:(nonnull NSDictionary *)contact
                     onBuyerVerificationSuccess:(nonnull RCTResponseSenderBlock)
                                                    onBuyerVerificationSuccess
                     onBuyerVerificationFailure:(nonnull RCTResponseSenderBlock)
                                                    onBuyerVerificationFailure
                      onCardNonceRequestSuccess:(nonnull RCTResponseSenderBlock)
                                                    onCardNonceRequestSuccess
                              onCardEntryCancel:(nonnull RCTResponseSenderBlock)
                                                    onCardEntryCancel {
  _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  _onCardEntryCancelCallback = onCardEntryCancel;
  [SQIPBuyerInternal prepareBuyerVerificationWithLocationId:locationId
                                                buyerAction:buyerAction
                                                      money:money
                                                    contact:contact
                                 onBuyerVerificationSuccess:onBuyerVerificationSuccess
                                 onBuyerVerificationFailure:onBuyerVerificationFailure];
  SQIPCollectVerifyStep(1, @"gift card entry");
  [SQIPCardEntryInternal
      startGiftCardEntryFlow:onCardNonceRequestSuccess
           onCardEntryCancel:onCardEntryCancel];
}

+ (void)updateOnCardNonceRequestSuccessCallback:
    (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess {
  _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
}

+ (SQIPTheme *_Nonnull)theme {
  if (internalTheme == nil) {
    internalTheme = [[SQIPTheme alloc] init];
  }
  return internalTheme;
}

#pragma mark - Card Entry internal Methods

+ (void)onCardEntryCompleteCallback {
  if (_onCardEntryCompleteCallback != nil) {
    _onCardEntryCompleteCallback(@[]);
  }
  _onCardEntryCompleteCallback = nil;
  // invalidate callbacks
  _onCardEntryCompleteCallback = nil;
  _onCardNonceRequestSuccessCallback = nil;
  _onCardEntryCancelCallback = nil;
}

+ (void)onCardNonceRequestSuccessCallback:(NSDictionary *)response {
  if (_onCardNonceRequestSuccessCallback != nil) {
    _onCardNonceRequestSuccessCallback(@[ response ]);
  }
  _onCardNonceRequestSuccessCallback = nil;
}

+ (void)onCardEntryCancelCallback {
  _onCardEntryCompleteCallback = nil;
  _onCardNonceRequestSuccessCallback = nil;
  [SQIPBuyerInternal clearPreparedBuyerVerification];
  if (_onCardEntryCancelCallback != nil) {
    _onCardEntryCancelCallback(@[]);
  }
  _onCardEntryCancelCallback = nil;
}

+ (SQIPCardEntryViewController *)_makeCardEntryForm {
  return [[SQIPCardEntryViewController alloc]
      initWithTheme:[SQIPCardEntryInternal theme]];
}

+ (SQIPCardEntryViewController *)_makeGiftCardEntryForm {
  return [[SQIPCardEntryViewController alloc]
      initWithTheme:[SQIPCardEntryInternal theme]
         isGiftCard:true];
}

+ (SQIPCardEntryInternal *)delegate {
  if (internalDelegate == nil) {
    internalDelegate = [[SQIPCardEntryInternal alloc] init];
  }
  return internalDelegate;
}

#pragma mark - Card Entry delegates Methods

- (void)cardEntryViewController:
            (SQIPCardEntryViewController *)cardEntryViewController
           didObtainCardDetails:(SQIPCardDetails *)cardDetails
              completionHandler:(CompletionHandler)completionHandler {
  if ([SQIPBuyerInternal isBuyerVerificationPrepared]) {
    // Auto-finish card entry so we can verify the collected nonce, matching 1.x.
    SQIPCollectVerifyStepWithNonce(2, @"card entry", cardDetails.nonce);
    [SQIPBuyerInternal setPreparedCardDetails:[cardDetails jsonDictionary]];
    completionHandler(nil);
    return;
  }
  _completionHandler = completionHandler;
  [SQIPCardEntryInternal
      onCardNonceRequestSuccessCallback:[cardDetails jsonDictionary]];
}

- (void)cardEntryViewController:
            (SQIPCardEntryViewController *)cardEntryViewController
          didCompleteWithStatus:(SQIPCardEntryCompletionStatus)status {
  if ([SQIPBuyerInternal isBuyerVerificationPrepared] &&
      status == SQIPCardEntryCompletionStatusSuccess) {
    SQIPCollectVerifyStep(2, @"card entry");
    // If card entry was pushed onto a navigation stack, pop it first so 3DS
    // is not presented on top of the form. Modal presentation is dismissed
    // inside SQIPBuyerInternal before 3DS is shown.
    if (cardEntryViewController.navigationController &&
        cardEntryViewController.navigationController.viewControllers.count > 1) {
      [cardEntryViewController.navigationController popViewControllerAnimated:YES];
      dispatch_async(dispatch_get_main_queue(), ^{
        [SQIPBuyerInternal startPreparedBuyerVerification];
      });
    } else {
      [SQIPBuyerInternal startPreparedBuyerVerification];
    }
    return;
  }

  void (^callbacks)(void) = ^{
    if (status == SQIPCardEntryCompletionStatusCanceled) {
      [SQIPCardEntryInternal onCardEntryCancelCallback];
    } else {
      [SQIPCardEntryInternal onCardEntryCompleteCallback];
    }
  };

  if (cardEntryViewController.navigationController) {
    UINavigationController *nav = cardEntryViewController.navigationController;
    if (nav.viewControllers.count > 1) {
      [nav popViewControllerAnimated:YES];
      callbacks();
    } else {
      [nav dismissViewControllerAnimated:YES
                              completion:^{
                                callbacks();
                              }];
    }
  } else {
    [cardEntryViewController dismissViewControllerAnimated:YES
                                                completion:^{
                                                  callbacks();
                                                }];
  }
}

@end
