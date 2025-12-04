package com.squareinapppayments.internal

import android.app.Activity
import android.content.Intent

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.BaseActivityEventListener


import sqip.BuyerVerificationResult
import sqip.BuyerVerificationResult.Error
import sqip.BuyerVerification
import sqip.VerificationParameters
import sqip.SquareIdentifier
import sqip.BuyerAction
import sqip.Contact
import sqip.Callback as SQIPCallback;

import com.squareinapppayments.converter.BuyerActionConverter
import com.squareinapppayments.converter.CardDetailsConverter
import com.squareinapppayments.converter.ContactConverter
import com.squareinapppayments.converter.MoneyConverter
import com.squareinapppayments.internal.SQIPCardEntry
import com.squareinapppayments.utils.ErrorHandlerUtils

class SQIPBuyer {
  companion object {
    private var activity: Activity? = null
    private var reactContext: ReactApplicationContext? = null

    private var onBuyerVerificationSuccess: Callback? = null
    private var onBuyerVerificationFailure: Callback? = null

    public var paymentSourceId: String? = null
    public var squareIdentifier: SquareIdentifier? = null
    public var buyerAction: BuyerAction? = null
    public var contact: Contact? = null

    private var shouldContinueWithGiftCardEntry: Boolean = false
    private var shouldContinueWithCardEntry: Boolean = false
    private var shouldContinueWithGooglePayNonceRequest: Boolean = false

    // FIXME: Dev Testing
    private var mockBuyerVerificationSuccess: Boolean = false

    private fun setActivityListener(reactContext: ReactApplicationContext) {
      reactContext.addActivityEventListener(object :
        BaseActivityEventListener() {
        override fun onActivityResult(
          activity: Activity, 
          requestCode: Int, 
          resultCode: Int, 
          data: Intent?) {
          if (requestCode 
            == BuyerVerification.DEFAULT_BUYER_VERIFICATION_REQUEST_CODE) {
            if (data == null) return
            BuyerVerification.handleActivityResult(
              data, 
              object : SQIPCallback<BuyerVerificationResult>  {
                override fun onResult(result: BuyerVerificationResult) {
                  if (result.isSuccess() || SQIPBuyer.mockBuyerVerificationSuccess) {
                    if(!SQIPBuyer.mockBuyerVerificationSuccess) {
                      if(SQIPBuyer.paymentSourceId == null) {
                        var mapToReturn: WritableMap = 
                          CardDetailsConverter
                            .toMapObject(SQIPCardEntry.cardResult)
                        mapToReturn.putString(
                          "token", 
                          result.getSuccessValue().verificationToken)
                        onBuyerVerificationSuccessCallback(mapToReturn)
                      } else {
                        var mapToReturn = WritableNativeMap()
                        mapToReturn.putString("nonce", SQIPBuyer.paymentSourceId)
                        mapToReturn.putString(
                          "token", 
                          result.getSuccessValue().verificationToken)
                        onBuyerVerificationSuccessCallback(mapToReturn)
                      }
                    } else {
                      var mapToReturn = WritableNativeMap()
                      mapToReturn.putString("nonce", "mock-nonce")
                      mapToReturn.putString("token", "mock-token")
                      onBuyerVerificationSuccessCallback(mapToReturn)
                    }
                    if (SQIPBuyer.shouldContinueWithCardEntry) {
                      SQIPBuyer.invalidateShouldContinue()
                      SQIPCardEntry.startCardEntryFlowFromBuyerVerification();
                    } else if (SQIPBuyer.shouldContinueWithGiftCardEntry) {
                      SQIPBuyer.invalidateShouldContinue()
                      SQIPCardEntry.startGiftCardEntryFlowFromBuyerVerification();
                    } else if (SQIPBuyer.shouldContinueWithGooglePayNonceRequest) {
                      SQIPBuyer.invalidateShouldContinue()
                      SQIPGooglePay.requestGooglePayNonceFromBuyerVerification();
                    }
                  } else if (result.isError()) {
                    SQIPBuyer.invalidateShouldContinue()
                    var error = result.getErrorValue();
                    var errorMap: WritableMap =
                      ErrorHandlerUtils.getCallbackErrorObject(
                        error.code.name, 
                        error.message, 
                        error.debugCode,
                        error.debugMessage);
                    onBuyerVerificationFailureCallback(errorMap)
                  }
                }
            });
            SQIPBuyer.contact = null
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

    // FIXME: Dev Testing
    // React Method
    public fun setMockBuyerVerificationSuccess(
      mockBuyerVerificationSuccess: Boolean
    ) {
      this.mockBuyerVerificationSuccess = mockBuyerVerificationSuccess
    }

    //internal
    fun reVerifyBuyer(paymentSourceId: String) {
      if (
        this.buyerAction == null ||
        this.squareIdentifier == null ||
        this.contact == null)
        return;
      val verificationParameters = VerificationParameters(
        paymentSourceId,
        this.buyerAction!!,
        this.squareIdentifier!!,
        this.contact!!,
      )
      if (this.activity != null) {
        BuyerVerification.verify(
          this.activity!!,
          verificationParameters
        )
      }
    }

    //React Method
    fun startBuyerVerificationFlow( 
      paymentSourceId: String,
      locationId: String,
      buyerActionString: String,
      moneyMap: ReadableMap,
      contactMap: ReadableMap,
      onBuyerVerificationSuccess: Callback,
      onBuyerVerificationFailure: Callback
    ) {
      this.onBuyerVerificationSuccess = onBuyerVerificationSuccess
      this.onBuyerVerificationFailure = onBuyerVerificationFailure
      this.paymentSourceId = paymentSourceId
      
      var money = MoneyConverter.getMoney(moneyMap);
      this.squareIdentifier = SquareIdentifier.LocationToken(locationId);
      this.buyerAction = BuyerActionConverter.getBuyerAction(
        buyerActionString, 
        money
      )
      this.contact = ContactConverter.getContact(contactMap);

      val verificationParameters = VerificationParameters(
        paymentSourceId,
        this.buyerAction!!,
        this.squareIdentifier!!,
        this.contact!!,
      )

      if (this.activity != null) {
        BuyerVerification.verify(
          this.activity!!,
          verificationParameters
        )
      }
    }

    fun onBuyerVerificationSuccessCallback(verificationResult: WritableMap) {
      onBuyerVerificationSuccess?.invoke(verificationResult)
      onBuyerVerificationSuccess = null
      onBuyerVerificationFailure = null
    }

    fun onBuyerVerificationFailureCallback(errorDetails: WritableMap) {
      onBuyerVerificationFailure?.invoke(errorDetails)
      onBuyerVerificationSuccess = null
      onBuyerVerificationFailure = null
    }

    public fun applyShouldContinueWithGiftCardEntry() {
      this.shouldContinueWithGiftCardEntry = true
      this.shouldContinueWithCardEntry = false
      this.shouldContinueWithGooglePayNonceRequest = false
    }

    public fun applyShouldContinueWithCardEntry() {
      this.shouldContinueWithCardEntry = true
      this.shouldContinueWithGiftCardEntry = false
      this.shouldContinueWithGooglePayNonceRequest = false
    }

    public fun applyShouldContinueWithGooglePayEntry() {
      this.shouldContinueWithGooglePayNonceRequest = true
      this.shouldContinueWithCardEntry = false
      this.shouldContinueWithGiftCardEntry = false
    }

    public fun invalidateShouldContinue() {
      this.shouldContinueWithGiftCardEntry = false
      this.shouldContinueWithCardEntry = false
      this.shouldContinueWithGooglePayNonceRequest = false
    }
  }
}