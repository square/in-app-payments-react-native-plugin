#import "UiUtilities.h"

@implementation UiUtilities

+ (UIViewController *)activeRootViewController {
  UIViewController *presentingViewController = [UiUtilities internal];
  while (presentingViewController.presentedViewController != nil) {
    presentingViewController =
        presentingViewController.presentedViewController;
  }
  return presentingViewController;
}

+ (UIViewController *) internal {
  // Prefer a scene-aware lookup on iOS 13+
  if (@available(iOS 13.0, *)) {
    NSSet<UIScene *> *connectedScenes =
        UIApplication.sharedApplication.connectedScenes;
    for (UIScene *scene in connectedScenes) {
      if (scene.activationState == UISceneActivationStateForegroundActive &&
          [scene isKindOfClass:[UIWindowScene class]]) {
        UIWindowScene *windowScene = (UIWindowScene *)scene;

        // Try key window first
        for (UIWindow *window in windowScene.windows) {
          if (window.isKeyWindow) {
            return window.rootViewController
                       ?: UIApplication.sharedApplication.delegate.window
                              .rootViewController;
          }
        }

        // Fallback: any normal-level visible window
        for (UIWindow *window in windowScene.windows) {
          if (!window.hidden && window.windowLevel == UIWindowLevelNormal) {
            return window.rootViewController
                       ?: UIApplication.sharedApplication.delegate.window
                              .rootViewController;
          }
        }
      }
    }

    // Ultimate fallback on iOS 13+: try any window’s rootViewController
    for (UIScene *scene in connectedScenes) {
      if ([scene isKindOfClass:[UIWindowScene class]]) {
        UIWindowScene *windowScene = (UIWindowScene *)scene;
        if (windowScene.windows.count > 0) {
          UIWindow *window = windowScene.windows.firstObject;
          if (window.rootViewController) {
            return window.rootViewController;
          }
        }
      }
    }
  }

  // Pre‑iOS 13 or last resort
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
  UIWindow *keyWindow = UIApplication.sharedApplication.keyWindow;
#pragma clang diagnostic pop
  if (keyWindow.rootViewController) {
    return keyWindow.rootViewController;
  }

  // As a final fallback, try the app delegate's window if available
  if ([UIApplication sharedApplication].delegate &&
      [[UIApplication sharedApplication].delegate
          respondsToSelector:@selector(window)]) {
    UIWindow *delegateWindow =
        [[UIApplication sharedApplication] delegate].window;
    if (delegateWindow.rootViewController) {
      return delegateWindow.rootViewController;
    }
  }

  return nil;
}

@end
