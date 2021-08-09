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
import android.os.Handler;
import android.os.Looper;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Objects;
import sqip.react.internal.converter.CardConverter;
import sqip.react.internal.converter.CardDetailsConverter;
import sqip.react.internal.ErrorHandlerUtils;
import sqip.SecureRemoteCommerce;
import sqip.SecureRemoteCommerceParameters;

class SecureRemoteCommerceModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private final Handler mainLooperHandler;
  private final CardDetailsConverter cardDetailsConverter;
  private DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter;

  public SecureRemoteCommerceModule(final ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    mainLooperHandler = new Handler(Looper.getMainLooper());
    cardDetailsConverter = new CardDetailsConverter(new CardConverter());

    reactContext.addActivityEventListener(new BaseActivityEventListener() {
      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == SecureRemoteCommerce.DEFAULT_SECURE_REMOTE_COMMERCE_REQUEST_CODE) {
          SecureRemoteCommerce.handleActivityResult(data, result -> {
            if (result.isSuccess()) {
                WritableMap mapToReturn = cardDetailsConverter.toMapObject(result.getSuccessValue());
                getDeviceEventEmitter().emit("onMasterCardNonceRequestSuccess", mapToReturn);
            } else if (result.isError()) {
              sqip.SecureRemoteCommerceNonceResult.Error error = result.getErrorValue();
              WritableMap errorMap =
                ErrorHandlerUtils.getCallbackErrorObject(error.getCode().name(), error.getMessage(), error.getDebugCode(),
                  error.getDebugMessage());
              getDeviceEventEmitter().emit("onMasterCardNonceRequestFailure", errorMap);
            }
          });
        }
      }
    });
  }

  @Override
  public String getName() {
    return "RNSQIPSecureRemoteCommerce";
  }

  @ReactMethod
  public void startSecureRemoteCommerce(final int amount, final Promise promise) {
    mainLooperHandler.post(new Runnable() {
      @Override
      public void run() {
        SecureRemoteCommerceParameters params = new SecureRemoteCommerceParameters(amount);  
        SecureRemoteCommerce.createPaymentDataRequest(Objects.requireNonNull(getCurrentActivity()), params);
        promise.resolve(null);
      }
    });
  }

  private DeviceEventManagerModule.RCTDeviceEventEmitter getDeviceEventEmitter() {
    if (deviceEventEmitter == null) {
      deviceEventEmitter = reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }
    return deviceEventEmitter;
  }
}
