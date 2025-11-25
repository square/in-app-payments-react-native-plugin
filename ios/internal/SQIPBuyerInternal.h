#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <SquareInAppPaymentsSDK/SQIPInAppPaymentsSDK.h>

@interface SQIPBuyerInternal : NSObject

+ (void)setMockBuyerVerificationSuccess:(BOOL)mockBuyerVerificationSuccess;

+ (void)startBuyerVerificationFlow:(nonnull NSString *)paymentSourceId
                        locationId:(nonnull NSString *)locationId
                       buyerAction:(nonnull NSString *)buyerAction
                             money:(nonnull NSDictionary *)money
                           contact:(nonnull NSDictionary *)contact
        onBuyerVerificationSuccess:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
        onBuyerVerificationFailure:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure;

+ (void)applyShouldContinueWithGiftCardEntry;

+ (void)applyShouldContinueWithCardEntry;

+ (void)applyShouldContinueWithApplePayEntry;

@end
