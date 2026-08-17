package com.squareinapppayments.internal

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.content.Intent
import android.content.res.Resources

import com.squareinapppayments.R
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReadableMap

import com.squareinapppayments.converter.CardDetailsConverter
import com.squareinapppayments.internal.SQIPBuyer

import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

import sqip.Callback as SQIPCallback;
import sqip.CardEntry
import sqip.CardEntryActivityCommand
import sqip.CardEntryActivityResult;
import sqip.CardDetails
import sqip.CardNonceBackgroundHandler

class SQIPCardEntry {
  companion object {
    private var onCardNonceRequestSuccess: Callback? = null
    private var onCardEntryCancel: Callback? = null
    private var onCardEntryComplete: Callback? = null
    
    private val mainLooperHandler : Handler = Handler(Looper.getMainLooper()) 
    private var reactContext: ReactApplicationContext? = null
    private var activity: Activity? = null
    private val reference = AtomicReference<CardEntryActivityCommand>(
      CardEntryActivityCommand.ShowError("Unrecognized command received")
    )
    @Volatile private var countDownLatch: CountDownLatch? = null

    public var cardResult: CardDetails? = null
    private var collectPostalCode: Boolean? = null
    @Volatile private var preparedVerificationScheduled: Boolean = false

    init {
      CardEntry.setCardNonceBackgroundHandler(object : 
            CardNonceBackgroundHandler {
          override fun handleEnteredCardInBackground(cardDetails: CardDetails):
            CardEntryActivityCommand {
            if (SQIPBuyer.isPrepared()) {
              SQIPCardEntry.cardResult = cardDetails
              schedulePreparedBuyerVerification(cardDetails.nonce)
              return CardEntryActivityCommand.Finish()
            }
            SQIPCardEntry.countDownLatch = CountDownLatch(1)
            val cardDetailsMap = CardDetailsConverter.toMapObject(cardDetails)
            onCardNonceRequestSuccessCallback(cardDetailsMap)
            try {
              SQIPCardEntry.countDownLatch?.await()
              SQIPCardEntry.countDownLatch = null
            } catch (e: InterruptedException) {
              throw RuntimeException(e)
            }
            return SQIPCardEntry.reference.get() 
              ?: CardEntryActivityCommand.Finish()
          }
        }
      )
    }

    private fun setActivityListener(reactContext: ReactApplicationContext) {
      reactContext.addActivityEventListener(object : 
        BaseActivityEventListener() {
        override fun onActivityResult(
          activity: Activity,
          requestCode: Int,
          resultCode: Int,
          data: Intent?
        ) {
          if (requestCode == CardEntry.DEFAULT_CARD_ENTRY_REQUEST_CODE) {
            if (data == null) return
            CardEntry.handleActivityResult(data, object : 
              SQIPCallback<CardEntryActivityResult> {
              override fun onResult(
                cardEntryActivityResult: CardEntryActivityResult
              ) {
                if (cardEntryActivityResult.isSuccess()
                  && SQIPBuyer.isPrepared()) {
                  var successValue = cardEntryActivityResult.getSuccessValue()
                  if (SQIPCardEntry.cardResult == null) {
                    SQIPCardEntry.cardResult = successValue
                  }
                  schedulePreparedBuyerVerification(
                    SQIPCardEntry.cardResult?.nonce ?: successValue.nonce
                  )
                } else {
                  val delayDurationMs 
                    = readCardEntryCloseExitAnimationDurationMs()
                  mainLooperHandler.postDelayed({
                    if (cardEntryActivityResult.isCanceled()) {
                      onCardEntryCancelCallback()
                    } else if (cardEntryActivityResult.isSuccess()) {
                      onCardEntryCompleteCallback()
                    }
                  }, delayDurationMs)
                }
              }
            })
          }
        }
      })
    }

    //internal
    fun setReactApplicationContext(reactContext: ReactApplicationContext) {
      if (this.reactContext != null) return;
      this.reactContext = reactContext
      setActivityListener(reactContext)
    }

    //internal
    fun setActivity(activity: Activity?) {
      this.activity = activity
    }

    //React Method
    public fun startCardEntryFlow(
      collectPostalCode: Boolean,
      onCardNonceRequestSuccess: Callback,
      onCardEntryCancel: Callback
    ) {
      this.onCardNonceRequestSuccess = onCardNonceRequestSuccess
      this.onCardEntryCancel = onCardEntryCancel
      this.collectPostalCode = collectPostalCode
      SQIPBuyer.clearPreparedBuyerVerification()
      if (activity != null) {
        CardEntry.startCardEntryActivity(activity!!, collectPostalCode)
      }
    }

    //React Method
    public fun startGiftCardEntryFlow(
      onCardNonceRequestSuccess: Callback,
      onCardEntryCancel: Callback
    ) {
      this.onCardNonceRequestSuccess = onCardNonceRequestSuccess
      this.onCardEntryCancel = onCardEntryCancel
      SQIPBuyer.clearPreparedBuyerVerification()
      if (activity != null) {
        CardEntry.startGiftCardEntryActivity(activity!!);
      }
    }

    //React Method
    public fun completeCardEntry(
      onCardEntryComplete: Callback, 
    ) {
      this.onCardEntryComplete = onCardEntryComplete
      reference.set(CardEntryActivityCommand.Finish())
      countDownLatch?.countDown()
    }

    //React Method
    public fun showCardNonceProcessingError(
      errorMessage: String, 
    ) {
      reference.set(CardEntryActivityCommand.ShowError(errorMessage));
      countDownLatch?.countDown();
    }

    //React Method
    public fun startCardEntryFlowWithBuyerVerification(
      collectPostalCode: Boolean,
      locationId: String,
      buyerAction: String,
      money: ReadableMap,
      contact: ReadableMap,
      onBuyerVerificationSuccess: Callback,
      onBuyerVerificationFailure: Callback,
      onCardNonceRequestSuccess: Callback,
      onCardEntryCancel: Callback
    ) {
      this.onCardNonceRequestSuccess = onCardNonceRequestSuccess
      this.onCardEntryCancel = onCardEntryCancel
      this.collectPostalCode = collectPostalCode
      SQIPBuyer.prepareBuyerVerification(
        locationId,
        buyerAction,
        money,
        contact,
        onBuyerVerificationSuccess,
        onBuyerVerificationFailure,
      )
      preparedVerificationScheduled = false
      if (activity != null) {
        CardEntry.startCardEntryActivity(activity!!, collectPostalCode)
      }
    }

    //React Method
    public fun startGiftCardEntryFlowWithBuyerVerification(
      locationId: String,
      buyerAction: String,
      money: ReadableMap,
      contact: ReadableMap,
      onBuyerVerificationSuccess: Callback,
      onBuyerVerificationFailure: Callback,
      onCardNonceRequestSuccess: Callback,
      onCardEntryCancel: Callback
    ) {
      this.onCardNonceRequestSuccess = onCardNonceRequestSuccess
      this.onCardEntryCancel = onCardEntryCancel
      SQIPBuyer.prepareBuyerVerification(
        locationId,
        buyerAction,
        money,
        contact,
        onBuyerVerificationSuccess,
        onBuyerVerificationFailure,
      )
      preparedVerificationScheduled = false
      if (activity != null) {
        CardEntry.startGiftCardEntryActivity(activity!!);
      }
    }

    //React Method
    public fun updateOnCardNonceRequestSuccessCallback(
      onCardNonceRequestSuccess: Callback
    ) {
      this.onCardNonceRequestSuccess = onCardNonceRequestSuccess
    }

    //internal
    public fun invalidateModuleState() {
      this.onCardEntryComplete = null
      this.onCardNonceRequestSuccess = null
      this.onCardEntryCancel = null
      this.collectPostalCode = null
    }

    private fun onCardEntryCompleteCallback() {
      onCardEntryComplete?.invoke(null)
      onCardEntryComplete = null
      //invalidate callbacks
      onCardEntryComplete=null
      onCardNonceRequestSuccess=null
      onCardEntryCancel = null
    }

    private fun onCardNonceRequestSuccessCallback(cardDetails: WritableMap) {
      onCardNonceRequestSuccess?.invoke(cardDetails)
      onCardNonceRequestSuccess = null
    }

    private fun onCardEntryCancelCallback() {
      //if cancel when is processing by de backend, finish the latch
      if (this.countDownLatch != null) {
        this.reference.set(CardEntryActivityCommand.Finish())
        this.countDownLatch?.countDown()
      }
      SQIPBuyer.clearPreparedBuyerVerification()
      //invalidate callbacks
      onCardEntryComplete=null
      onCardNonceRequestSuccess=null
      onCardEntryCancel?.invoke(null)
      onCardEntryCancel = null
    }

    private fun schedulePreparedBuyerVerification(nonce: String) {
      if (preparedVerificationScheduled) return
      preparedVerificationScheduled = true
      val delayDurationMs = readCardEntryCloseExitAnimationDurationMs()
      mainLooperHandler.postDelayed({
        if (SQIPBuyer.isPrepared()) {
          SQIPBuyer.reVerifyBuyer(nonce)
        }
        preparedVerificationScheduled = false
      }, delayDurationMs)
    }

    private fun readCardEntryCloseExitAnimationDurationMs(): Long {
      var delayDurationMs = 0L
      if (activity == null) return delayDurationMs
      val theme = activity!!.resources.newTheme()
      theme.applyStyle(R.style.sqip_ThemeCardEntry, true)
      val attrs = intArrayOf(android.R.attr.activityCloseExitAnimation)
      val typedArray = theme.obtainStyledAttributes(
        null,
        attrs,
        android.R.attr.windowAnimationStyle,
        0
      )
      val resId = typedArray.getResourceId(0, -1)
      if (resId != -1) {
        try {
          val animation = android.view.animation.AnimationUtils.loadAnimation(activity, resId)
          delayDurationMs = animation.duration
        } catch (_: Resources.NotFoundException) {
        }
      }
      typedArray.recycle()
      return delayDurationMs
    }
  }
}
