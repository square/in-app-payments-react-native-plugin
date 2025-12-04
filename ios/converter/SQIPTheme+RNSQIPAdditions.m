#import "SQIPTheme+RNSQIPAdditions.h"
#import "UIColor+RNSQIPAdditions.h"
#import "UIFont+RNSQIPAdditions.h"

@implementation SQIPTheme (RNSQIPAdditions)

+ (SQIPTheme *)fromDictionary:(NSDictionary *)theme {
  SQIPTheme *t = [[SQIPTheme alloc] init];
  if (theme[@"font"]) {
    t.font = [t.font fromJsonDictionary:theme[@"font"]];
  }
  if (theme[@"saveButtonFont"]) {
    t.saveButtonFont =
        [t.saveButtonFont fromJsonDictionary:theme[@"saveButtonFont"]];
  }
  if (theme[@"backgroundColor"]) {
    t.backgroundColor =
        [t.backgroundColor fromJsonDictionary:theme[@"backgroundColor"]];
  }
  if (theme[@"foregroundColor"]) {
    t.foregroundColor =
        [t.foregroundColor fromJsonDictionary:theme[@"foregroundColor"]];
  }
  if (theme[@"textColor"]) {
    t.textColor = [t.textColor fromJsonDictionary:theme[@"textColor"]];
  }
  if (theme[@"placeholderTextColor"]) {
    t.placeholderTextColor = [t.placeholderTextColor
        fromJsonDictionary:theme[@"placeholderTextColor"]];
  }
  if (theme[@"tintColor"]) {
    t.tintColor = [t.tintColor fromJsonDictionary:theme[@"tintColor"]];
  }
  if (theme[@"messageColor"]) {
    t.messageColor = [t.messageColor fromJsonDictionary:theme[@"messageColor"]];
  }
  if (theme[@"errorColor"]) {
    t.errorColor = [t.errorColor fromJsonDictionary:theme[@"errorColor"]];
  }
  if (theme[@"saveButtonTitle"]) {
    t.saveButtonTitle = theme[@"saveButtonTitle"];
  }
  if (theme[@"saveButtonTextColor"]) {
    t.saveButtonTextColor = [t.saveButtonTextColor
        fromJsonDictionary:theme[@"saveButtonTextColor"]];
  }
  if (theme[@"keyboardAppearance"]) {
    t.keyboardAppearance =
        [SQIPTheme _keyboardAppearanceFromString:theme[@"keyboardAppearance"]];
  }
  return t;
}

+ (UIKeyboardAppearance)_keyboardAppearanceFromString:
    (NSString *)keyboardTypeName {
  if ([keyboardTypeName isEqualToString:@"Dark"]) {
    return UIKeyboardAppearanceDark;
  } else if ([keyboardTypeName isEqualToString:@"Light"]) {
    return UIKeyboardAppearanceLight;
  } else {
    return UIKeyboardAppearanceDefault;
  }
}

@end
