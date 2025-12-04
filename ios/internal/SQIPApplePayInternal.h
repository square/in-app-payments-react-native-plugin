#import <Foundation/Foundation.h>
#import <PassKit/PassKit.h>
#import <React/RCTBridgeModule.h>

@interface SQIPApplePayInternal
    : NSObject <PKPaymentAuthorizationViewControllerDelegate>

+ (void)canUseApplePay:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject;

+ (void)completeApplePayAuthorization:(BOOL)isSuccess
                         errorMessage:(nonnull NSString *)errorMessage;

+ (void)initializeApplePay:(nonnull NSString *)applePayMerchantId;

+ (void)requestApplePayNonce:(nonnull NSString *)price
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
                           reject:(nonnull RCTPromiseRejectBlock)reject;

+ (void)
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
                                                  reject;

+ (void)requestApplePayNonceFromBuyerVerification;

@end
