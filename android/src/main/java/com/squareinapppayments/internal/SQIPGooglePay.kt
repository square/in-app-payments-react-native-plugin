package com.squareinapppayments.internal

import android.app.Activity
import android.content.Intent

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.BaseActivityEventListener

import com.google.android.gms.tasks.OnCompleteListener
import com.google.android.gms.tasks.Task
import com.google.android.gms.wallet.AutoResolveHelper
import com.google.android.gms.wallet.IsReadyToPayRequest
import com.google.android.gms.wallet.PaymentData
import com.google.android.gms.wallet.PaymentDataRequest
import com.google.android.gms.wallet.PaymentsClient
import com.google.android.gms.wallet.TransactionInfo
import com.google.android.gms.wallet.Wallet

import com.squareinapppayments.utils.ErrorHandlerUtils;
import com.squareinapppayments.utils.InAppPaymentsException;
import com.squareinapppayments.converter.CardDetailsConverter;

import sqip.SquareIdentifier
import sqip.GooglePay;
import sqip.GooglePayNonceResult;
import sqip.Callback as SQIPCallback;


class SQIPGooglePay {
  companion object {
    private val RN_GOOGLE_PAY_INVALID_CONFIG = "rn_google_pay_invalid_config";
    private val RN_MESSAGE_GOOGLE_PAY_INVALID_CONFIG = "Invalid google pay configuration, please check the parameters and try again.";
    private val RN_GOOGLE_PAY_NOT_INITIALIZED = "rn_google_pay_not_initialized";
    private val RN_GOOGLE_PAY_RESULT_ERROR = "rn_google_pay_result_error";
    private val RN_GOOGLE_PAY_UNKNOWN_ERROR = "rn_google_pay_unknown_error";
    private val RN_GOOGLE_PAY_NO_PAYMENT_METHOD_TOKEN = "rn_google_pay_no_payment_method_token";
    private val RN_MESSAGE_GOOGLE_PAY_NO_PAYMENT_METHOD_TOKEN = "No payment method token found in the payment data.";
    private val RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED = "Please initialize google pay before you can call other methods.";
    private val RN_MESSAGE_GOOGLE_PAY_RESULT_ERROR = "Failed to launch google pay, please make sure you configured google pay correctly.";
    private val RN_MESSAGE_GOOGLE_PAY_UNKNOWN_ERROR = "Unknown google pay activity result status.";

    private val LOAD_PAYMENT_DATA_REQUEST_CODE = 4111;

    private var activity: Activity? = null
    private var reactContext: ReactApplicationContext? = null

    private var onGooglePayNonceRequestSuccess: Callback? = null
    private var onGooglePayNonceRequestFailure: Callback? = null
    private var onGooglePayCanceled: Callback? = null

    private var squareLocationId: String? = null
    private var price: String? = null
    private var currencyCode: String? = null
    private var priceStatus: Int? = null

    private var googlePayClients: PaymentsClient? = null

    private fun setActivityListener(reactContext: ReactApplicationContext) {
      reactContext.addActivityEventListener(object : 
        BaseActivityEventListener() {
        override fun onActivityResult(
          activity: Activity,
          requestCode: Int,
          resultCode: Int,
          data: Intent?
        ) {
          if (requestCode == LOAD_PAYMENT_DATA_REQUEST_CODE) {
            when (resultCode) {
              Activity.RESULT_OK -> {
                if (data == null) {
                  return;
                }
                val paymentData = PaymentData.getFromIntent(data);
                val googlePayToken = paymentData?.paymentMethodToken?.token
                if (googlePayToken == null) {
                  val error = ErrorHandlerUtils.getCallbackErrorObject(
                    ErrorHandlerUtils.USAGE_ERROR, 
                    ErrorHandlerUtils.getPluginErrorMessage(
                      RN_GOOGLE_PAY_NO_PAYMENT_METHOD_TOKEN
                    ), 
                    RN_GOOGLE_PAY_NO_PAYMENT_METHOD_TOKEN,
                    RN_MESSAGE_GOOGLE_PAY_NO_PAYMENT_METHOD_TOKEN
                  )
                  onGooglePayNonceRequestFailureCallback(error)
                  return;
                }
                GooglePay.requestGooglePayNonce(googlePayToken).enqueue(
                  object : SQIPCallback<GooglePayNonceResult> {
                    override fun onResult(result: GooglePayNonceResult) {
                      if (result.isSuccess()) {
                        val cardDetails = CardDetailsConverter.toMapObject(
                          result.getSuccessValue()
                        )
                        onGooglePayNonceRequestSuccessCallback(cardDetails)
                      } else if (result.isError()) {
                        val error = result as GooglePayNonceResult.Error
                        val errorDetails = 
                          ErrorHandlerUtils.getCallbackErrorObject(
                            error.code.name,
                            error.message,
                            error.debugCode,
                            error.debugMessage
                          )
                        onGooglePayNonceRequestFailureCallback(errorDetails)
                      }
                    }
                  }
                )
              }
              Activity.RESULT_CANCELED -> {
                onGooglePayCanceledCallback()
              }
              AutoResolveHelper.RESULT_ERROR -> {
                val error = ErrorHandlerUtils.getCallbackErrorObject(
                  ErrorHandlerUtils.USAGE_ERROR, 
                  ErrorHandlerUtils.getPluginErrorMessage(
                    RN_GOOGLE_PAY_RESULT_ERROR
                  ), 
                  RN_GOOGLE_PAY_RESULT_ERROR,
                  RN_MESSAGE_GOOGLE_PAY_RESULT_ERROR
                )
                onGooglePayNonceRequestFailureCallback(error)
              }
              else -> {
                val error = ErrorHandlerUtils.getCallbackErrorObject(
                  ErrorHandlerUtils.USAGE_ERROR, 
                  ErrorHandlerUtils.getPluginErrorMessage(
                    RN_GOOGLE_PAY_UNKNOWN_ERROR
                  ), 
                  RN_GOOGLE_PAY_UNKNOWN_ERROR,
                  RN_MESSAGE_GOOGLE_PAY_UNKNOWN_ERROR
                )
                onGooglePayNonceRequestFailureCallback(error)
              }
            }
          }
        }
      })
    }

    fun setActivity(activity: Activity?) {
      this.activity = activity
    }

    fun setReactApplicationContext(reactContext: ReactApplicationContext) {
      if (this.reactContext != null) return;
      this.reactContext = reactContext
      setActivityListener(reactContext)
    }

    fun initializeGooglePay(squareLocationId: String, environment: Int) {
      this.squareLocationId = squareLocationId;
      if (this.activity == null) {
        return
      };
      googlePayClients = Wallet.getPaymentsClient(
        this.activity!!,
        (Wallet.WalletOptions.Builder())
          .setEnvironment(environment)
          .build()
      );
    }

    fun onGooglePayNonceRequestSuccessCallback(cardDetails: WritableMap) {
      onGooglePayNonceRequestSuccess?.invoke(cardDetails)
      onGooglePayNonceRequestSuccess = null;
      onGooglePayCanceled = null;
      onGooglePayNonceRequestFailure = null;
    }

    fun onGooglePayNonceRequestFailureCallback(errorDetails: WritableMap) {
      onGooglePayNonceRequestFailure?.invoke(errorDetails)
      onGooglePayNonceRequestFailure = null;
      onGooglePayCanceled = null;
      onGooglePayNonceRequestSuccess = null;
    }

    fun onGooglePayCanceledCallback() {
      onGooglePayCanceled?.invoke(null)
      onGooglePayCanceled = null;
      onGooglePayNonceRequestSuccess = null;
      onGooglePayNonceRequestFailure = null;
    }

    fun canUseGooglePay(promise: Promise) {
      if (googlePayClients == null) {
        val errorJsonMessage = 
          ErrorHandlerUtils.createNativeModuleError(
            RN_GOOGLE_PAY_NOT_INITIALIZED, 
            RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED
          );
        promise.reject(
          ErrorHandlerUtils.USAGE_ERROR,
          InAppPaymentsException(errorJsonMessage)
        );
        return;
      }
      val isReadyToPayRequest = GooglePay.createIsReadyToPayRequest();
      googlePayClients!!.isReadyToPay(isReadyToPayRequest)
        .addOnCompleteListener(object : OnCompleteListener<Boolean> {
        override fun onComplete(task: Task<Boolean>) {
          promise.resolve(task.isSuccessful);
        }
      });
    }

    fun requestGooglePayNonce(
      googlePayConfig: ReadableMap, 
      onGooglePayNonceRequestSuccess: Callback, 
      onGooglePayNonceRequestFailure: Callback, 
      onGooglePayCanceled: Callback,
      promise: Promise
    ) {
      if (googlePayClients == null) {
        val errorJsonMessage = 
          ErrorHandlerUtils.createNativeModuleError(
            RN_GOOGLE_PAY_NOT_INITIALIZED, 
            RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED
          );
        promise.reject(
          ErrorHandlerUtils.USAGE_ERROR,
          InAppPaymentsException(errorJsonMessage)
        );
        return;
      }

      val local_price = googlePayConfig.getString("price");
      val local_currencyCode = googlePayConfig.getString("currencyCode");
      val local_priceStatus = googlePayConfig.getInt("priceStatus");

      if (
        googlePayClients == null ||
        squareLocationId == null || 
        this.activity == null ||
        local_price == null ||
        local_currencyCode == null ||
        local_priceStatus == null
      ) {
        val errorJsonMessage = 
          ErrorHandlerUtils.createNativeModuleError(
            RN_GOOGLE_PAY_INVALID_CONFIG, 
            RN_MESSAGE_GOOGLE_PAY_INVALID_CONFIG
          );
        promise.reject(
          ErrorHandlerUtils.USAGE_ERROR,
          InAppPaymentsException(errorJsonMessage)
        );
        return;
      }

      promise.resolve(null);

      this.onGooglePayNonceRequestSuccess = onGooglePayNonceRequestSuccess;
      this.onGooglePayNonceRequestFailure = onGooglePayNonceRequestFailure;
      this.onGooglePayCanceled = onGooglePayCanceled;
      
      AutoResolveHelper.resolveTask(
        googlePayClients!!
          .loadPaymentData(
            createPaymentChargeRequest(
              squareLocationId!!, 
              local_price, 
              local_currencyCode, 
              local_priceStatus
        )),
        this.activity!!,
        LOAD_PAYMENT_DATA_REQUEST_CODE
      );
    }

    fun requestGooglePayNonceWithBuyerVerification(
      googlePayConfig: ReadableMap, 
      paymentSourceId: String, 
      locationId: String,
      buyerAction: String,
      money: ReadableMap,
      contact: ReadableMap,
      onBuyerVerificationSuccess: Callback, 
      onBuyerVerificationFailure: Callback, 
      onGooglePayNonceRequestSuccess: Callback, 
      onGooglePayNonceRequestFailure: Callback, 
      onGooglePayCanceled: Callback,
      promise: Promise
    ) {
      if (googlePayClients == null) {
        val errorJsonMessage = 
          ErrorHandlerUtils.createNativeModuleError(
            RN_GOOGLE_PAY_NOT_INITIALIZED, 
            RN_MESSAGE_GOOGLE_PAY_NOT_INITIALIZED
          );
        promise.reject(
          ErrorHandlerUtils.USAGE_ERROR,
          InAppPaymentsException(errorJsonMessage)
        );
        return;
      }

      this.price = googlePayConfig.getString("price");
      this.currencyCode = googlePayConfig.getString("currencyCode");
      this.priceStatus = googlePayConfig.getInt("priceStatus");

      if (
        googlePayClients == null ||
        squareLocationId == null || 
        this.activity == null ||
        this.price == null ||
        this.currencyCode == null ||
        this.priceStatus == null
      ) {
        val errorJsonMessage = 
          ErrorHandlerUtils.createNativeModuleError(
            RN_GOOGLE_PAY_INVALID_CONFIG, 
            RN_MESSAGE_GOOGLE_PAY_INVALID_CONFIG
          );
        promise.reject(
          ErrorHandlerUtils.USAGE_ERROR,
          InAppPaymentsException(errorJsonMessage)
        );
        return;
      }

      promise.resolve(null);

      this.onGooglePayNonceRequestSuccess = onGooglePayNonceRequestSuccess;
      this.onGooglePayNonceRequestFailure = onGooglePayNonceRequestFailure;
      this.onGooglePayCanceled = onGooglePayCanceled;
      
      SQIPBuyer.applyShouldContinueWithGooglePayEntry();
      SQIPBuyer.startBuyerVerificationFlow(
        paymentSourceId,
        locationId,
        buyerAction,
        money,
        contact,
        onBuyerVerificationSuccess,
        onBuyerVerificationFailure
      );
    }


    public fun requestGooglePayNonceFromBuyerVerification() {
      if (googlePayClients == null
        || squareLocationId == null
        || this.activity == null
        || this.price == null
        || this.currencyCode == null
        || this.priceStatus == null
      ) { 
        return;
      }
      AutoResolveHelper.resolveTask(
        googlePayClients!!
          .loadPaymentData(
            createPaymentChargeRequest(
              squareLocationId!!, 
              this.price!!, 
              this.currencyCode!!, 
              this.priceStatus!!
        )),
        this.activity!!,
        LOAD_PAYMENT_DATA_REQUEST_CODE
      );
    }
    
    private fun createPaymentChargeRequest(
      squareLocationId : String, 
      price : String, 
      currencyCode : String, 
      priceStatus : Int): PaymentDataRequest {
      val transactionInfo = TransactionInfo.newBuilder()
          .setTotalPriceStatus(priceStatus)
          .setTotalPrice(price)
          .setCurrencyCode(currencyCode).build();
      return GooglePay
        .createPaymentDataRequest(squareLocationId, transactionInfo);
    }
  }
}