#import <Foundation/Foundation.h>

extern NSString *const RNSQIPUsageError;
extern NSInteger const RNSQIPCardEntryErrorCode;
extern NSInteger const RNSQIPApplePayErrorCode;
extern NSString *const RNSQIPApplePayNotInitialized;
extern NSString *const RNSQIPApplePayNotSupport;
extern NSString *const RNSQIPMessageApplePayNotInitialized;
extern NSString *const RNSQIPMessageApplePayNotSupported;

@interface ErrorUtilities : NSObject

+ (NSDictionary *)callbackErrorObject:(NSString *)code
                              message:(NSString *)message
                            debugCode:(NSString *)debugCode
                         debugMessage:(NSString *)debugMessage;

+ (NSString *)createNativeModuleError:(NSString *)nativeModuleErrorCode
                         debugMessage:(NSString *)debugMessage;

@end
