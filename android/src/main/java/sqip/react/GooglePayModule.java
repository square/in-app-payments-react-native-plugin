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
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.view.animation.Animation;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
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
import java.util.ArrayList;
import sqip.Callback;
import sqip.BuyerAction;
import sqip.BuyerVerification;
import sqip.Contact;
import sqip.Country;
import sqip.GooglePay;
import sqip.GooglePayNonceResult;
import sqip.Money;
import sqip.SquareIdentifier;
import sqip.VerificationParameters;
import sqip.react.internal.ErrorHandlerUtils;
import sqip.react.internal.InAppPaymentsException;
import sqip.react.internal.converter.CardConverter;
import sqip.react.internal.converter.CardDetailsConverter;

import static android.view.animation.AnimationUtils.loadAnimation;

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

  private String paymentSourceId;
  private SquareIdentifier squareIdentifier;
  private BuyerAction buyerAction;
  private Contact contact;
  private String price;
  private String currencyCode;
  private int priceStatus;

  private boolean shouldListen = false;
  private boolean shouldContinueWithGooglePayNonceRequest = false;

  public GooglePayModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    mainLooperHandler = new Handler(Looper.getMainLooper());
    cardDetailsConverter = new CardDetailsConverter(new CardConverter());

    this.shouldContinueWithGooglePayNonceRequest = false;
    this.shouldListen = false;

    reactContext.addActivityEventListener(new BaseActivityEventListener() {
      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (!GooglePayModule.this.shouldListen) return;
        GooglePayModule.this.shouldListen = false;
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
        if (requestCode == BuyerVerification.DEFAULT_BUYER_VERIFICATION_REQUEST_CODE) {
          BuyerVerification.handleActivityResult(data, result -> {
            if (result.isSuccess()) {
              if(GooglePayModule.this.paymentSourceId != null) {
                WritableMap mapToReturn = new WritableNativeMap();
                mapToReturn.putString("nonce", GooglePayModule.this.paymentSourceId);
                mapToReturn.putString("token", result.getSuccessValue().getVerificationToken());
                mainLooperHandler.post(new Runnable() {
                  @Override
                  public void run() {
                    getDeviceEventEmitter().emit("onBuyerVerificationSuccessFromGooglePay", mapToReturn);
                  }
                });
              }
              if(GooglePayModule.this.shouldContinueWithGooglePayNonceRequest) {
                GooglePayModule.this.shouldContinueWithGooglePayNonceRequest = false;
                mainLooperHandler.post(new Runnable() {
                  @Override
                  public void run() {
                    AutoResolveHelper.resolveTask(
                      googlePayClients.loadPaymentData(
                        createPaymentChargeRequest(
                          GooglePayModule.this.squareLocationId, 
                          GooglePayModule.this.price, 
                          GooglePayModule.this.currencyCode, 
                          GooglePayModule.this.priceStatus)),
                      Objects.requireNonNull(getCurrentActivity()),
                      LOAD_PAYMENT_DATA_REQUEST_CODE);
                  }
                });
              }
            } else if (result.isError()) {
              GooglePayModule.this.shouldContinueWithGooglePayNonceRequest = false;
              sqip.BuyerVerificationResult.Error error = result.getErrorValue();
              WritableMap errorMap =
                ErrorHandlerUtils.getCallbackErrorObject(error.getCode().name(), error.getMessage(), error.getDebugCode(),
                  error.getDebugMessage());
              mainLooperHandler.post(new Runnable() {
                @Override
                  public void run() {
                    getDeviceEventEmitter().emit("onBuyerVerificationErrorFromGooglePay", errorMap);
                  }
                });
            }
          });

          GooglePayModule.this.contact = null;
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
    shouldListen = true;
    this.shouldContinueWithGooglePayNonceRequest = false;

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

  @ReactMethod
  public void requestGooglePayNonceWithVerification(
    final String paymentSourceId,
    final String locationId,
    final String buyerActionString,
    final ReadableMap moneyMap,
    final ReadableMap contactMap,
    final String price,
    final String currencyCode,
    final int priceStatus,
    final Promise promise) {

    if (googlePayClients == null) {
      String errorJsonMessage = ErrorHandlerUtils.createNativeModuleError(
          RN_GOOGLE_PAY_NOT_INITIALIZED, RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED);
      promise.reject(ErrorHandlerUtils.USAGE_ERROR, new InAppPaymentsException(errorJsonMessage));
      return;
    }

    Money money = getMoney(moneyMap);
    BuyerAction buyerAction = getBuyerAction(buyerActionString, money);
    Contact contact = getContact(contactMap);                                        
    SquareIdentifier squareIdentifier = new SquareIdentifier.LocationToken(locationId);

    this.paymentSourceId = paymentSourceId;
    this.squareIdentifier = squareIdentifier;
    this.buyerAction = buyerAction;
    this.contact = contact;
    this.price = price;
    this.currencyCode = currencyCode;
    this.priceStatus = priceStatus;

    shouldListen = true;
    this.shouldContinueWithGooglePayNonceRequest = true;

    VerificationParameters verificationParameters =
    new VerificationParameters(
      GooglePayModule.this.paymentSourceId, 
      GooglePayModule.this.buyerAction, 
      GooglePayModule.this.squareIdentifier,
      GooglePayModule.this.contact);

    mainLooperHandler.post(new Runnable() {
      @Override
      public void run() {
        BuyerVerification.verify(Objects.requireNonNull(getCurrentActivity()), verificationParameters);
      }
    });
    promise.resolve(null);
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

  private Contact getContact(final ReadableMap contactMap) {
    
    // Contact info
    String givenName = contactMap.hasKey("givenName") ? contactMap.getString("givenName") : "";
    String familyName = contactMap.hasKey("familyName") ? contactMap.getString("familyName") : "";
    ArrayList<Object> inputList =
            contactMap.hasKey("addressLines") ? contactMap.getArray("addressLines").toArrayList() : new ArrayList<Object>();
    ArrayList<String> addressLines = new ArrayList<>(inputList.size());
    for (Object object : inputList) {
      addressLines.add(Objects.toString(object, null));
    }
    String city = contactMap.hasKey("city") ? contactMap.getString("city") : "";
    String countryCode = contactMap.hasKey("countryCode") ? contactMap.getString("countryCode") : "";
    String email = contactMap.hasKey("email") ? contactMap.getString("email") : "";
    String phone = contactMap.hasKey("phone") ? contactMap.getString("phone") : "";
    String postalCode = contactMap.hasKey("postalCode") ? contactMap.getString("postalCode") : "";
    String region = contactMap.hasKey("region") ? contactMap.getString("region") : "";
    Country country = Country.valueOf((countryCode != null) ? countryCode : "US");
    return new Contact.Builder()
            .familyName(familyName)
            .email(email)
            .addressLines(addressLines)
            .city(city)
            .countryCode(country)
            .postalCode(postalCode)
            .phone(phone)
            .region(region)
            .build(givenName);
  }

  private Money getMoney(final ReadableMap moneyMap) {
    return new Money(
            ((Integer)moneyMap.getInt("amount")),
            sqip.Currency.valueOf((String)moneyMap.getString("currencyCode")));
  }

  private BuyerAction getBuyerAction(final String buyerActionString, final Money money) {
    BuyerAction buyerAction;
    if (buyerActionString.equals("Store")) {
      buyerAction = new BuyerAction.Store();
    } else {
      buyerAction = new BuyerAction.Charge(money);
    }
    return buyerAction;
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }
}
