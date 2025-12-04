package com.squareinapppayments.modules

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

import com.squareinapppayments.NativeSQIPCardEntrySpec
import com.squareinapppayments.internal.SQIPCardEntry

@ReactModule(name = SQIPCardEntryModule.NAME)
class SQIPCardEntryModule(reactContext: ReactApplicationContext) :
  NativeSQIPCardEntrySpec(reactContext) {

  init {
    SQIPCardEntry.setReactApplicationContext(reactApplicationContext)
    SQIPCardEntry.setActivity(currentActivity)
  }

  override fun getName(): String {
    return SQIPCardEntryModule.NAME
  }

  override fun startCardEntryFlow(
    collectPostalCode: Boolean,
    onCardNonceRequestSuccess: Callback,
    onCardEntryCancel: Callback
  ) {
    SQIPCardEntry.startCardEntryFlow(
      collectPostalCode,
      onCardNonceRequestSuccess,
      onCardEntryCancel
    )
  }

  override fun updateOnCardNonceRequestSuccessCallback(
    onCardNonceRequestSuccess: Callback
  ) {
    SQIPCardEntry.updateOnCardNonceRequestSuccessCallback(
      onCardNonceRequestSuccess
    )
  }

  override fun startGiftCardEntryFlow(
    onCardNonceRequestSuccess: Callback,
    onCardEntryCancel: Callback
  ) {
    SQIPCardEntry.startGiftCardEntryFlow(
      onCardNonceRequestSuccess, 
      onCardEntryCancel
    )
  }

  override fun completeCardEntry(onCardEntryComplete: Callback) {
    SQIPCardEntry.completeCardEntry(onCardEntryComplete)
  }

  override fun showCardNonceProcessingError(errorMessage: String) {
    SQIPCardEntry.showCardNonceProcessingError(errorMessage)
  }

  override fun startCardEntryFlowWithBuyerVerification(
    collectPostalCode: Boolean,
    paymentSourceId: String,
    locationId: String,
    buyerAction: String,
    money: ReadableMap,
    contact: ReadableMap,
    onBuyerVerificationSuccess: Callback,
    onBuyerVerificationFailure: Callback,
    onCardNonceRequestSuccess: Callback,
    onCardEntryCancel: Callback
  ) {
    SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
      collectPostalCode,
      paymentSourceId,
      locationId,
      buyerAction,
      money,
      contact,
      onBuyerVerificationSuccess,
      onBuyerVerificationFailure,
      onCardNonceRequestSuccess,
      onCardEntryCancel
    )
  }

  override fun startGiftCardEntryFlowWithBuyerVerification(
    paymentSourceId: String,
    locationId: String,
    buyerAction: String,
    money: ReadableMap,
    contact: ReadableMap,
    onBuyerVerificationSuccess: Callback,
    onBuyerVerificationFailure: Callback,
    onCardNonceRequestSuccess: Callback,
    onCardEntryCancel: Callback
  ) {
    SQIPCardEntry.startGiftCardEntryFlowWithBuyerVerification(
      paymentSourceId,
      locationId,
      buyerAction,
      money,
      contact,
      onBuyerVerificationSuccess,
      onBuyerVerificationFailure,
      onCardNonceRequestSuccess,
      onCardEntryCancel
    )
  }

  override fun setIOSCardEntryTheme(theme: ReadableMap) {
    // override this method to do nothing on Android
    // Maybe setting the theme dynamically here? on android
  }

  companion object {
    const val NAME = "SQIPCardEntry"
  }
}
