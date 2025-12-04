#import <SquareBuyerVerificationSDK/SQIPBuyerAction.h>

@interface SQIPBuyerAction (RNSQIPAdditions)

+ (SQIPBuyerAction *)fromStringDictionary:(NSString *)buyerActionString
                                    money:(NSDictionary *)money;

@end
