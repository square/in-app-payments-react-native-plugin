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

import android.app.Activity;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.wallet.AutoResolveHelper;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.PaymentData;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.TransactionInfo;
import com.google.android.gms.wallet.Wallet;
import java.util.Objects;
import sqip.Callback;
import sqip.GooglePay;
import sqip.GooglePayNonceResult;
import sqip.react.internal.ErrorHandlerUtils;
import sqip.react.internal.InAppPaymentsException;
import sqip.react.internal.converter.CardConverter;
import sqip.react.internal.converter.CardDetailsConverter;

class GooglePayModule extends ReactContextBaseJavaModule {

  // Android only sqip.react plugin errors and messages
  private static final String RN_GOOGLE_PAY_NOT_INITIALIZED = "rn_google_pay_not_initialized";
  private static final String RN_GOOGLE_PAY_RESULT_ERROR = "rn_google_pay_result_error";
  private static final String RN_GOOGLE_PAY_UNKNOWN_ERROR = "rn_google_pay_unknown_error";
  private static final String RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED = "Please initialize google pay before you can call other methods.";
  private static final String RN_MESSAGE_GOOGLE_PAY_RESULT_ERROR = "Failed to launch google pay, please make sure you configured google pay correctly.";
  private static final String RN_MESSAGE_GOOGLE_PAY_UNKNOWN_ERROR = "Unknown google pay activity result status.";

  private static final int LOAD_PAYMENT_DATA_REQUEST_CODE = 4111;

  private final ReactApplicationContext reactContext;
  private final CardDetailsConverter cardDetailsConverter;
  private final Handler mainLooperHandler;

  private DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter;
  private String squareLocationId;
  private PaymentsClient googlePayClients;

  public GooglePayModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    mainLooperHandler = new Handler(Looper.getMainLooper());
    cardDetailsConverter = new CardDetailsConverter(new CardConverter());

    reactContext.addActivityEventListener(new BaseActivityEventListener() {
      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == LOAD_PAYMENT_DATA_REQUEST_CODE) {
          switch (resultCode) {
            case Activity.RESULT_OK:
              PaymentData paymentData = PaymentData.getFromIntent(data);
              String googlePayToken = Objects.requireNonNull(
                  Objects.requireNonNull(paymentData).getPaymentMethodToken()).getToken();
              GooglePay.requestGooglePayNonce(googlePayToken).enqueue(
                  new Callback<GooglePayNonceResult>() {
                    @Override public void onResult(GooglePayNonceResult googlePayNonceResult) {
                      if (googlePayNonceResult.isSuccess()) {
                        getDeviceEventEmitter().emit("onGooglePayNonceRequestSuccess",
                            cardDetailsConverter.toMapObject(
                                googlePayNonceResult.getSuccessValue()));
                      } else if (googlePayNonceResult.isError()) {
                        GooglePayNonceResult.Error error = ((GooglePayNonceResult.Error) googlePayNonceResult);
                        getDeviceEventEmitter().emit("onGooglePayNonceRequestFailure",
                            ErrorHandlerUtils.getCallbackErrorObject(error.getCode().name(),
                                error.getMessage(), error.getDebugCode(), error.getDebugMessage()));
                      }
                    }
                  });
              break;
            case Activity.RESULT_CANCELED:
              getDeviceEventEmitter().emit("onGooglePayCanceled", null);
              break;
            case AutoResolveHelper.RESULT_ERROR:
              getDeviceEventEmitter().emit("onGooglePayNonceRequestFailure",
                  ErrorHandlerUtils.getCallbackErrorObject(ErrorHandlerUtils.USAGE_ERROR, ErrorHandlerUtils.getPluginErrorMessage(
                      RN_GOOGLE_PAY_RESULT_ERROR), RN_GOOGLE_PAY_RESULT_ERROR,
                      RN_MESSAGE_GOOGLE_PAY_RESULT_ERROR));
              break;
            default:
              getDeviceEventEmitter().emit("onGooglePayNonceRequestFailure",
                  ErrorHandlerUtils.getCallbackErrorObject(ErrorHandlerUtils.USAGE_ERROR, ErrorHandlerUtils.getPluginErrorMessage(
                      RN_GOOGLE_PAY_UNKNOWN_ERROR), RN_GOOGLE_PAY_UNKNOWN_ERROR,
                      RN_MESSAGE_GOOGLE_PAY_UNKNOWN_ERROR));
          }
        }
      }
    });
  }

  @Override
  public String getName() {
    return "RNSQIPGooglePay";
  }

  @ReactMethod
  public void initializeGooglePay(String squareLocationId, int environment, Promise promise) {
    this.squareLocationId = squareLocationId;
    googlePayClients = Wallet.getPaymentsClient(
        Objects.requireNonNull(getCurrentActivity()),
        (new Wallet.WalletOptions.Builder())
            .setEnvironment(environment)
            .build()
    );
    promise.resolve(null);
  }

  @ReactMethod
  public void canUseGooglePay(final Promise promise) {
    if (googlePayClients == null) {
      String errorJsonMessage = ErrorHandlerUtils.createNativeModuleError(
          RN_GOOGLE_PAY_NOT_INITIALIZED, RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED);
      promise.reject(ErrorHandlerUtils.USAGE_ERROR, new InAppPaymentsException(errorJsonMessage));
      return;
    }
    IsReadyToPayRequest isReadyToPayRequest = GooglePay.createIsReadyToPayRequest();
    googlePayClients.isReadyToPay(isReadyToPayRequest).addOnCompleteListener(new OnCompleteListener<Boolean>() {
      @Override
      public void onComplete(@NonNull Task<Boolean> task) {
        promise.resolve(task.isSuccessful());
      }
    });
  }

  @ReactMethod
  public void requestGooglePayNonce(final String price, final String currencyCode, final int priceStatus, final Promise promise) {
    if (googlePayClients == null) {
      String errorJsonMessage = ErrorHandlerUtils.createNativeModuleError(
          RN_GOOGLE_PAY_NOT_INITIALIZED, RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED);
      promise.reject(ErrorHandlerUtils.USAGE_ERROR, new InAppPaymentsException(errorJsonMessage));
      return;
    }

    mainLooperHandler.post(new Runnable() {
      @Override
      public void run() {
        AutoResolveHelper.resolveTask(
            googlePayClients.loadPaymentData(createPaymentChargeRequest(squareLocationId, price, currencyCode, priceStatus)),
            Objects.requireNonNull(getCurrentActivity()),
            LOAD_PAYMENT_DATA_REQUEST_CODE);
        promise.resolve(null);
      }
    });
  }

  private PaymentDataRequest createPaymentChargeRequest(String squareLocationId, String price, String currencyCode, int priceStatus) {
    TransactionInfo transactionInfo = TransactionInfo.newBuilder()
        .setTotalPriceStatus(priceStatus)
        .setTotalPrice(price)
        .setCurrencyCode(currencyCode).build();
    return GooglePay.createPaymentDataRequest(squareLocationId, transactionInfo);
  }

  private DeviceEventManagerModule.RCTDeviceEventEmitter getDeviceEventEmitter() {
    if (deviceEventEmitter == null) {
      deviceEventEmitter = reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }
    return deviceEventEmitter;
  }
}
