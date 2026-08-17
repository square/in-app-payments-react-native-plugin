#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <SquareInAppPaymentsSDK/SQIPInAppPaymentsSDK.h>

@interface SQIPBuyerInternal : NSObject

+ (void)startBuyerVerificationFlow:(nonnull NSString *)paymentSourceId
                        locationId:(nonnull NSString *)locationId
                       buyerAction:(nonnull NSString *)buyerAction
                             money:(nonnull NSDictionary *)money
                           contact:(nonnull NSDictionary *)contact
        onBuyerVerificationSuccess:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
        onBuyerVerificationFailure:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure;

+ (void)prepareBuyerVerificationWithLocationId:(nonnull NSString *)locationId
                                   buyerAction:(nonnull NSString *)buyerAction
                                         money:(nonnull NSDictionary *)money
                                       contact:(nonnull NSDictionary *)contact
                    onBuyerVerificationSuccess:
                        (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
                    onBuyerVerificationFailure:
                        (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure;

+ (BOOL)isBuyerVerificationPrepared;

+ (void)setPreparedCardDetails:(nonnull NSDictionary *)cardDetails;

+ (BOOL)startPreparedBuyerVerification;

+ (void)clearPreparedBuyerVerification;

@end
