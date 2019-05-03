/*
 Copyright 2019 Square Inc.
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

#import "RNSQIPApplePay.h"
#import <React/RCTUtils.h>
#import "RNSQIPErrorUtilities.h"
#import "Converters/SQIPCardDetails+RNSQIPAdditions.h"

API_AVAILABLE(ios(11.0))
typedef void (^CompletionHandler)(PKPaymentAuthorizationResult *_Nonnull);


API_AVAILABLE(ios(11.0))
@interface RNSQIPApplePay ()

@property (strong, readwrite) NSString *applePayMerchantId;
@property (strong, readwrite) CompletionHandler completionHandler;

@end

// react native plugin debug error codes
static NSString *const RNSQIPApplePayNotInitialized = @"rn_apple_pay_not_initialized";
static NSString *const RNSQIPApplePayNotSupport = @"rn_apple_pay_not_supported";

// react native plugin debug messages
static NSString *const RNSQIPMessageApplePayNotInitialized = @"Apple Pay must be initialized with an Apple merchant ID.";
static NSString *const RNSQIPMessageApplePayNotSupported = @"This device does not have any supported Apple Pay cards. Please check `canUseApplePay` prior to requesting a nonce.";


@implementation RNSQIPApplePay

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[ @"onApplePayNonceRequestSuccess", @"onApplePayNonceRequestFailure", @"onApplePayComplete" ];
}

RCT_REMAP_METHOD(initializeApplePay,
                 merchantId
                 : (NSString *)merchantId
                     initializeApplePayWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async([self methodQueue], ^{
        self.applePayMerchantId = merchantId;
        resolve([NSNull null]);
    });
}

RCT_REMAP_METHOD(canUseApplePay,
                 canUseApplePayWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async([self methodQueue], ^{
        resolve(@(SQIPInAppPaymentsSDK.canUseApplePay));
    });
}

RCT_REMAP_METHOD(requestApplePayNonce,
                 price
                 : (NSString *)price
                    summaryLabel
                 : (NSString *)summaryLabel
                     countryCode
                 : (NSString *)countryCode
                     currencyCode
                 : (NSString *)currencyCode
                     paymentType
                 : (nonnull NSNumber *)paymentType
                     requestApplePayNonceWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    if (!self.applePayMerchantId) {
        reject(RNSQIPUsageError, [RNSQIPErrorUtilities createNativeModuleError:RNSQIPApplePayNotInitialized debugMessage:RNSQIPMessageApplePayNotInitialized], nil);
        return;
    }
    if (!SQIPInAppPaymentsSDK.canUseApplePay) {
        reject(RNSQIPUsageError, [RNSQIPErrorUtilities createNativeModuleError:RNSQIPApplePayNotSupport debugMessage:RNSQIPMessageApplePayNotSupported], nil);
        return;
    }
    PKPaymentRequest *paymentRequest =
        [PKPaymentRequest squarePaymentRequestWithMerchantIdentifier:self.applePayMerchantId
                                                         countryCode:countryCode
                                                        currencyCode:currencyCode];

    if ([paymentType integerValue] == 1) {
        paymentRequest.paymentSummaryItems = @[
            [PKPaymentSummaryItem summaryItemWithLabel:summaryLabel
                                                amount:[NSDecimalNumber decimalNumberWithString:price]
                                                type:PKPaymentSummaryItemTypePending]
        ];
    } else {
        paymentRequest.paymentSummaryItems = @[
            [PKPaymentSummaryItem summaryItemWithLabel:summaryLabel
                                                amount:[NSDecimalNumber decimalNumberWithString:price]
                                                  type:PKPaymentSummaryItemTypeFinal]
        ];
    }

    dispatch_async([self methodQueue], ^{
        PKPaymentAuthorizationViewController *paymentAuthorizationViewController =
            [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];

        paymentAuthorizationViewController.delegate = self;
        UIViewController *rootViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
        [rootViewController presentViewController:paymentAuthorizationViewController animated:NO completion:nil];
        resolve([NSNull null]);
    });
}

RCT_REMAP_METHOD(completeApplePayAuthorization,
                 isSuccess
                 : (BOOL)isSuccess
                     errorMessage
                 : (NSString *__nullable)errorMessage
                     completeApplePayAuthorizationWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async([self methodQueue], ^{
        if (self.completionHandler != nil) {
            if (isSuccess) {
                PKPaymentAuthorizationResult *authResult = [[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusSuccess errors:nil];
                self.completionHandler(authResult);
            } else {
                NSDictionary *userInfo = errorMessage == nil || errorMessage.length == 0 ? nil : @{NSLocalizedDescriptionKey : errorMessage};
                NSError *error = [NSError errorWithDomain:NSGlobalDomain
                                                     code:RNSQIPApplePayErrorCode
                                                 userInfo:userInfo];
                if (@available(iOS 11.0, *)) {
                    PKPaymentAuthorizationResult *authResult = [[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusFailure errors:@[ error ]];
                    self.completionHandler(authResult);
                } else {
                    // This should never happen as we require target to be 11.0 or above
                    NSAssert(false, @"No Apple Pay support for iOS 10 or below.");
                }
            }
            self.completionHandler = nil;
        }

        resolve([NSNull null]);
    });
}

#pragma mark - PKPaymentAuthorizationViewControllerDelegate
- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                   handler:(CompletionHandler)completion API_AVAILABLE(ios(11.0));
{
    SQIPApplePayNonceRequest *nonceRequest = [[SQIPApplePayNonceRequest alloc] initWithPayment:payment];
    self.completionHandler = completion;

    [nonceRequest performWithCompletionHandler:^(SQIPCardDetails *_Nullable result, NSError *_Nullable error) {
        if (error) {
            NSString *debugCode = error.userInfo[SQIPErrorDebugCodeKey];
            NSString *debugMessage = error.userInfo[SQIPErrorDebugMessageKey];
            [self sendEventWithName:@"onApplePayNonceRequestFailure" body:[RNSQIPErrorUtilities callbackErrorObject:RNSQIPUsageError
                                                                                                            message:error.localizedDescription
                                                                                                          debugCode:debugCode
                                                                                                       debugMessage:debugMessage]];
        } else {
            // if error is not nil, result must be valid
            [self sendEventWithName:@"onApplePayNonceRequestSuccess" body:[result jsonDictionary]];
        }
    }];
}

- (void)paymentAuthorizationViewControllerDidFinish:(nonnull PKPaymentAuthorizationViewController *)controller;
{
    UIViewController *rootViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
    if ([rootViewController isKindOfClass:[UINavigationController class]]) {
        [rootViewController.navigationController popViewControllerAnimated:YES];
    } else {
        [rootViewController dismissViewControllerAnimated:YES completion:nil];
    }
    [self sendEventWithName:@"onApplePayComplete" body:nil];
}

@end
