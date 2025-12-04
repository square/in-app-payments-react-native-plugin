#import "SQIPCoreInternal.h"
#import <SquareInAppPaymentsSDK/SQIPInAppPaymentsSDK.h>

@implementation SQIPCoreInternal

+ (void)setSquareApplicationId:(nonnull NSString *)applicationId {
  [SQIPInAppPaymentsSDK setSquareApplicationID:applicationId];
}

+ (NSString *_Nullable)getSquareApplicationId {
  return [SQIPInAppPaymentsSDK squareApplicationID];
}

@end
