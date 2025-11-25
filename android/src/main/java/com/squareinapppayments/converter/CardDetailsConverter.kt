/*
 Copyright 2022 Square Inc.

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
package com.squareinapppayments.converter

import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import sqip.CardDetails

class CardDetailsConverter {
  companion object {
    fun toMapObject(cardDetails: CardDetails?): WritableMap {
      if (cardDetails == null) return WritableNativeMap()
      return WritableNativeMap().apply {
        putString("nonce", cardDetails.nonce)
        putMap("card", CardConverter.toMapObject(cardDetails.card))
      }
    }
  }
}