package com.squareinapppayments.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Callback

import com.squareinapppayments.NativeSQIPGooglePaySpec
import com.squareinapppayments.internal.SQIPGooglePay

@ReactModule(name = SQIPGooglePayModule.NAME)
class SQIPGooglePayModule(reactContext: ReactApplicationContext) :
  NativeSQIPGooglePaySpec(reactContext) {

  override fun getName(): String {
    return SQIPGooglePayModule.NAME
  }

  init {
    SQIPGooglePay.setReactApplicationContext(reactApplicationContext)
    SQIPGooglePay.setActivity(currentActivity)
  }

  override fun initializeGooglePay(
    squareLocationId: String, 
    environment: Double
  ) {
    SQIPGooglePay.initializeGooglePay(squareLocationId, environment.toInt())
  }

  override fun canUseGooglePay(promise: Promise) {
    SQIPGooglePay.canUseGooglePay(promise)
  }

  override fun requestGooglePayNonce(
    googlePayConfig: ReadableMap, 
    onGooglePayNonceRequestSuccess: Callback,
    onGooglePayNonceRequestFailure: Callback,
    onGooglePayCanceled: Callback,
    promise: Promise
  ) {
    SQIPGooglePay.requestGooglePayNonce(
      googlePayConfig, 
      onGooglePayNonceRequestSuccess, 
      onGooglePayNonceRequestFailure, 
      onGooglePayCanceled,
      promise)
  }

  override fun requestGooglePayNonceWithBuyerVerification(
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
    SQIPGooglePay.requestGooglePayNonceWithBuyerVerification(
      googlePayConfig,
      paymentSourceId,
      locationId,
      buyerAction,
      money,
      contact,
      onBuyerVerificationSuccess, 
      onBuyerVerificationFailure, 
      onGooglePayNonceRequestSuccess, 
      onGooglePayNonceRequestFailure, 
      onGooglePayCanceled,
      promise)
  }

  companion object {
    const val NAME = "SQIPGooglePay"
  }
}
