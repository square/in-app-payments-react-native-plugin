/*
 Copyright 2019 Square Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
package sqip.react.internal;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import org.json.JSONException;
import org.json.JSONObject;
import sqip.react.R;

final public class ErrorHandlerUtils {
  public static final String USAGE_ERROR = "USAGE_ERROR";

  public static String getPluginErrorMessage(String pluginErrorCode) {
    return String.format(String.valueOf(R.string.sqip_react_developer_error_message), pluginErrorCode);
  }

  public static WritableMap getCallbackErrorObject(String code, String message, String debugCode, String debugMessage) {
    WritableMap errorObject = new WritableNativeMap();
    errorObject.putString("code", code);
    errorObject.putString("message", message);
    errorObject.putString("debugCode", debugCode);
    errorObject.putString("debugMessage", debugMessage);
    return errorObject;
  }

  public static String createNativeModuleError(String nativeModuleErrorCode, String debugMessage) {
    return serializeErrorToJson(
        nativeModuleErrorCode,
        getPluginErrorMessage(nativeModuleErrorCode),
        debugMessage);
  }

  private static String serializeErrorToJson(String debugCode, String message, String debugMessage) {
    JSONObject errorData = new JSONObject();
    try {
      errorData.put("debugCode", debugCode);
      errorData.put("message", message);
      errorData.put("debugMessage", debugMessage);
    } catch (JSONException ex) {
      return "{ 'message': 'failed to serialize error'}";
    }

    return errorData.toString();
  }
}
