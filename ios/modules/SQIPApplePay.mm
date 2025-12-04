#import "SQIPApplePay.h"
#import "SQIPApplePayInternal.h"

@implementation SQIPApplePay

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSQIPApplePaySpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"SQIPApplePay";
}

- (void)canUseApplePay:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject {
  [SQIPApplePayInternal canUseApplePay:resolve reject:reject];
}

- (void)completeApplePayAuthorization:(BOOL)isSuccess
                         errorMessage:(nonnull NSString *)errorMessage {
  [SQIPApplePayInternal completeApplePayAuthorization:isSuccess
                                         errorMessage:errorMessage];
}

- (void)initializeApplePay:(nonnull NSString *)applePayMerchantId {
  [SQIPApplePayInternal initializeApplePay:applePayMerchantId];
}

- (void)requestApplePayNonce:(nonnull NSString *)price
                     summaryLabel:(nonnull NSString *)summaryLabel
                      countryCode:(nonnull NSString *)countryCode
                     currencyCode:(nonnull NSString *)currencyCode
                      paymentType:(double)paymentType
    onApplePayNonceRequestSuccess:
        (nonnull RCTResponseSenderBlock)onApplePayNonceRequestSuccess
    onApplePayNonceRequestFailure:
        (nonnull RCTResponseSenderBlock)onApplePayNonceRequestFailure
               onApplePayComplete:
                   (nonnull RCTResponseSenderBlock)onApplePayComplete
                          resolve:(nonnull RCTPromiseResolveBlock)resolve
                           reject:(nonnull RCTPromiseRejectBlock)reject {
  [SQIPApplePayInternal requestApplePayNonce:price
                                summaryLabel:summaryLabel
                                 countryCode:countryCode
                                currencyCode:currencyCode
                                 paymentType:paymentType
               onApplePayNonceRequestSuccess:onApplePayNonceRequestSuccess
               onApplePayNonceRequestFailure:onApplePayNonceRequestFailure
                          onApplePayComplete:onApplePayComplete
                                     resolve:resolve
                                      reject:reject];
}

- (void)
    requestApplePayNonceWithBuyerVerification:(nonnull NSString *)price
                                 summaryLabel:(nonnull NSString *)summaryLabel
                                  countryCode:(nonnull NSString *)countryCode
                                 currencyCode:(nonnull NSString *)currencyCode
                                  paymentType:(double)paymentType
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
                onApplePayNonceRequestSuccess:(nonnull RCTResponseSenderBlock)
                                                  onApplePayNonceRequestSuccess
                onApplePayNonceRequestFailure:(nonnull RCTResponseSenderBlock)
                                                  onApplePayNonceRequestFailure
                           onApplePayComplete:(nonnull RCTResponseSenderBlock)
                                                  onApplePayComplete
                                      resolve:(nonnull RCTPromiseResolveBlock)
                                                  resolve
                                       reject:(nonnull RCTPromiseRejectBlock)
                                                  reject {
  [SQIPApplePayInternal
      requestApplePayNonceWithBuyerVerification:price
                                   summaryLabel:summaryLabel
                                    countryCode:countryCode
                                   currencyCode:currencyCode
                                    paymentType:paymentType
                                paymentSourceId:paymentSourceId
                                     locationId:locationId
                                    buyerAction:buyerAction
                                          money:money
                                        contact:contact
                     onBuyerVerificationSuccess:onBuyerVerificationSuccess
                     onBuyerVerificationFailure:onBuyerVerificationFailure
                  onApplePayNonceRequestSuccess:onApplePayNonceRequestSuccess
                  onApplePayNonceRequestFailure:onApplePayNonceRequestFailure
                             onApplePayComplete:onApplePayComplete
                                        resolve:resolve
                                         reject:reject];
}

@end
