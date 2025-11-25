#import "SQIPBuyerAction+RNSQIPAdditions.h"
#import "SQIPMoney+RNSQIPAdditions.h"

@implementation SQIPBuyerAction (RNSQIPAdditions)

+ (SQIPBuyerAction *)fromStringDictionary:(NSString *)buyerActionString
                                    money:(NSDictionary *)money {
  SQIPBuyerAction *buyerAction = nil;
  if ([@"Store" isEqualToString:buyerActionString]) {
    buyerAction = [SQIPBuyerAction storeAction];
  } else {
    buyerAction = [SQIPBuyerAction
        chargeActionWithMoney:[SQIPMoney fromDictionary:money]];
  }
  return buyerAction;
}

@end
