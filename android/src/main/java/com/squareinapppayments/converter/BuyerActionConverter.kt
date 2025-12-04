package com.squareinapppayments.converter

import com.facebook.react.bridge.ReadableMap
import sqip.BuyerAction
import sqip.Money

class BuyerActionConverter {
  companion object {
    fun getBuyerAction(buyerActionString: String, money: Money): BuyerAction {
      var buyerAction: BuyerAction;
      if (buyerActionString.equals("Store")) {
        buyerAction = BuyerAction.Store();
      } else {
        buyerAction = BuyerAction.Charge(money);
      }
      return buyerAction;
    }
  }
}