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
                  if (result.isSuccess()) {
                    if(SQIPBuyer.paymentSourceId == null) {
                      var mapToReturn: WritableMap =
                        CardDetailsConverter
                          .toMapObject(SQIPCardEntry.cardResult)
                      mapToReturn.putString(
                        "token",
                        result.getSuccessValue().verificationToken)
                      SQIPFlowLog.collectVerifyResult(
                        mapToReturn.getString("nonce"),
                        mapToReturn.getString("token")
                      )
                      onBuyerVerificationSuccessCallback(mapToReturn)
                    } else {
                      var mapToReturn = WritableNativeMap()
                      mapToReturn.putString("nonce", SQIPBuyer.paymentSourceId)
                      mapToReturn.putString(
                        "token",
                        result.getSuccessValue().verificationToken)
                      SQIPFlowLog.collectVerifyResult(
                        mapToReturn.getString("nonce"),
                        mapToReturn.getString("token")
                      )
                      onBuyerVerificationSuccessCallback(mapToReturn)
                    }
                  } else if (result.isError()) {
                    SQIPFlowLog.step("[3/4] ✗ 3DS failed — ${result.getErrorValue().debugCode}")
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

    fun isPrepared(): Boolean {
      return this.buyerAction != null &&
        this.squareIdentifier != null &&
        this.contact != null
    }

    fun clearPreparedBuyerVerification() {
      this.paymentSourceId = null
      this.squareIdentifier = null
      this.buyerAction = null
      this.contact = null
      this.onBuyerVerificationSuccess = null
      this.onBuyerVerificationFailure = null
    }

    /**
     * Store buyer-verification parameters without starting 3DS. Combined
     * *WithBuyerVerification methods call this, collect a nonce, then
     * [reVerifyBuyer] with that nonce.
     */
    fun prepareBuyerVerification(
      locationId: String,
      buyerActionString: String,
      moneyMap: ReadableMap,
      contactMap: ReadableMap,
      onBuyerVerificationSuccess: Callback,
      onBuyerVerificationFailure: Callback
    ) {
      SQIPFlowLog.step("setup: 3DS params stored (location, amount, buyer contact)")
      this.onBuyerVerificationSuccess = onBuyerVerificationSuccess
      this.onBuyerVerificationFailure = onBuyerVerificationFailure
      this.paymentSourceId = null

      var money = MoneyConverter.getMoney(moneyMap);
      this.squareIdentifier = SquareIdentifier.LocationToken(locationId);
      this.buyerAction = BuyerActionConverter.getBuyerAction(
        buyerActionString,
        money
      )
      this.contact = ContactConverter.getContact(contactMap);
    }

    //internal
    fun reVerifyBuyer(paymentSourceId: String) {
      if (
        this.buyerAction == null ||
        this.squareIdentifier == null ||
        this.contact == null) {
        SQIPFlowLog.step(
          "reVerifyBuyer skipped — 3DS params missing (was prepareBuyerVerification called?)"
        )
        return
      }
      SQIPFlowLog.collectVerifyStep(3, null, paymentSourceId)
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
      } else {
        SQIPFlowLog.step("reVerifyBuyer skipped — activity is null")
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
      SQIPFlowLog.step(
        "standalone startBuyerVerificationFlow — verify caller-supplied payment source",
        paymentSourceId
      )
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
      clearPreparedBuyerVerification()
    }

    fun onBuyerVerificationFailureCallback(errorDetails: WritableMap) {
      onBuyerVerificationFailure?.invoke(errorDetails)
      clearPreparedBuyerVerification()
    }
  }
}
