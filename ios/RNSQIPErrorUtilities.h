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

#if __has_include(<Foundation/Foundation.h>)
#import <Foundation/Foundation.h>
#else
#import "Foundation.h"
#endif

extern NSString *const RNSQIPUsageError;
extern NSInteger const RNSQIPCardEntryErrorCode;
extern NSInteger const RNSQIPApplePayErrorCode;


@interface RNSQIPErrorUtilities : NSObject

+ (NSDictionary *)callbackErrorObject:(NSString *)code message:(NSString *)message debugCode:(NSString *)debugCode debugMessage:(NSString *)debugMessage;
+ (NSString *)createNativeModuleError:(NSString *)nativeModuleErrorCode debugMessage:(NSString *)debugMessage;

@end
