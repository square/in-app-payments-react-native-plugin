#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <SquareInAppPaymentsSDK/SQIPCardEntryViewController.h>

@interface SQIPCardEntryInternal
    : NSObject <SQIPCardEntryViewControllerDelegate>

+ (void)completeCardEntry:(nonnull RCTResponseSenderBlock)onCardEntryComplete;

+ (void)setIOSCardEntryTheme:(nonnull NSDictionary *)theme;

+ (void)showCardNonceProcessingError:(nonnull NSString *)errorMessage;

+ (void)startCardEntryFlow:(BOOL)collectPostalCode
    onCardNonceRequestSuccess:
        (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
            onCardEntryCancel:(nonnull RCTResponseSenderBlock)onCardEntryCancel;

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
                          onCardEntryCancel:
                              (nonnull RCTResponseSenderBlock)onCardEntryCancel;

+ (void)startGiftCardEntryFlow:
            (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess
             onCardEntryCancel:
                 (nonnull RCTResponseSenderBlock)onCardEntryCancel;

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
                                                    onCardEntryCancel;

+ (void)updateOnCardNonceRequestSuccessCallback:
    (nonnull RCTResponseSenderBlock)onCardNonceRequestSuccess;

+ (void)startCardEntryFlowFromBuyerVerification;

+ (void)startGiftCardEntryFlowFromBuyerVerification;

+ (SQIPTheme *_Nonnull)theme;

@end
