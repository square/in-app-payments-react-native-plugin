package com.squareinapppayments.internal

import sqip.InAppPaymentsSdk

class SQIPCore {
  companion object {
    fun setSquareApplicationId(applicationId: String) {
      val clazz = InAppPaymentsSdk::class.java
      try {
        clazz.getMethod("setSquareApplicationId", String::class.java)
          .invoke(null, applicationId)
      } catch (e: Exception) {
        return
      }
    }
    fun getSquareApplicationId(): String? {
      val clazz = InAppPaymentsSdk::class.java
      try {
        val instance = clazz.getField("INSTANCE").get(null)
        return clazz.getMethod("getSquareApplicationId").invoke(instance) as String
      } catch (e: Exception) {
        return null
      }
    }
  }
}