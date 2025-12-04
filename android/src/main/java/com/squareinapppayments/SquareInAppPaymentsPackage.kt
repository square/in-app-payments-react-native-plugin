package com.squareinapppayments

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

import com.squareinapppayments.modules.SQIPCoreModule
import com.squareinapppayments.modules.SQIPCardEntryModule
import com.squareinapppayments.modules.SQIPBuyerModule
import com.squareinapppayments.modules.SQIPGooglePayModule
import com.squareinapppayments.modules.SQIPApplePayModule

import java.util.HashMap

class SquareInAppPaymentsPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): 
    NativeModule? {
    return if (name == SQIPCoreModule.NAME) {
      SQIPCoreModule(reactContext)
    } else if (name == SQIPCardEntryModule.NAME) {
      SQIPCardEntryModule(reactContext)
    } else if (name == SQIPBuyerModule.NAME) {
      SQIPBuyerModule(reactContext)
    } else if (name == SQIPGooglePayModule.NAME) {
      SQIPGooglePayModule(reactContext)
    } else if (name == SQIPApplePayModule.NAME) {
      SQIPApplePayModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      moduleInfos[SQIPCoreModule.NAME] = ReactModuleInfo(
        SQIPCoreModule.NAME,
        SQIPCoreModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        true // isTurboModule
      )
      moduleInfos[SQIPCardEntryModule.NAME] = ReactModuleInfo(
        SQIPCardEntryModule.NAME,
        SQIPCardEntryModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        true // isTurboModule
      )
      moduleInfos[SQIPBuyerModule.NAME] = ReactModuleInfo(
        SQIPBuyerModule.NAME,
        SQIPBuyerModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        true // isTurboModule
      )
      moduleInfos[SQIPGooglePayModule.NAME] = ReactModuleInfo(
        SQIPGooglePayModule.NAME,
        SQIPGooglePayModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        true // isTurboModule
      )
      moduleInfos[SQIPApplePayModule.NAME] = ReactModuleInfo(
        SQIPApplePayModule.NAME,
        SQIPApplePayModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        true // isTurboModule
      )
      moduleInfos
    }
  }
}
