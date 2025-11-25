#import "SQIPBuyer.h"
#import "SQIPBuyerInternal.h"

@implementation SQIPBuyer

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSQIPBuyerSpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"SQIPBuyer";
}

- (void)setMockBuyerVerificationSuccess:(BOOL)mockBuyerVerificationSuccess {
  [SQIPBuyerInternal
      setMockBuyerVerificationSuccess:mockBuyerVerificationSuccess];
}

- (void)startBuyerVerificationFlow:(nonnull NSString *)paymentSourceId
                        locationId:(nonnull NSString *)locationId
                       buyerAction:(nonnull NSString *)buyerAction
                             money:(nonnull NSDictionary *)money
                           contact:(nonnull NSDictionary *)contact
        onBuyerVerificationSuccess:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationSuccess
        onBuyerVerificationFailure:
            (nonnull RCTResponseSenderBlock)onBuyerVerificationFailure {
  [SQIPBuyerInternal startBuyerVerificationFlow:paymentSourceId
                                     locationId:locationId
                                    buyerAction:buyerAction
                                          money:money
                                        contact:contact
                     onBuyerVerificationSuccess:onBuyerVerificationSuccess
                     onBuyerVerificationFailure:onBuyerVerificationFailure];
}

@end
