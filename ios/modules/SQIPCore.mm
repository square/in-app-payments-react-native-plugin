#import "SQIPCore.h"
#import "SQIPCoreInternal.h"

@implementation SQIPCore

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSQIPCoreSpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"SQIPCore";
}

- (NSString *_Nullable)getSquareApplicationId {
  return [SQIPCoreInternal getSquareApplicationId];
}

- (void)setSquareApplicationId:(nonnull NSString *)applicationId {
  [SQIPCoreInternal setSquareApplicationId:applicationId];
}

@end
