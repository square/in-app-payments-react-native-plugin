#import "SQIPGooglePay.h"

// This module is implemented here to avoid
// getEnforcing error from TurboModuleRegistry.getEnforcing

@implementation SQIPGooglePay

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSQIPGooglePaySpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"SQIPGooglePay";
}

- (void)canUseGooglePay:(nonnull RCTPromiseResolveBlock)resolve
                 reject:(nonnull RCTPromiseRejectBlock)reject {
  resolve(@NO);
}

- (void)initializeGooglePay:(nonnull NSString *)squareLocationId
                environment:(double)environment {
}

- (void)requestGooglePayNonce:(nonnull NSDictionary *)googlePayConfig
    onGooglePayNonceRequestSuccess:
        (nonnull RCTResponseSenderBlock)onGooglePayNonceRequestSuccess
    onGooglePayNonceRequestFailure:
        (nonnull RCTResponseSenderBlock)onGooglePayNonceRequestFailure
               onGooglePayCanceled:
                   (nonnull RCTResponseSenderBlock)onGooglePayCanceled
                           resolve:(nonnull RCTPromiseResolveBlock)resolve
                            reject:(nonnull RCTPromiseRejectBlock)reject {
  resolve([NSNull null]);
}

- (void)
    requestGooglePayNonceWithBuyerVerification:
        (nonnull NSDictionary *)googlePayConfig
                               paymentSourceId:
                                   (nonnull NSString *)paymentSourceId
                                    locationId:(nonnull NSString *)locationId
                                   buyerAction:(nonnull NSString *)buyerAction
                                         money:(nonnull NSDictionary *)money
                                       contact:(nonnull NSDictionary *)contact
                    onBuyerVerificationSuccess:(nonnull RCTResponseSenderBlock)
                                                   onBuyerVerificationSuccess
                    onBuyerVerificationFailure:(nonnull RCTResponseSenderBlock)
                                                   onBuyerVerificationFailure
                onGooglePayNonceRequestSuccess:
                    (nonnull RCTResponseSenderBlock)
                        onGooglePayNonceRequestSuccess
                onGooglePayNonceRequestFailure:
                    (nonnull RCTResponseSenderBlock)
                        onGooglePayNonceRequestFailure
                           onGooglePayCanceled:(nonnull RCTResponseSenderBlock)
                                                   onGooglePayCanceled
                                       resolve:(nonnull RCTPromiseResolveBlock)
                                                   resolve
                                        reject:(nonnull RCTPromiseRejectBlock)
                                                   reject {
  resolve([NSNull null]);
}

@end
