#import "SQIPCurrencyUtilities.h"
#import "SQIPMoney+RNSQIPAdditions.h"

@implementation SQIPMoney (RNSQIPAdditions)

+ (SQIPMoney *)fromDictionary:(NSDictionary *)money {
  SQIPMoney *m = [[SQIPMoney alloc]
      initWithAmount:[money[@"amount"] longValue]
            currency:[SQIPCurrencyUtilities
                         currencyFromString:money[@"currencyCode"]]];
  return m;
}

@end
