package com.squareinapppayments.modules

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReadableMap

import com.squareinapppayments.NativeSQIPBuyerSpec
import com.squareinapppayments.internal.SQIPBuyer

@ReactModule(name = SQIPBuyerModule.NAME)
class SQIPBuyerModule(reactContext: ReactApplicationContext) :
  NativeSQIPBuyerSpec(reactContext) {

  override fun getName(): String {
    return SQIPBuyerModule.NAME
  }

  init {
    SQIPBuyer.setActivity(currentActivity)
    SQIPBuyer.setReactApplicationContext(reactApplicationContext)
  }

  override fun startBuyerVerificationFlow(
    paymentSourceId: String,
    locationId: String,
    buyerAction: String,
    money: ReadableMap,
    contact: ReadableMap,
    onBuyerVerificationSuccess: Callback,
    onBuyerVerificationFailure: Callback
  ) {
    SQIPBuyer.startBuyerVerificationFlow(
      paymentSourceId, 
      locationId, 
      buyerAction, 
      money, 
      contact, 
      onBuyerVerificationSuccess, 
      onBuyerVerificationFailure
    )
  }

  // FIXME: Dev Testing
  override fun setMockBuyerVerificationSuccess(
    mockBuyerVerificationSuccess: Boolean
  ) {
    SQIPBuyer.setMockBuyerVerificationSuccess(mockBuyerVerificationSuccess)
  }

  companion object {
    const val NAME = "SQIPBuyer"
  }
}
