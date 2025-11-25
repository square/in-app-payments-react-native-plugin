#import "SQIPCardEntry.h"
#import "SQIPCardEntryInternal.h"

@implementation SQIPCardEntry

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSQIPCardEntrySpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"SQIPCardEntry";
}

- (void)completeCardEntry:(nonnull RCTResponseSenderBlock)onCardEntryComplete {
  [SQIPCardEntryInternal completeCardEntry:onCardEntryComplete];
}

- (void)setIOSCardEntryTheme:(nonnull NSDictionary *)theme {
  [SQIPCardEntryInternal setIOSCardEntryTheme:theme];
}

- (void)showCardNonceProcessingError:(nonnull NSString *)errorMessage {
  [SQIPCardEntryInternal showCardNonceProcessingError:errorMessage];
}

- (void)startCardEntryFlow:(BOOL)collectPostalCode
    onCardNonceRequestSuccess:
        (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
            onCardEntryCancel:
                (nonnull RCTResponseSenderBlock)onCardEntryCancel {
  [SQIPCardEntryInternal startCardEntryFlow:collectPostalCode
                  onCardNonceRequestSuccess:onCardNonceRequestSuccess
                          onCardEntryCancel:onCardEntryCancel];
}

- (void)
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
  [SQIPCardEntryInternal
      startCardEntryFlowWithBuyerVerification:collectPostalCode
                              paymentSourceId:paymentSourceId
                                   locationId:locationId
                                  buyerAction:buyerAction
                                        money:money
                                      contact:contact
                   onBuyerVerificationSuccess:onBuyerVerificationSuccess
                   onBuyerVerificationFailure:onBuyerVerificationFailure
                    onCardNonceRequestSuccess:onCardNonceRequestSuccess
                            onCardEntryCancel:onCardEntryCancel];
}

- (void)startGiftCardEntryFlow:
            (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
             onCardEntryCancel:
                 (nonnull RCTResponseSenderBlock)onCardEntryCancel {
  [SQIPCardEntryInternal startGiftCardEntryFlow:onCardNonceRequestSuccess
                              onCardEntryCancel:onCardEntryCancel

  ];
}

- (void)
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
  [SQIPCardEntryInternal
      startGiftCardEntryFlowWithBuyerVerification:paymentSourceId
                                       locationId:locationId
                                      buyerAction:buyerAction
                                            money:money
                                          contact:contact
                       onBuyerVerificationSuccess:onBuyerVerificationSuccess
                       onBuyerVerificationFailure:onBuyerVerificationFailure
                        onCardNonceRequestSuccess:onCardNonceRequestSuccess
                                onCardEntryCancel:onCardEntryCancel];
}

- (void)updateOnCardNonceRequestSuccessCallback:
    (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess {
  [SQIPCardEntryInternal
      updateOnCardNonceRequestSuccessCallback:onCardNonceRequestSuccess];
}

@end
