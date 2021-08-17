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

#import "RNSQIPSecureRemoteCommerce.h"
#import "RNSQIPErrorUtilities.h"
#import "Converters/SQIPCard+RNSQIPAdditions.h"
#import "Converters/SQIPCardDetails+RNSQIPAdditions.h"
#import "Converters/UIFont+RNSQIPAdditions.h"
#import "Converters/UIColor+RNSQIPAdditions.h"

typedef void (^CompletionHandler)(NSError *_Nullable);


@interface RNSQIPSecureRemoteCommerce ()

@property (strong, readwrite) CompletionHandler completionHandler;
@property (strong, readwrite) SQIPCardDetails *cardDetails;

@end

static NSString *const RNSQIPOnMasterCardNonceRequestSuccessEventName = @"onMasterCardNonceRequestSuccess";
static NSString *const RNSQIPOnMasterCardNonceRequestFailureEventName = @"onMasterCardNonceRequestFailure";

@implementation RNSQIPSecureRemoteCommerce

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[ RNSQIPOnMasterCardNonceRequestSuccessEventName, RNSQIPOnMasterCardNonceRequestFailureEventName];
}

RCT_REMAP_METHOD(startSecureRemoteCommerce,
                 amount 
                 : (NSInteger)amount
                 startSecureRemoteCommerceWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async([self methodQueue], ^{
        SQIPSecureRemoteCommerceParameters params;
        params.amount = amount;

        UIViewController *rootViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
        
        [[SQIPSecureRemoteCommerce alloc]
        createPaymentRequest: rootViewController
        secureRemoteCommerceParameters: params
        completionHandler:^(SQIPCardDetails * _Nullable cardDetails, NSError * _Nullable error) {
        if(cardDetails != NULL){
            [self sendEventWithName:RNSQIPOnMasterCardNonceRequestSuccessEventName
                    body:cardDetails];
        }else if (error != NULL){
            NSString *debugCode = error.userInfo[SQIPErrorDebugCodeKey];
            NSString *debugMessage = error.userInfo[SQIPErrorDebugMessageKey];
            [self sendEventWithName:RNSQIPOnMasterCardNonceRequestFailureEventName
                body:[RNSQIPErrorUtilities callbackErrorObject:RNSQIPUsageError
                                    message:error.localizedDescription
                                    debugCode:debugCode
                                    debugMessage:debugMessage]];
        }
        }];
        resolve([NSNull null]);
    });
}

@end