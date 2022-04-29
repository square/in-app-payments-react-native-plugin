/*
 Copyright 2022 Square Inc.

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

import android.os.Handler;
import android.os.Looper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import sqip.InAppPaymentsSdk;

class SquareInAppPaymentsModule extends ReactContextBaseJavaModule {

  private final Handler mainLooperHandler;

  public SquareInAppPaymentsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mainLooperHandler = new Handler(Looper.getMainLooper());
  }

  @Override
  public String getName() {
    return "RNSquareInAppPayments";
  }

  @ReactMethod
  public void setApplicationId(final String applicationId, final Promise promise) {
    mainLooperHandler.post(new Runnable() {
      @Override
      public void run() {
        InAppPaymentsSdk.setSquareApplicationId(applicationId);
        promise.resolve(null);
      }
    });
  }
}
