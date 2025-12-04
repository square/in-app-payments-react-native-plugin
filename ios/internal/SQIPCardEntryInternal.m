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
static BOOL _collectPostalCode = false;

static RCTResponseSenderBlock _onCardNonceRequestSuccessCallback = nil;
static RCTResponseSenderBlock _onCardEntryCancelCallback = nil;
static RCTResponseSenderBlock _onCardEntryCompleteCallback = nil;

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
                            paymentSourceId:(nonnull NSString *)paymentSourceId
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
  _collectPostalCode = collectPostalCode;
  _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  _onCardEntryCancelCallback = onCardEntryCancel;
  [SQIPBuyerInternal applyShouldContinueWithCardEntry];
  [SQIPBuyerInternal startBuyerVerificationFlow:paymentSourceId
                                     locationId:locationId
                                    buyerAction:buyerAction
                                          money:money
                                        contact:contact
                     onBuyerVerificationSuccess:onBuyerVerificationSuccess
                     onBuyerVerificationFailure:onBuyerVerificationFailure];
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
    startGiftCardEntryFlowWithBuyerVerification:
        (nonnull NSString *)paymentSourceId
                                     locationId:(nonnull NSString *)locationId
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
  [SQIPBuyerInternal applyShouldContinueWithGiftCardEntry];
  [SQIPBuyerInternal startBuyerVerificationFlow:paymentSourceId
                                     locationId:locationId
                                    buyerAction:buyerAction
                                          money:money
                                        contact:contact
                     onBuyerVerificationSuccess:onBuyerVerificationSuccess
                     onBuyerVerificationFailure:onBuyerVerificationFailure];
}

+ (void)updateOnCardNonceRequestSuccessCallback:
    (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess {
  _onCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
}

+ (void)startCardEntryFlowFromBuyerVerification {
  if (_onCardNonceRequestSuccessCallback != nil &&
      _onCardEntryCancelCallback != nil) {
    [SQIPCardEntryInternal startCardEntryFlow:_collectPostalCode
                    onCardNonceRequestSuccess:_onCardNonceRequestSuccessCallback
                            onCardEntryCancel:_onCardEntryCancelCallback];
  }
}

+ (void)startGiftCardEntryFlowFromBuyerVerification {
  if (_onCardNonceRequestSuccessCallback != nil &&
      _onCardEntryCancelCallback != nil) {
    [SQIPCardEntryInternal
        startGiftCardEntryFlow:_onCardNonceRequestSuccessCallback
             onCardEntryCancel:_onCardEntryCancelCallback];
  }
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
  _completionHandler = completionHandler;
  [SQIPCardEntryInternal
      onCardNonceRequestSuccessCallback:[cardDetails jsonDictionary]];
}

- (void)cardEntryViewController:
            (SQIPCardEntryViewController *)cardEntryViewController
          didCompleteWithStatus:(SQIPCardEntryCompletionStatus)status {
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
