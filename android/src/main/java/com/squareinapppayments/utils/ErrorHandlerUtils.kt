package com.squareinapppayments.utils

import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONException
import org.json.JSONObject
import com.squareinapppayments.R

class ErrorHandlerUtils {
  companion object {
    const val USAGE_ERROR = "USAGE_ERROR"

    fun getPluginErrorMessage(pluginErrorCode: String): String {
      return String.format(
        R.string.sqip_react_developer_error_message.toString(),
        pluginErrorCode
      )
    }

    fun getCallbackErrorObject(
      code: String,
      message: String,
      debugCode: String,
      debugMessage: String
    ): WritableMap {
      val errorObject: WritableMap = WritableNativeMap()
      errorObject.putString("code", code)
      errorObject.putString("message", message)
      errorObject.putString("debugCode", debugCode)
      errorObject.putString("debugMessage", debugMessage)
      return errorObject
    }

    fun createNativeModuleError(nativeModuleErrorCode: String, debugMessage: String): String {
      return serializeErrorToJson(
        nativeModuleErrorCode,
        getPluginErrorMessage(nativeModuleErrorCode),
        debugMessage
      )
    }

    private fun serializeErrorToJson(debugCode: String, message: String, debugMessage: String): String {
      val errorData = JSONObject()
      return try {
        errorData.put("debugCode", debugCode)
        errorData.put("message", message)
        errorData.put("debugMessage", debugMessage)
        errorData.toString()
      } catch (ex: JSONException) {
        "{ 'message': 'failed to serialize error'}"
      }
    }
  }
}
