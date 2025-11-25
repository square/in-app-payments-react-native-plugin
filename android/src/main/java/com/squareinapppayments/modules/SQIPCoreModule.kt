package com.squareinapppayments.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.squareinapppayments.NativeSQIPCoreSpec
import com.squareinapppayments.internal.SQIPCore

@ReactModule(name = SQIPCoreModule.NAME)
class SQIPCoreModule(reactContext: ReactApplicationContext) :
  NativeSQIPCoreSpec(reactContext) {

  override fun getName(): String {
    return SQIPCoreModule.NAME
  }

  override fun setSquareApplicationId(applicationId: String) {
    SQIPCore.setSquareApplicationId(applicationId)
  }

  override fun getSquareApplicationId(): String? {
    return SQIPCore.getSquareApplicationId()
  }

  companion object {
    const val NAME = "SQIPCore"
  }
}
