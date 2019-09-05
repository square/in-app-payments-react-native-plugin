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
package sqip.react;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.os.Handler;
import android.os.Looper;
import android.view.animation.Animation;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;
import androidx.annotation.NonNull;
import sqip.Callback;
import sqip.CardDetails;
import sqip.CardEntry;
import sqip.CardEntryActivityCommand;
import sqip.CardEntryActivityResult;
import sqip.CardNonceBackgroundHandler;
import sqip.react.internal.converter.CardConverter;
import sqip.react.internal.converter.CardDetailsConverter;

import static android.view.animation.AnimationUtils.loadAnimation;

class CardEntryModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private final Handler mainLooperHandler;
  private final CardDetailsConverter cardDetailsConverter;
  private final AtomicReference<CardEntryActivityCommand> reference;
  private volatile CountDownLatch countDownLatch;
  private DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter;

  public CardEntryModule(final ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    mainLooperHandler = new Handler(Looper.getMainLooper());
    cardDetailsConverter = new CardDetailsConverter(new CardConverter());
    reference = new AtomicReference<>();

    reactContext.addActivityEventListener(new BaseActivityEventListener() {
      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        CardEntry.handleActivityResult(data, new Callback<CardEntryActivityResult>() {
          @Override public void onResult(final CardEntryActivityResult cardEntryActivityResult) {
            // React Native UI doesn't know the context of fade_out animation
            // so that the next action from react native can be triggered too soon before
            // card entry activity is closed completely.
            // So this is a workaround to delay the callback until animation finished.
            long delayDurationMs = readCardEntryCloseExitAnimationDurationMs();
            mainLooperHandler.postDelayed(new Runnable() {
              @Override
              public void run() {
                if (cardEntryActivityResult.isCanceled()) {
                  getDeviceEventEmitter().emit("cardEntryCancel", null);
                } else if (cardEntryActivityResult.isSuccess()) {
                  getDeviceEventEmitter().emit("cardEntryComplete", null);
                }
              }
            }, delayDurationMs);
          }
        });
      }
    });

    CardEntry.setCardNonceBackgroundHandler(new CardNonceBackgroundHandler() {
      @NonNull @Override
      public CardEntryActivityCommand handleEnteredCardInBackground(CardDetails cardDetails) {
        WritableMap mapToReturn = cardDetailsConverter.toMapObject(cardDetails);
        countDownLatch = new CountDownLatch(1);
        getDeviceEventEmitter().emit("cardEntryDidObtainCardDetails", mapToReturn);
        try {
          // completeCardEntry or showCardNonceProcessingError must be called,
          // otherwise the thread will be leaked.
          countDownLatch.await();
        } catch (InterruptedException e) {
          throw new RuntimeException(e);
        }

        return reference.get();
      }
    });
  }

  @Override
  public String getName() {
    return "RNSQIPCardEntry";
  }

  @ReactMethod
  public void startCardEntryFlow(final Boolean collectPostalCode, final Promise promise) {
    mainLooperHandler.post(new Runnable() {
      @Override
      public void run() {
        CardEntry.startCardEntryActivity(Objects.requireNonNull(getCurrentActivity()), collectPostalCode);
        promise.resolve(null);
      }
    });
  }

  @ReactMethod
  public void completeCardEntry(Promise promise) {
    reference.set(new CardEntryActivityCommand.Finish());
    countDownLatch.countDown();
    promise.resolve(null);
  }

  @ReactMethod
  public void showCardNonceProcessingError(String errorMessage, Promise promise) {
    reference.set(new CardEntryActivityCommand.ShowError(errorMessage));
    countDownLatch.countDown();
    promise.resolve(null);
  }

  private long readCardEntryCloseExitAnimationDurationMs() {
    long delayDurationMs = 0;
    Resources.Theme theme = Objects.requireNonNull(getCurrentActivity()).getResources().newTheme();
    theme.applyStyle(R.style.sqip_Theme_CardEntry, true);
    int[] attrs = { android.R.attr.activityCloseExitAnimation };
    TypedArray typedArray = theme.obtainStyledAttributes(null, attrs, android.R.attr.windowAnimationStyle, 0);
    int resId = typedArray.getResourceId(0, -1);
    if (resId != -1) {
      try {
        Animation animation = loadAnimation(getCurrentActivity(), resId);
        delayDurationMs = animation.getDuration();
      } catch (Resources.NotFoundException ignored) {
      }
    }
    typedArray.recycle();
    return delayDurationMs;
  }

  private DeviceEventManagerModule.RCTDeviceEventEmitter getDeviceEventEmitter() {
    if (deviceEventEmitter == null) {
      deviceEventEmitter = reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }
    return deviceEventEmitter;
  }
}
