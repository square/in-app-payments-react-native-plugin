/*
 Copyright 2022 Square Inc.
 
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
#import "RNSQIPBuyerVerification.h"
#import "Converters/SQIPCard+RNSQIPAdditions.h"
#import "Converters/SQIPCardDetails+RNSQIPAdditions.h"
#import "Converters/UIFont+RNSQIPAdditions.h"
#import "Converters/UIColor+RNSQIPAdditions.h"

API_AVAILABLE(ios(11.0))
typedef void (^CompletionHandler)(PKPaymentAuthorizationResult *_Nonnull);


API_AVAILABLE(ios(11.0))
@interface RNSQIPApplePay ()

@property (strong, readwrite) SQIPTheme *theme;
@property (strong, readwrite) NSString *applePayMerchantId;
@property (strong, readwrite) CompletionHandler completionHandler;

@end

static NSString *const RNSQIPOnBuyerVerificationSuccessEventName = @"onBuyerVerificationSuccessFromApplePay";
static NSString *const RNSQIPOnBuyerVerificationErrorEventName = @"onBuyerVerificationErrorFromApplePay";

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
    return @[ 
        @"onApplePayNonceRequestSuccess", 
        @"onApplePayNonceRequestFailure", 
        @"onApplePayComplete",
        RNSQIPOnBuyerVerificationSuccessEventName,
        RNSQIPOnBuyerVerificationErrorEventName
        ];
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

RCT_REMAP_METHOD(requestApplePayNonceWithVerification,
                    paymentSourceId
                 : (NSString *)paymentSourceId
                    locationId
                 : (NSString *)locationId
                    buyerActionString
                 : (NSString *)buyerActionString
                    moneyMap
                 : (NSDictionary *)moneyMap
                    contactMap
                 : (NSDictionary *)contactMap
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
    dispatch_async([self methodQueue], ^{
        SQIPMoney *money = [self _getMoney:moneyMap];
        SQIPBuyerAction *buyerAction = [self _getBuyerAction:buyerActionString money:money];
        SQIPContact *contact = [self _getContact:contactMap];

        UIViewController *rootViewController = UIApplication.sharedApplication.keyWindow.rootViewController;

        SQIPVerificationParameters *params = [[SQIPVerificationParameters alloc] initWithPaymentSourceID:paymentSourceId
                                                buyerAction:buyerAction
                                                locationID:locationId
                                                contact:contact];

        if ([rootViewController isKindOfClass:[UINavigationController class]]) {
            [rootViewController.navigationController popViewControllerAnimated:YES];
        } else {
            [rootViewController dismissViewControllerAnimated:YES completion:nil];
        }
        
        if (self.theme == nil) {
            self.theme = [[SQIPTheme alloc] init];
        }
        [SQIPBuyerVerificationSDK.shared verifyWithParameters:params
            theme:self.theme
            viewController:rootViewController
            success:^(SQIPBuyerVerifiedDetails *_Nonnull verifiedDetails) {
                NSDictionary *verificationResult =
                    @{
                        @"nonce" : paymentSourceId,
                        @"token" : verifiedDetails.verificationToken
                    };

                [self sendEventWithName:RNSQIPOnBuyerVerificationSuccessEventName
                    body:verificationResult];

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
                PKPaymentAuthorizationViewController *paymentAuthorizationViewController =
                    [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
                paymentAuthorizationViewController.delegate = self;
                UIViewController *rootViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
                [rootViewController presentViewController:paymentAuthorizationViewController animated:NO completion:nil];   
            }
            failure:^(NSError *_Nonnull error) {
                NSString *debugCode = error.userInfo[SQIPErrorDebugCodeKey];
                NSString *debugMessage = error.userInfo[SQIPErrorDebugMessageKey];
                [self sendEventWithName:RNSQIPOnBuyerVerificationErrorEventName
                    body:[RNSQIPErrorUtilities callbackErrorObject:RNSQIPUsageError
                                    message:error.localizedDescription
                                    debugCode:debugCode
                                    debugMessage:debugMessage]];
            }];
        resolve([NSNull null]);
    });
}

RCT_REMAP_METHOD(setTheme,
                 theme
                 : (NSDictionary *)theme
                     setThemeWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async([self methodQueue], ^{
        // Create a new theme with default value
        self.theme = [[SQIPTheme alloc] init];
        if (theme[@"font"]) {
            self.theme.font = [self.theme.font fromJsonDictionary:theme[@"font"]];
        }
        if (theme[@"saveButtonFont"]) {
            self.theme.saveButtonFont = [self.theme.saveButtonFont fromJsonDictionary:theme[@"saveButtonFont"]];
        }
        if (theme[@"backgroundColor"]) {
            self.theme.backgroundColor = [self.theme.backgroundColor fromJsonDictionary:theme[@"backgroundColor"]];
        }
        if (theme[@"foregroundColor"]) {
            self.theme.foregroundColor = [self.theme.foregroundColor fromJsonDictionary:theme[@"foregroundColor"]];
        }
        if (theme[@"textColor"]) {
            self.theme.textColor = [self.theme.textColor fromJsonDictionary:theme[@"textColor"]];
        }
        if (theme[@"placeholderTextColor"]) {
            self.theme.placeholderTextColor = [self.theme.placeholderTextColor fromJsonDictionary:theme[@"placeholderTextColor"]];
        }
        if (theme[@"tintColor"]) {
            self.theme.tintColor = [self.theme.tintColor fromJsonDictionary:theme[@"tintColor"]];
        }
        if (theme[@"messageColor"]) {
            self.theme.messageColor = [self.theme.messageColor fromJsonDictionary:theme[@"messageColor"]];
        }
        if (theme[@"errorColor"]) {
            self.theme.errorColor = [self.theme.errorColor fromJsonDictionary:theme[@"errorColor"]];
        }
        if (theme[@"saveButtonTitle"]) {
            self.theme.saveButtonTitle = theme[@"saveButtonTitle"];
        }
        if (theme[@"saveButtonTextColor"]) {
            self.theme.saveButtonTextColor = [self.theme.saveButtonTextColor fromJsonDictionary:theme[@"saveButtonTextColor"]];
        }
        if (theme[@"keyboardAppearance"]) {
            self.theme.keyboardAppearance = [self _keyboardAppearanceFromString:theme[@"keyboardAppearance"]];
        }
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

#pragma mark - Private Methods

- (UIKeyboardAppearance)_keyboardAppearanceFromString:(NSString *)keyboardTypeName
{
    if ([keyboardTypeName isEqualToString:@"Dark"]) {
        return UIKeyboardAppearanceDark;
    } else if ([keyboardTypeName isEqualToString:@"Light"]) {
        return UIKeyboardAppearanceLight;
    } else {
        return UIKeyboardAppearanceDefault;
    }
}

- (SQIPMoney *)_getMoney:(NSDictionary *)moneyMap {
    SQIPMoney *money = [[SQIPMoney alloc] initWithAmount:[moneyMap[@"amount"] longValue]
                            currency:[RNSQIPBuyerVerification currencyForCurrencyCode:moneyMap[@"currencyCode"]]];
    return money;
}

- (SQIPBuyerAction *)_getBuyerAction:(NSString *)buyerActionString money:(SQIPMoney *)money {
    SQIPBuyerAction *buyerAction = nil;
    if ([@"Store" isEqualToString:buyerActionString]) {
        buyerAction = [SQIPBuyerAction storeAction];
    } else {
        buyerAction = [SQIPBuyerAction chargeActionWithMoney:money];
    }
    return buyerAction;
}

- (SQIPContact *)_getContact:(NSDictionary *)contactMap {
    SQIPContact *contact = [[SQIPContact alloc] init];
    contact.givenName = contactMap[@"givenName"];

    if (![contactMap[@"familyName"] isEqual:[NSNull null]]) {
        contact.familyName = contactMap[@"familyName"];
    }

    if (![contactMap[@"email"] isEqual:[NSNull null]]) {
        contact.email = contactMap[@"email"];
    }

    if (![contactMap[@"addressLines"] isEqual:[NSNull null]]) {
        contact.addressLines = contactMap[@"addressLines"];
        NSLog(@"%@", contactMap[@"addressLines"]);
    }

    if (![contactMap[@"city"] isEqual:[NSNull null]]) {
        contact.city = contactMap[@"city"];
    }

    if (![contactMap[@"region"] isEqual:[NSNull null]]) {
        contact.region = contactMap[@"region"];
    }

    if (![contactMap[@"postalCode"] isEqual:[NSNull null]]) {
        contact.postalCode = contactMap[@"postalCode"];
    }

    contact.country = [RNSQIPBuyerVerification countryForCountryCode:contactMap[@"countryCode"]];

    if (![contactMap[@"phone"] isEqual:[NSNull null]]) {
        contact.phone = contactMap[@"phone"];
    }

    return contact;
}


@end
