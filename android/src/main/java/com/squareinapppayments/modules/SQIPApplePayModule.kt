package com.squareinapppayments.modules

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReadableMap

import com.squareinapppayments.NativeSQIPApplePaySpec

// This module is implemented here to avoid getEnforcing error from 
// TurboModuleRegistry.getEnforcing
@ReactModule(name = SQIPApplePayModule.NAME)
class SQIPApplePayModule(reactContext: ReactApplicationContext) :
  NativeSQIPApplePaySpec(reactContext) {

  override fun getName(): String {
    return SQIPApplePayModule.NAME
  }

  override fun initializeApplePay(applePayMerchantId: String) {}

  override fun canUseApplePay(promise: Promise) {
    promise.resolve(false)
  }

  override fun completeApplePayAuthorization(
    isSuccess: Boolean, 
    errorMessage: String
  ) {}

  override fun requestApplePayNonce(
    price: String,
    summaryLabel: String,
    countryCode: String,
    currencyCode: String,
    paymentType: Double,
    onApplePayNonceRequestSuccess: Callback,
    onApplePayNonceRequestFailure: Callback,
    onApplePayComplete: Callback,
    promise: Promise
  ) {
    promise.resolve(null);
  }

  override fun requestApplePayNonceWithBuyerVerification(
    price: String,
    summaryLabel: String,
    countryCode: String,
    currencyCode: String,
    paymentType: Double,
    paymentSourceId: String,
    locationId: String,
    buyerAction: String,
    money: ReadableMap,
    contact: ReadableMap,
    onBuyerVerificationSuccess: Callback,
    onBuyerVerificationFailure: Callback,
    onApplePayNonceRequestSuccess: Callback,
    onApplePayNonceRequestFailure: Callback,
    onApplePayComplete: Callback,
    promise: Promise
  ) { 
    promise.resolve(null);
  }

  companion object {
    const val NAME = "SQIPApplePay"
  }
}
