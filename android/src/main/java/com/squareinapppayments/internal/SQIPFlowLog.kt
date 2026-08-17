package com.squareinapppayments.internal

import android.util.Log

internal object SQIPFlowLog {
  private const val TAG = "SQIPFlow"

  private val COLLECT_VERIFY_STEPS = arrayOf(
    "Open card entry / Apple Pay / Google Pay first",
    "Buyer picks or types a card → we get a nonce",
    "Run 3DS verification on that nonce",
    "Return the nonce + the verification token together",
  )

  fun collectVerifyStep(step: Int, paymentUiOverride: String? = null) {
    val message = stepMessage(step, paymentUiOverride)
    Log.i(TAG, "[$step/4] ✓ $message")
  }

  fun collectVerifyStep(step: Int, paymentUiOverride: String?, nonce: String?) {
    val message = stepMessage(step, paymentUiOverride)
    Log.i(TAG, "[$step/4] ✓ $message nonce code: ${nonce ?: "(none)"}")
  }

  fun collectVerifyResult(nonce: String?, verificationToken: String?) {
    Log.i(TAG, "[4/4] ✓ Return the nonce + the verification token together")
    Log.i(TAG, "     nonce code: ${nonce ?: "(none)"}")
    Log.i(TAG, "     verification token: ${verificationToken ?: "(none)"}")
  }

  fun step(message: String) {
    Log.i(TAG, message)
  }

  fun step(message: String, nonce: String?) {
    Log.i(TAG, "$message nonce code: ${nonce ?: "(none)"}")
  }

  private fun stepMessage(step: Int, paymentUiOverride: String?): String {
    if (step == 1 && paymentUiOverride != null) {
      return "Open $paymentUiOverride first"
    }
    return COLLECT_VERIFY_STEPS.getOrElse(step - 1) { "step $step" }
  }
}
