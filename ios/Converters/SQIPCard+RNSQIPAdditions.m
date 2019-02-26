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

#import "SQIPCard+RNSQIPAdditions.h"


@implementation SQIPCard (RNSQIPAdditions)

- (NSDictionary *)jsonDictionary
{
    return @{
        @"brand" : [self _stringForBrand:self.brand],
        @"lastFourDigits" : self.lastFourDigits,
        @"expirationMonth" : @(self.expirationMonth),
        @"expirationYear" : @(self.expirationYear),
        @"postalCode" : self.postalCode ?: [NSNull null],
        @"type" : [self _stringForCardType:self.type],
        @"prepaidType" : [self _stringForCardPrepaidType:self.prepaidType],
    };
}

#pragma mark - Private Methods
- (NSString *)_stringForBrand:(SQIPCardBrand)brand
{
    NSString *result = nil;
    switch (brand) {
        case SQIPCardBrandOtherBrand:
            result = @"OTHER_BRAND";
            break;
        case SQIPCardBrandVisa:
            result = @"VISA";
            break;
        case SQIPCardBrandMastercard:
            result = @"MASTERCARD";
            break;
        case SQIPCardBrandAmericanExpress:
            result = @"AMERICAN_EXPRESS";
            break;
        case SQIPCardBrandDiscover:
            result = @"DISCOVER";
            break;
        case SQIPCardBrandDiscoverDiners:
            result = @"DISCOVER_DINERS";
            break;
        case SQIPCardBrandJCB:
            result = @"JCB";
            break;
        case SQIPCardBrandChinaUnionPay:
            result = @"CHINA_UNION_PAY";
            break;
    }
    return result;
}

- (NSString *)_stringForCardType:(SQIPCardType)cardType
{
    NSString *result = nil;
    switch (cardType) {
        case SQIPCardTypeDebit:
            result = @"DEBIT";
            break;
        case SQIPCardTypeCredit:
            result = @"CREDIT";
            break;
        case SQIPCardTypeUnknown:
            result = @"UNKNOWN";
            break;
    }
    return result;
}

- (NSString *)_stringForCardPrepaidType:(SQIPCardPrepaidType)cardPrepaidType
{
    NSString *result = nil;
    switch (cardPrepaidType) {
        case SQIPCardPrepaidTypePrepaid:
            result = @"PREPAID";
            break;
        case SQIPCardPrepaidTypeNotPrepaid:
            result = @"NOT_PREPAID";
            break;
        case SQIPCardPrepaidTypeUnknown:
            result = @"UNKNOWN";
            break;
    }
    return result;
}

@end
