package com.squareinapppayments.converter

import com.facebook.react.bridge.ReadableMap
import sqip.Money
import sqip.Currency

class MoneyConverter {
  companion object {
    fun getMoney(moneyMap: ReadableMap): Money {
      var amount = moneyMap.getInt("amount");
      var currencyCode = moneyMap.getString("currencyCode");
      return Money(amount, Currency.valueOf(currencyCode ?: "USD"));
    }
  }
}