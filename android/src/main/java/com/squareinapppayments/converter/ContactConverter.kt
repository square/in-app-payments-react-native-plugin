package com.squareinapppayments.converter

import com.facebook.react.bridge.ReadableMap
import sqip.Contact
import sqip.Country

class ContactConverter {
  companion object {
    fun getContact(contactMap: ReadableMap): Contact {
      val givenName =
        if (contactMap.hasKey("givenName"))
          contactMap.getString("givenName") ?: ""
        else ""

      val familyName =
        if (contactMap.hasKey("familyName"))
          contactMap.getString("familyName") ?: ""
        else ""

      val inputList = if (contactMap.hasKey("addressLines")) {
        contactMap.getArray("addressLines")?.toArrayList() ?: arrayListOf()
      } else {
        arrayListOf()
      }

      val addressLines = inputList.map { it.toString() }

      val city =
        if (contactMap.hasKey("city"))
          contactMap.getString("city") ?: ""
        else ""

      val countryCode =
        if (contactMap.hasKey("countryCode"))
          contactMap.getString("countryCode") ?: "US"
        else "US"

      val email =
        if (contactMap.hasKey("email"))
          contactMap.getString("email") ?: ""
        else ""

      val phone =
        if (contactMap.hasKey("phone"))
          contactMap.getString("phone") ?: ""
        else ""

      val postalCode =
        if (contactMap.hasKey("postalCode"))
          contactMap.getString("postalCode") ?: ""
        else ""

      val region =
        if (contactMap.hasKey("region"))
          contactMap.getString("region") ?: ""
        else ""

      val country = try {
        Country.valueOf(countryCode)
      } catch (_: IllegalArgumentException) {
        Country.US
      }

      return Contact.Builder()
        .familyName(familyName)
        .email(email)
        .addressLines(ArrayList(addressLines))
        .city(city)
        .countryCode(country)
        .postalCode(postalCode)
        .phone(phone)
        .region(region)
        .build(givenName)
    }
  }
}
