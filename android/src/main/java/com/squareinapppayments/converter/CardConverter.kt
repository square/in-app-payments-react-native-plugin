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
import sqip.Card

class CardConverter {
  companion object {  
    private val brandStringMap: Map<Card.Brand, String> = Card.Brand.values().associateWith { brand ->
      when (brand) {
        Card.Brand.OTHER_BRAND -> "OTHER_BRAND"
        Card.Brand.VISA -> "VISA"
        Card.Brand.MASTERCARD -> "MASTERCARD"
        Card.Brand.AMERICAN_EXPRESS -> "AMERICAN_EXPRESS"
        Card.Brand.DISCOVER -> "DISCOVER"
        Card.Brand.DISCOVER_DINERS -> "DISCOVER_DINERS"
        Card.Brand.JCB -> "JCB"
        Card.Brand.CHINA_UNION_PAY -> "CHINA_UNION_PAY"
        Card.Brand.SQUARE_GIFT_CARD -> "SQUARE_GIFT_CARD"
        else -> throw RuntimeException("Unexpected brand value: ${brand.name}")
      }
    }

    private val typeStringMap: Map<Card.Type, String> = Card.Type.values().associateWith { type ->
      when (type) {
        Card.Type.DEBIT -> "DEBIT"
        Card.Type.CREDIT -> "CREDIT"
        Card.Type.UNKNOWN -> "UNKNOWN"
        else -> throw RuntimeException("Unexpected card type value: ${type.name}")
      }
    }

    private val prepaidTypeStringMap: Map<Card.PrepaidType, String> =
      Card.PrepaidType.values().associateWith { prepaidType ->
        when (prepaidType) {
          Card.PrepaidType.PREPAID -> "PREPAID"
          Card.PrepaidType.NOT_PREPAID -> "NOT_PREPAID"
          Card.PrepaidType.UNKNOWN -> "UNKNOWN"
          else -> throw RuntimeException("Unexpected card prepaidType value: ${prepaidType.name}")
        }
      }

    fun toMapObject(card: Card): WritableMap {
      return WritableNativeMap().apply {
        putString("brand", brandStringMap[card.brand])
        putString("lastFourDigits", card.lastFourDigits)
        putInt("expirationMonth", card.expirationMonth)
        putInt("expirationYear", card.expirationYear)
        putString("postalCode", card.postalCode)
        putString("type", typeStringMap[card.type])
        putString("prepaidType", prepaidTypeStringMap[card.prepaidType])
      }
    }
  }
}
