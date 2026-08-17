# In-App Payments SDK React Native Plugin Technical Reference

This technical reference outlines the methods available in the React Native plugin for the In-App Payments SDK. For comprehensive documentation on the In-App Payments SDK, visit [this link](https://developer.squareup.com/docs/in-app-payments-sdk/what-it-does).

---

* [Methods at a glance](#methods-at-a-glance)
* [Method details](#method-details)
* [Callback functions](#callback-functions)
* [Objects](#objects)
* [Constants](#constants)
* [Errors](#errors)

---


## Methods at a glance


### Card entry methods
Method                                                       | Return Object             | Description
:----------------------------------------------------------- | :------------------------ | :------------------------------
[setSquareApplicationId](#setsquareapplicationid)            | void                      | Sets the Square Application ID.
[getSquareApplicationId](#getsquareapplicationid)            | String or null            | Returns the Square Application ID previously set on the SDK.
[startCardEntryFlow](#startcardentryflow)                    | void                      | Displays a full-screen card entry view.
[startCardEntryFlowWithBuyerVerification](#startcardentryflowwithbuyerverification) | void | Displays a full-screen card entry view, then runs buyer verification on the collected nonce.
[startGiftCardEntryFlow](#startgiftcardentryflow)            | void                      | Displays a full-screen Square gift card entry view.
[startGiftCardEntryFlowWithBuyerVerification](#startgiftcardentryflowwithbuyerverification) | void | Displays a gift card entry view, then runs buyer verification on the collected nonce.
[completeCardEntry](#completecardentry)                      | void                      | Closes the card entry form on success.
[showCardNonceProcessingError](#showcardnonceprocessingerror)| void                      | Shows an error in the card entry form without closing the form.
[setIOSCardEntryTheme](#setioscardentrytheme)                | void                      | Sets the customization theme for the card entry view controller in the native layer.

### Buyer verification methods
Method                                                       | Return Object             | Description
:----------------------------------------------------------- | :------------------------ | :------------------------------
[startBuyerVerificationFlow](#startBuyerVerificationFlow)    | void                      | Starts 3DS for an existing card-on-file ID or nonce. Lives on `SQIPBuyer`.
[setMockBuyerVerificationSuccess](#setmockbuyerverificationsuccess) | void               | Testing helper that fakes a successful verification. Do not use in production.

### Apple Pay methods
Method                                                          | Return Object             | Description
:-------------------------------------------------------------- | :------------------------ | :-------------------------------
[setSquareApplicationId](#setsquareapplicationid)               | void                      | Sets the Square Application ID.
[initializeApplePay](#initializeapplepay)                       | void                      | Initializes the In-App Payments React Native plugin for Apple Pay.
[canUseApplePay](#canuseapplepay)                               | bool                      | Returns `true` if the device supports Apple Pay and the user has added at least one card that Square supports.
[requestApplePayNonce](#requestapplepaynonce)                   | void                      | Starts the Apple Pay payment authorization and returns a nonce based on the authorized Apple Pay payment token.
[requestApplePayNonceWithBuyerVerification](#requestapplepaynoncewithbuyerverification) | void | Starts Apple Pay, then runs buyer verification on the collected nonce.
[completeApplePayAuthorization](#completeapplepayauthorization) | void                      | Notifies the native layer to close the Apple Pay sheet with success or failure status.


### Google Pay methods
Method                                                       | Return Object                     | Description
:----------------------------------------------------------- | :-------------------------------- | :-------------------------------------
[setSquareApplicationId](#setsquareapplicationid)            | void                              | Sets the Square Application ID.
[initalizeGooglePay](#initializegooglepay)                   | void                              | Initializes the React Native plugin for Google Pay.
[canUseGooglePay](#canusegooglepay)                          | bool                              | Returns `true` if the device supports Google Pay and the user has added at least one card that Square supports.
[requestGooglePayNonce](#requestgooglepaynonce)              | void                              | Starts the Google Pay payment authorization and returns a nonce based on the authorized Google Pay payment token.
[requestGooglePayNonceWithBuyerVerification](#requestgooglepaynoncewithbuyerverification) | void | Starts Google Pay, then runs buyer verification on the collected nonce.




## Method details

### setSquareApplicationId

Used to set a Square Application ID on the `InAppPaymentsSDK` object.

---
**Note:** This method must be called before any other operations.

---

Parameter      | Type    | Description
:------------- | :------ | :-----------
applicationId  | String  | The Square Application ID otained from the developer portal


#### Example usage

```javascript

import {
  SQIPCore
} from 'react-native-square-in-app-payments';

await SQIPCore.setSquareApplicationId('APPLICATION_ID');
```


---
### getSquareApplicationId

Returns the Square Application ID previously passed to [setSquareApplicationId](#setsquareapplicationid), or `null` if none has been set.

Lives on `SQIPCore`.

#### Example usage

```javascript
import {
  SQIPCore
} from 'react-native-square-in-app-payments';

const applicationId = SQIPCore.getSquareApplicationId();
```


---
### startCardEntryFlow

Displays a full-screen card entry view. The method takes one configuration object and two call back parameters which correspond
to the possible results of the request.

In 2.x the preferred signature is `startCardEntryFlow(collectPostalCode, onCardNonceRequestSuccess, onCardEntryCancel)`. The `cardEntryConfig` first-argument form is still accepted but deprecated.

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
collectPostalCode *or* cardEntryConfig | Boolean *or* [cardEntryConfig](#cardentryconfig)                         | `true`/`false` to collect postal code, or a config object (deprecated). Pass `null` for default configuration in the deprecated form.
onCardNonceRequestSuccess          | [cardEntryNonceRequestSuccessCallback](#cardentrynoncerequestsuccesscallback) | Invoked when card entry is completed and the SDK has processed the payment card information.
onCardEntryCancel                  | [cardEntryCancelCallback](#cardentrycancelcallback)                           | Invoked when card entry is canceled.

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

await SQIPCardEntry.startCardEntryFlow(
  true, // collectPostalCode
  (cardDetails) => { ... }, // onCardNonceRequestSuccess
  () => { ... }, // onCardEntryCancel
);
```


---
### startGiftCardEntryFlow

Displays a full-screen Square gift card entry view. Same callbacks as [startCardEntryFlow](#startcardentryflow).

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
onCardNonceRequestSuccess          | [cardEntryNonceRequestSuccessCallback](#cardentrynoncerequestsuccesscallback) | Invoked when gift card entry is completed and the SDK has processed the gift card information.
onCardEntryCancel                  | [cardEntryCancelCallback](#cardentrycancelcallback)                           | Invoked when gift card entry is canceled.

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

await SQIPCardEntry.startGiftCardEntryFlow(
  (cardDetails) => { ... }, // onCardNonceRequestSuccess
  () => { ... }, // onCardEntryCancel
);
```


---
### startCardEntryFlowWithBuyerVerification

Displays a full-screen card entry view, then runs buyer verification (3DS) on the nonce of the card the buyer entered. This is the combined collect-then-verify flow: the plugin collects the card first, then verifies **that** card. Do not pass a `paymentSourceId`; verification always uses the collected nonce.

`cardEntryConfig` is reused as the container for buyer-verification parameters (`squareLocationId`, `buyerAction`, `amount`/`currencyCode`, and buyer contact fields). Those fields are required for any verification call, including this combined method.

On success, `onBuyerVerificationSuccess` receives `{ nonce, card, token }`. Charge on your backend with `source_id` = nonce and `verification_token` = token.

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
collectPostalCode                  | Boolean                                                                       | Whether to collect the postal code on the card entry form.
cardEntryConfig                    | [cardEntryConfig](#cardentryconfig)                                           | Card entry plus buyer-verification parameters. Must include `squareLocationId`, `buyerAction`, `amount`, `currencyCode`, and buyer contact fields.
onBuyerVerificationSuccess | [BuyerVerificationSuccessCallback](#BuyerVerificationSuccessCallback) | Invoked when card entry and buyer verification complete successfully.
onBuyerVerificationFailure | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback) | Invoked when card entry with buyer verification encounters errors.
onCardEntryCancel                  | [cardEntryCancelCallback](#cardentrycancelcallback)                           | Invoked when card entry is canceled.

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

const cardEntryConfig = {
  collectPostalCode: true,
  squareLocationId: SQUARE_LOCATION_ID,
  buyerAction: 'Charge',
  amount: 100,
  currencyCode: 'USD',
  givenName: 'John',
  familyName: 'Doe',
  addressLines: ['London Eye', 'Riverside Walk'],
  city: 'London',
  countryCode: 'GB',
  email: 'johndoe@example.com',
  phone: '8001234567',
  postalCode: 'SE1 7'
};

await SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
  true, // collectPostalCode
  cardEntryConfig,
  (buyerVerificationDetails) => {
    // Charge with buyerVerificationDetails.nonce and buyerVerificationDetails.token
  },
  (errorInfo) => { ... }, // onBuyerVerificationFailure
  undefined, // onCardNonceRequestSuccess is unused; card entry auto-completes
  () => { ... }, // onCardEntryCancel
);
```



---
### startGiftCardEntryFlowWithBuyerVerification

Displays a full-screen Square gift card entry view, then runs buyer verification (3DS) on the nonce of the gift card the buyer entered. Same collect-then-verify order as [startCardEntryFlowWithBuyerVerification](#startcardentryflowwithbuyerverification). Do not pass a `paymentSourceId`.

`cardEntryConfig` carries the buyer-verification parameters. See [cardEntryConfig](#cardentryconfig).

On success, `onBuyerVerificationSuccess` receives `{ nonce, card, token }`. Charge on your backend with `source_id` = nonce and `verification_token` = token.

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
cardEntryConfig                    | [cardEntryConfig](#cardentryconfig)                                           | Buyer-verification parameters. Must include `squareLocationId`, `buyerAction`, `amount`, `currencyCode`, and buyer contact fields.
onBuyerVerificationSuccess | [BuyerVerificationSuccessCallback](#BuyerVerificationSuccessCallback) | Invoked when gift card entry and buyer verification complete successfully.
onBuyerVerificationFailure | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback) | Invoked when gift card entry with buyer verification encounters errors.
onCardEntryCancel                  | [cardEntryCancelCallback](#cardentrycancelcallback)                           | Invoked when gift card entry is canceled.

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

await SQIPCardEntry.startGiftCardEntryFlowWithBuyerVerification(
  cardEntryConfig,
  (buyerVerificationDetails) => {
    // Charge with buyerVerificationDetails.nonce and buyerVerificationDetails.token
  },
  (errorInfo) => { ... },
  undefined, // onCardNonceRequestSuccess is unused; gift card entry auto-completes
  () => { ... }, // onCardEntryCancel
);
```


---
### completeCardEntry

Called in the `onCardNonceRequestSuccess` callback. Closes the card entry form. 

Parameter       | Type                                     | Description
:-------------- | :--------------------------------------- | :-----------
onCardEntryComplete | [cardEntryCompleteCallback](#cardentrycompletecallback)| The callback invoked when card entry is completed and is closed. 


`completeCardEntry` should be called after all other callback logic is executed. 
If callback logic makes a server call to process the supplied nonce, 
this method is called after getting a success response from the server.  

If any nonce processing logic is to be executed _after_ the card entry form is closed, 
call `completeCardEntry` after getting the card nonce from the `onCardNonceRequestSuccess` 
`cardDetails` parameter. 

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

/**
* cardEntryNonceRequestSuccessCallback
*/
async onCardNonceRequestSuccess(cardDetails) {
  ...
  // payment finished successfully
  // you must call this method to close card entry
  await SQIPCardEntry.completeCardEntry(
    () => {},  // onCardEntryComplete
  );
}
```


---
### showCardNonceProcessingError

Called in the `onCardNonceRequestSuccess` callback. Returns execution to the card entry form 
with an error string to be shown in the form. 

`showCardNonceProcessingError` should be called after all other callback logic is executed. 
If callback logic makes a server call to request a payment with the supplied nonce, 
this method is called after getting an error response from the server call.  


Parameter       | Type       | Description
:-------------- | :--------- | :-----------
errorMessage    | String     | The error message to be shown in the card entry form.

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

/**
* cardEntryNonceRequestSuccessCallback
*/
async onCardNonceRequestSuccess(cardDetails) {
  ...
  // payment failed to complete due to error
  // notify card entry to show processing error
  await SQIPCardEntry.showCardNonceProcessingError(errorMessage);
}
```


---
### setIOSCardEntryTheme
**iOS Only**

Sets the customization theme for the card entry view controller in the native layer.

It is not necessary to call this method before starting Apple Pay. The SDK provides a default 
theme which can be customized to match the theme of your app. 

Parameter          | Type                                    | Description
:----------------- |:--------------------------------------- |:-----------
themeConfiguration | [IOSTheme](#iostheme)                   | An object that defines the theme of an iOS card entry view controller.

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

...
if (Platform.OS === 'ios') {
  await SQIPCardEntry.setIOSCardEntryTheme({
    saveButtonFont: {
      size: 30,
    },
    saveButtonTitle: 'Pay 💳 ',
    keyboardAppearance: 'Light',
    saveButtonTextColor: {
      r: 213,
      g: 133,
      b: 12,
      a: 0.9,
    },
  });
}
```


---
### startBuyerVerificationFlow

Starts buyer verification for a **given** payment source ID. Use this when you already have a card-on-file ID or a nonce (for example from `startCardEntryFlow` or `requestApplePayNonce`) and need to run 3DS on it separately.

This is the two-step flow: collect a nonce first, then verify that nonce. For a single combined call, use [startCardEntryFlowWithBuyerVerification](#startcardentryflowwithbuyerverification), [startGiftCardEntryFlowWithBuyerVerification](#startgiftcardentryflowwithbuyerverification), [requestApplePayNonceWithBuyerVerification](#requestapplepaynoncewithbuyerverification), or [requestGooglePayNonceWithBuyerVerification](#requestgooglepaynoncewithbuyerverification) instead.

In 2.x this method lives on `SQIPBuyer` (`SQIPCardEntry.startBuyerVerificationFlow` is deprecated).

Please see [Verify a buyer](https://developer.squareup.com/docs/in-app-payments-sdk/verify-buyer) for more detailed documentation on this flow.

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
paymentSourceId                    | String                                                                        | A card-on-file ID (`ccof:...`) of the buyer's stored card, or a nonce (`cnon:...`) previously obtained from card entry or a digital wallet. The sandbox value `ccof:customer-card-id-requires-verification` can be used for **testing only** — it is not a production default.
cardEntryConfig                    | [cardEntryConfig](#cardentryconfig)                                           | Buyer-verification parameters: `squareLocationId`, `buyerAction`, `amount`/`currencyCode`, and buyer contact fields. `collectPostalCode` is unused here.
onBuyerVerificationSuccess | [BuyerVerificationSuccessCallback](#BuyerVerificationSuccessCallback) | Invoked when buyer verification completes successfully.
onBuyerVerificationFailure | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback) | Invoked when buyer verification encounters errors.

#### Example usage for a charge

```javascript
import {
  SQIPBuyer
} from 'react-native-square-in-app-payments';

// Production: a real card-on-file ID or a nonce from card entry / Apple Pay / Google Pay.
// Sandbox testing only: 'ccof:customer-card-id-requires-verification'
const paymentSourceId = 'cnon:...';
const cardEntryConfig = {
  collectPostalCode: true,
  squareLocationId: SQUARE_LOCATION_ID,
  buyerAction: 'Charge', // Either Charge or Store, depending on your usage.
  amount: 100,
  currencyCode: 'USD',
  givenName: 'John',
  familyName: 'Doe',
  addressLines: ['London Eye', 'Riverside Walk'],
  city: 'London',
  countryCode: 'GB',
  email: 'johndoe@example.com',
  phone: '8001234567',
  postalCode: 'SE1 7'
};

await SQIPBuyer.startBuyerVerificationFlow(
  paymentSourceId,
  cardEntryConfig,
  (buyerVerificationDetails) => { ... }, // onBuyerVerificationSuccess
  (errorInfo) => { ... }, // onBuyerVerificationFailure
);
```

---
### setMockBuyerVerificationSuccess

**Testing only.** Causes the next buyer-verification attempt to report success with a mock nonce and token, without running real 3DS. Do not ship this in production — it hides real verification failures and will not produce a token the Payments API accepts.

Lives on `SQIPBuyer`.

Parameter                       | Type     | Description
:------------------------------ | :------- | :-----------
mockBuyerVerificationSuccess    | Boolean  | `true` to fake success; `false` to use real buyer verification.

#### Example usage

```javascript
import {
  SQIPBuyer
} from 'react-native-square-in-app-payments';

// Development / automated tests only
SQIPBuyer.setMockBuyerVerificationSuccess(true);
```

--- 

### initializeApplePay

**iOS Only**

Initializes the In-App Payments React Native plugin for Apple Pay. 

This is a method called only once when React Native app is being initialized on an iOS device. 
Call this method only on an iOS device and when your app is intended to support Apple Pay.

Parameter          | Type          | Description
:----------------- | :------------ | :-----------
applePayMerchantId | String        | Registered Apple Pay merchant ID

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

...
  if (Platform.OS === 'ios') {
    await SQIPApplePay.initializeApplePay('APPLE_PAY_MERCHANT_ID');
  }
...
```


---

### canUseApplePay
**iOS Only**

Returns `true` if the device supports Apple Pay and the user has added at least one card that Square supports.
Not all brands supported by Apple Pay are supported by Square.

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

...
  if (Platform.OS === 'ios') {
    let digitalWalletEnabled = await SQIPApplePay.canUseApplePay();
  }
...
```


---
### requestApplePayNonce
**iOS Only**

Starts the Apple Pay payment authorization and returns a nonce based on the authorized Apple Pay payment token.

Parameter       | Type                                     | Description
:-------------- | :--------------------------------------- | :-----------
applePayConfig  | [applePayConfig](#applePayConfig)        | Configuration for Apple Pay
onApplePayNonceRequestSuccess | [applePayNonceRequestSuccessCallback](#applepaynoncerequestsuccesscallback) | Invoked before Apple Pay sheet is closed. The success callback carries the generated nonce
onApplePayNonceRequestFailure| [applePayNonceRequestFailureCallback](#applepaynoncerequestfailurecallback) | Invoked before Apple Pay sheet is closed. The failure callback carries information about the failure.
onApplePayComplete | [applePayCompleteCallback](#applepaycompletecallback) | Invoked when Apple Pay sheet is closed after success, failure, or cancellation.

Throws [InAppPaymentsException](#inapppaymentsexception)


#### Example usage

```javascript
import {
  Platform
} from 'react-native';

import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

if (Platform.OS === 'ios') {
  const applePayConfig = {
    price: '1.00',
    summaryLabel: 'Test Item',
    countryCode: 'US',
    currencyCode: 'USD',
    paymentType: SQIPApplePay.PaymentTypeFinal,
  };
  try{ 
    await SQIPApplePay.requestApplePayNonce(
      applePayConfig,
      (cardDetails) => { ... }, // onApplePayNonceRequestSuccess
      (errorInfo) => { ... }, // onApplePayNonceRequestFailure
      () => { ... }, // onApplePayComplete
    );
  } catch(ex) {
    // handle InAppPaymentsException
  }
}
```


---
### requestApplePayNonceWithBuyerVerification
**iOS Only**

Starts the Apple Pay payment authorization, then runs buyer verification (3DS) on the nonce of the card the buyer authorized. This is the combined collect-then-verify flow: the plugin collects the Apple Pay nonce first, then verifies **that** nonce. Do not pass a `paymentSourceId`.

`cardEntryConfig` is reused as the container for buyer-verification parameters (`squareLocationId`, `buyerAction`, `amount`/`currencyCode`, and buyer contact fields). `applePayConfig` configures the Apple Pay sheet itself.

On success, `onBuyerVerificationSuccess` receives `{ nonce, card, token }`. Charge on your backend with `source_id` = nonce and `verification_token` = token.

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
cardEntryConfig                    | [cardEntryConfig](#cardentryconfig)                                           | Buyer-verification parameters. Must include `squareLocationId`, `buyerAction`, `amount`, `currencyCode`, and buyer contact fields.
applePayConfig                     | [applePayConfig](#applePayConfig)                                             | Configuration for the Apple Pay sheet.
onBuyerVerificationSuccess | [BuyerVerificationSuccessCallback](#BuyerVerificationSuccessCallback) | Invoked when Apple Pay and buyer verification complete successfully.
onBuyerVerificationFailure | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback) | Invoked when buyer verification encounters errors.
onApplePayNonceRequestFailure| [applePayNonceRequestFailureCallback](#applepaynoncerequestfailurecallback) | Invoked if Apple Pay fails to produce a nonce.
onApplePayComplete | [applePayCompleteCallback](#applepaycompletecallback) | Invoked when the Apple Pay sheet is closed after cancellation (verification success uses `onBuyerVerificationSuccess` instead).

Throws [InAppPaymentsException](#inapppaymentsexception)

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

if (Platform.OS === 'ios') {
  const cardEntryConfig = {
    collectPostalCode: true,
    squareLocationId: SQUARE_LOCATION_ID,
    buyerAction: 'Charge',
    amount: 100,
    currencyCode: 'USD',
    givenName: 'John',
    familyName: 'Doe',
    addressLines: ['London Eye', 'Riverside Walk'],
    city: 'London',
    countryCode: 'GB',
    email: 'johndoe@example.com',
    phone: '8001234567',
    postalCode: 'SE1 7'
  };
  const applePayConfig = {
    price: '1.00',
    summaryLabel: 'Test Item',
    countryCode: 'US',
    currencyCode: 'USD',
    paymentType: SQIPApplePay.PaymentTypeFinal,
  };
  try {
    await SQIPApplePay.requestApplePayNonceWithBuyerVerification(
      cardEntryConfig,
      applePayConfig,
      (buyerVerificationDetails) => {
        // Charge with buyerVerificationDetails.nonce and buyerVerificationDetails.token
      },
      (errorInfo) => { ... },
    );
  } catch(ex) {
    // handle InAppPaymentsException
  }
}
```


---
### completeApplePayAuthorization
**iOS Only**

Notifies the native layer to close the Apple Pay sheet with success or failure status.

Parameter                     | Type         | Description
:---------------------------- | :----------- | :-----------
isSuccess                     | bool         | Indicates success or failure.
**Optional**: errorMessage    | String       | The error message that Apple Pay displays in the native layer card entry view controller. 

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

/**
 * Callback when the apple pay sheet is closed after
 * call completeApplePayAuthorization or user tap to close apple pay sheet manually
 */
onApplePayEntryComplete() {
  // handle the apple pay sheet closed event
}

/**
 * Callback when successfully get the card nonce details for processig
 * apple pay sheet is still open and waiting for processing card nonce details
 * @param cardDetails
 */
async onApplePayNonceRequestSuccess(cardDetails) {
  try {
    // take payment with the card nonce details
    // you can take a charge
    // await chargeCard(cardDetails);

    // you must call completeApplePayAuthorization to close apple pay sheet
    await SQIPApplePay.completeApplePayAuthorization(true);
  } catch (ex) {
    // handle card nonce processing failure

    // you must call completeApplePayAuthorization to close apple pay sheet
    await SQIPApplePay.completeApplePayAuthorization(false, ex.message);
  }
}

/**
 * Callback when failed to get the card nonce
 * apple pay sheet is still open and waiting for processing error information
 */
async onApplePayNonceRequestFailure(errorInfo) {
  // handle this error before close the apple pay sheet

  // you must call completeApplePayAuthorization to close apple pay sheet
  await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message);
}
```


---
### initializeGooglePay
**Android Only**

**Optional**: Used to enable Google Pay in an Android app. Initialize React Native plugin for google pay. 
This is a method called only once when React Native app is being initialized on an Android device. 

---
Note: The location ID is found in the Square developer dashboard, on the **locations** page.

---

Parameter          | Type            | Description
:----------------- | :-------------- | :-----------------------------------------------
squareLocationId   | String          | The Square Location ID from the developer portal. 
environment        | Int             | Specifies the Google Pay environment to run Google Pay in: [Test or Production](#google-pay-environment-values)



#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPGooglePay
} from 'react-native-square-in-app-payments';

...
if (Platform.OS === 'android') {
  await SQIPGooglePay.initializeGooglePay('SQUARE_LOCATION_ID', SQIPGooglePay.EnvironmentTest);
}
```


---
### canUseGooglePay
**Android Only**

Returns true if the device supports Google Pay and the user has added at least one 
card that Square supports. Square doesn't support all the brands apple pay supports.

* **Google Pay supported**: returns `true`.
* **Google Pay not supported**: returns `false`.

Throws [InAppPaymentsException](#inapppaymentsexception)

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPGooglePay
} from 'react-native-square-in-app-payments';

...
if (Platform.OS === 'android') {
  try {
    let digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay();
  } catch (ex) {
    // handle InAppPaymentsException
  }
}
```


---
### requestGooglePayNonce
**Android Only**

Starts the Google Pay payment authorization and returns a nonce based on the authorized Google Pay payment token.

Parameter                      | Type                                   | Description
:----------------------------- | :------------------------------------- | :-----------
googlePayConfig                | [googlePayConfig](#googlePayConfig)     | Configuration for Google Pay
onGooglePayNonceRequestSuccess | [googlePayNonceRequestSuccessCallback](#googlepaynoncerequestsuccesscallback)| Success callback invoked when a nonce is available.
onGooglePayNonceRequestFailure | [googlePayNonceRequestFailureCallback](#googlepaynoncerequestfailurecallback) |Failure callback invoked when SDK failed to produce a nonce.
onGooglePayCanceled | [googlePayCancelCallback](#googlepaycancelcallback) | Cancel callback invoked when user cancels payment authorization.


Throws [InAppPaymentsException](#inapppaymentsexception)
#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPGooglePay
} from 'react-native-square-in-app-payments';

...
if (Platform.OS === 'android') {
  const googlePayConfig = {
    price: '1.00',
    currencyCode: 'USD',
    priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
  };
  try {
    await SQIPGooglePay.requestGooglePayNonce(
      googlePayConfig,
      (cardDetails) => { ... }, // onGooglePayNonceRequestSuccess
      (errorInfo) => { ... }, // onGooglePayNonceRequestFailure
      () => { ... }, // onGooglePayCancel
    );
  } catch (ex) {
    // Handle InAppPaymentsException
  }
}
```


---
### requestGooglePayNonceWithBuyerVerification
**Android Only**

Starts the Google Pay payment authorization, then runs buyer verification (3DS) on the nonce of the card the buyer authorized. This is the combined collect-then-verify flow: the plugin collects the Google Pay nonce first, then verifies **that** nonce. Do not pass a `paymentSourceId`.

`cardEntryConfig` is reused as the container for buyer-verification parameters (`squareLocationId`, `buyerAction`, `amount`/`currencyCode`, and buyer contact fields). `googlePayConfig` configures the Google Pay sheet itself.

On success, `onBuyerVerificationSuccess` receives `{ nonce, card, token }`. Charge on your backend with `source_id` = nonce and `verification_token` = token.

Parameter                          | Type                                                                          | Description
:----------------------------------| :---------------------------------------------------------------------------- | :-----------
cardEntryConfig                    | [cardEntryConfig](#cardentryconfig)                                           | Buyer-verification parameters. Must include `squareLocationId`, `buyerAction`, `amount`, `currencyCode`, and buyer contact fields.
googlePayConfig                    | [googlePayConfig](#googlePayConfig)                                           | Configuration for the Google Pay sheet.
onBuyerVerificationSuccess | [BuyerVerificationSuccessCallback](#BuyerVerificationSuccessCallback) | Invoked when Google Pay and buyer verification complete successfully.
onBuyerVerificationFailure | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback) | Invoked when buyer verification encounters errors.
onGooglePayNonceRequestFailure | [googlePayNonceRequestFailureCallback](#googlepaynoncerequestfailurecallback) | Invoked if Google Pay fails to produce a nonce.
onGooglePayCanceled | [googlePayCancelCallback](#googlepaycancelcallback) | Invoked when the buyer cancels Google Pay.

Throws [InAppPaymentsException](#inapppaymentsexception)

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPGooglePay
} from 'react-native-square-in-app-payments';

if (Platform.OS === 'android') {
  const cardEntryConfig = {
    collectPostalCode: true,
    squareLocationId: SQUARE_LOCATION_ID,
    buyerAction: 'Charge',
    amount: 100,
    currencyCode: 'USD',
    givenName: 'John',
    familyName: 'Doe',
    addressLines: ['London Eye', 'Riverside Walk'],
    city: 'London',
    countryCode: 'GB',
    email: 'johndoe@example.com',
    phone: '8001234567',
    postalCode: 'SE1 7'
  };
  const googlePayConfig = {
    price: '1.00',
    currencyCode: 'USD',
    priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
  };
  try {
    await SQIPGooglePay.requestGooglePayNonceWithBuyerVerification(
      cardEntryConfig,
      googlePayConfig,
      (buyerVerificationDetails) => {
        // Charge with buyerVerificationDetails.nonce and buyerVerificationDetails.token
      },
      (errorInfo) => { ... },
      undefined,
      (errorInfo) => { ... },
      () => { ... },
    );
  } catch (ex) {
    // Handle InAppPaymentsException
  }
}
```


---
## Callback functions
### cardEntryNonceRequestSuccessCallback

Callback invoked when card entry is returned successfully with card details.

Parameter       | Type                                     | Description
:-------------- | :--------------------------------------- | :-----------
cardDetails     | [cardDetails](#carddetails)              | The results of a successful card entry 
#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

/**
 * Callback when successfully get the card nonce details for processig
 * card entry is still open and waiting for processing card nonce details
 * @param cardDetails
 */
onCardNonceRequestSuccess(cardDetails) {
  try {
    // take payment with the card details
    // await chargeCard(cardDetails);

    // payment finished successfully
    // you must call this method to close card entry
    SQIPCardEntry.completeCardEntry(
      () => { ... }, // onCardEntryComplete
    );
  } catch (ex) {
    // payment failed to complete due to error
    // notify card entry to show processing error
    SQIPCardEntry.showCardNonceProcessingError(ex.message);
  }
}
```

---
### BuyerVerificationSuccessCallback

Callback invoked when Buyer Verification flow succeeds.


---
### BuyerVerificationErrorCallback

Callback invoked when Buyer Verification flow fails.

---
### cardEntryCancelCallback

Callback invoked when card entry canceled and has been closed. 

Do not call [completeCardEntry](#completecardentry) because the operation is complete and the card entry form is closed.

---


### cardEntryCompleteCallback
Callback invoked when card entry is completed and has been closed.

#### Example usage

```javascript
import {
  SQIPCardEntry
} from 'react-native-square-in-app-payments';

/**
 * Callback when the card entry is closed after call 'SQIPCardEntry.completeCardEntry'
 */
onCardEntryComplete() {
  // Update UI to notify user that the payment flow is completed
}

/**
 * Callback when successfully get the card nonce details for processig
 * card entry is still open and waiting for processing card nonce details
 * @param cardDetails
 */
onCardNonceRequestSuccess(cardDetails) {
  try {
    // take payment with the card details
    // await chargeCard(cardDetails);

    // payment finished successfully
    // you must call this method to close card entry
    SQIPCardEntry.completeCardEntry(
      this.onCardEntryComplete(),
    );
  } catch (ex) {
    // payment failed to complete due to error
    // notify card entry to show processing error
    SQIPCardEntry.showCardNonceProcessingError(ex.message);
  }
}
```


---
### applePayNonceRequestSuccessCallback
**iOS Only**

Callback invoked when Apple Pay card details are available

This is called before the Apple Pay payment authorization sheet is closed. Call [completeApplePayAuthorization](#completeapplepayauthorization) 
to close the apple pay sheet.

Parameter       | Type                         | Description
:-------------- | :--------------------------- | :-----------
cardDetails     | [CardDetails](#carddetails)  | The non-confidential details of the card and a nonce. 


#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

...
/**
 * Callback when successfully get the card nonce details for processig
 * apple pay sheet is still open and waiting for processing card nonce details
 * @param cardDetails
 */
async onApplePayNonceRequestSuccess(cardDetails) {
  try {
    // take payment with the card nonce details
    // await chargeCard(cardDetails);

    // you must call completeApplePayAuthorization to close apple pay sheet
    await SQIPApplePay.completeApplePayAuthorization(true);
  } catch (ex) {
    // handle card nonce processing failure

    // you must call completeApplePayAuthorization to close apple pay sheet
    await SQIPApplePay.completeApplePayAuthorization(false, ex.message);
  }
}
```


---
### applePayNonceRequestFailureCallback
**iOS Only**

Callback invoked when a card nonce cannot be generated from Apple Pay payment authorization card input values.

This callback is invoked before the native iOS Apple Pay payment authorization view controller is closed. Call [completeApplePayAuthorization](#completeapplepayauthorization) with an error message to let the user modify input values and resubmit.

Parameter       | Type                     | Description
:-------------- | :----------------------- | :-----------
error           | [error](#error)              | Information about the error condition that prevented a nonce from being generated. 

#### Example usage

```javascript
import {
  Platform
} from 'react-native';

import {
  SQIPApplePay
} from 'react-native-square-in-app-payments';

/**
 * Callback when failed to get the card nonce
 * apple pay sheet is still open and waiting for processing error information
 */
async onApplePayNonceRequestFailure(errorInfo) {
  // handle this error before close the apple pay sheet

  // you must call completeApplePayAuthorization to close apple pay sheet
  await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message);
}
```


---
### applePayCompleteCallback
**iOS Only**

Callback invoked when the native iOS Apple Pay payment authorization sheet is closed with success, failure, or cancellation.

This callback notifies caller widget when it should switch to other views.


---
### googlePayNonceRequestSuccessCallback
**Android Only**

Callback invoked when [cardDetails](#carddetails) with Google Pay are available.

Parameter       | Type                         | Description
:-------------- | :--------------------------- | :-----------
cardDetails     | [cardDetails](#carddetails)  | The non-confidential details of the card and a nonce. 

#### Example usage

```javascript
import {
  Platform
} from 'react-native';
import {
  SQIPGooglePay
} from 'react-native-square-in-app-payments';

/**
 * Callback when successfully get the card nonce details for processig
 * google pay sheet has been closed when this callback is invoked
 */
async onGooglePayNonceRequestSuccess(cardDetails) {
  try {
    // take payment with the card nonce details
    // await chargeCard(cardDetails);

  } catch (ex) {
    // handle card nonce processing failure
  }
}
```


---
### googlePayNonceRequestFailureCallback
**Android Only**

Callback invoked a card nonce could not be obtained.

Parameter       | Type                     | Description
:-------------- | :----------------------- | :-----------
error           | [error](#error)          | Information about the cause of the error. 


---
### googlePayCancelCallback
**Android Only**

Callback invoked when Google Pay payment authorization is canceled.


---
## Objects

### cardDetails

Represents the result of a successful request to process payment card information.

Field           | Type            | Description
:-------------- | :-------------- | :-----------------
nonce           | String          | A one-time-use payment token that can be used with the Square Connect APIs to charge the card or save the card information.
card            | [Card](#card)   | Non-confidential details about the entered card, such as the brand and last four digits of the card number.

#### Example JSON

```json
{
  "nonce": "CARD_NONCE",
  "card": {
    "brand": "VISA",
    "lastFourDigits": "1111"
  }
}
```

---

### buyerVerificationDetails

Represents the result of a successful buyer verification request.

Field           | Type            | Description
:-------------- | :-------------- | :-----------------
nonce           | String          | A one-time-use payment token that can be used with the Square Connect APIs to charge the card or save the card information.
card            | [Card](#card)   | Non-confidential details about the entered card, such as the brand and last four digits of the card number.
token           | String          | The token representing a verified buyer.

#### Example JSON

```json
{
  "nonce": "CARD_NONCE",
  "card": {
    "brand": "VISA",
    "lastFourDigits": "1111"
  },
  "token": "VERIFICATION_TOKEN"
}
```


---
### card 

Represents the non-confidential details of a card.

Field           | Type                         | Description
:---------------| :--------------------------- | :-----------------
brand           | [Brand](#brand)              | The brand (for example, VISA) of the card.
lastFourDigits  | String                       | The last 4 digits of this card's number.
expirationMonth | int                          | The expiration month of the card. Ranges between 1 and 12, with 1 corresponding to January and 12 to December.
expirationYear  | int                          | The four-digit expiration year of the card.
postalCode      | @nullable String             | The billing postal code associated with the card.
type            | [CardType](#cardtype)        | The type of card (for example, Credit or Debit). <br/>**Note**: This property is experimental and will always return `UNKNOWN`.
prepaidType     | [CardPrepaidType](#cardprepaidType) | The prepaid type of the credit card (for example, a Prepaid Gift Card). <br/>**Note**: This property is experimental and will always return `UNKNOWN`.

#### Example JSON

```json
{
  "brand": "VISA",
  "lastFourDigits": "1111",
  "expirationMonth": 12,
  "expirationYear": 12,
  "postalCode": "98001"
}
```


---
### cardEntryConfig 

Configuration object used in two different ways:

1. **Card entry only** (`startCardEntryFlow`): `collectPostalCode` controls whether the card form asks for a postal code. The other fields are unused.
2. **Buyer verification** (`startCardEntryFlowWithBuyerVerification`, `startGiftCardEntryFlowWithBuyerVerification`, `requestApplePayNonceWithBuyerVerification`, `requestGooglePayNonceWithBuyerVerification`, and `startBuyerVerificationFlow`): this object is **not** about the card-entry screen. It carries the 3DS verification parameters: `squareLocationId`, `buyerAction`, `amount` / `currencyCode`, and the buyer contact fields. That is why Apple Pay and Google Pay also take a `cardEntryConfig` — the name is inherited from 1.x. `collectPostalCode` applies only when a card-entry form is actually shown.

Field              | Type              | Description
:----------------- | :---------------- | :-----------------
collectPostalCode  | Boolean           | Indicates that the customer must enter the postal code associated with their payment card. When false, the postal code field will not be displayed. Defaults to `true`.<br/>**Notes**: A Postal code must be collected for processing payments for Square accounts based in the United States, Canada, and United Kingdom. Disabling postal code collection in those regions will result in all credit card transactions being declined. Unused by wallet and `startBuyerVerificationFlow` calls.
**Optional**:squareLocationId | String | The Square location being verified against. **Required** for any buyer-verification call.
**Optional**:buyerAction      | String | The action (`Charge` or `Store`) that will be performed after retrieving the verification token. **Required** for any buyer-verification call.
**Optional**:amount           | Int    | Payment amount. **Required** for any buyer-verification call.
**Optional**:currencyCode     | String | ISO currency code of the payment amount. **Required** for any buyer-verification call.
**Optional**:givenName        | String | Given name of the contact. **Required** for any buyer-verification call.
**Optional**:familyName       | String | Last name of the contact. **Required** for any buyer-verification call.
**Optional**:addressLines     | Array | The street address lines of the contact address. **Required** for any buyer-verification call.
**Optional**:city             | String | The city name of the contact address. **Required** for any buyer-verification call.
**Optional**:countryCode      | String | A 2-letter string containing the ISO 3166-1 country code of the contact address. **Required** for any buyer-verification call.
**Optional**:email            | String | Email address of the contact. **Required** for any buyer-verification call.
**Optional**:phone            | String | The telephone number of the contact. **Required** for any buyer-verification call.
**Optional**:postalCode       | String | The postal code of the contact address. **Required** for any buyer-verification call.
**Optional**:region           | String | The applicable administrative region (e.g., province, state) of the contact address. **Required** for any buyer-verification call.

#### Example JSON (buyer verification)

```json
{
  "collectPostalCode": true,
  "squareLocationId": "LOCATION_ID",
  "buyerAction": "Charge",
  "amount": 100,
  "currencyCode": "USD",
  "givenName": "John",
  "familyName": "Doe",
  "addressLines": ["London Eye", "Riverside Walk"],
  "city": "London",
  "countryCode": "GB",
  "email": "johndoe@example.com",
  "phone": "8001234567",
  "postalCode": "SE1 7"
}
```


---
### applePayConfig 

Represents the Apple Pay configuration.

Field           | Type              | Description
:---------------| :---------------- | :-----------------
price           | String            | The payment authorization amount as a string.
summaryLabel    | String            | A label that displays the checkout summary in the Apple Pay view.
countryCode     | String            | The Apple Pay country code.
currencyCode    | String            | ISO currency code of the payment amount.
**Optional**:paymentType     | Int               | Type of the payment summary item, `PaymentTypeFinal` for default, check [apple_pay_payment_type](#apple-pay-payment-type-values).

#### Example JSON

```json
{
  "price": "1.00",
  "summaryLabel": "Apple Pay Sample",
  "countryCode": "US",
  "currencyCode": "USD",
  "paymentType": SQIPApplePay.PaymentTypeFinal,
}
```


---
### googlePayConfig 

Represents the Google Pay configuration.

Field           | Type              | Description
:---------------| :---------------- | :-----------------
price           | String            | The payment authorization amount as a string. 
currencyCode    | String            | The ISO currency code
priceStatus     | Int               | The status of the total price used, check [google_pay_constants](#google-pay-price-status-values)

#### Example JSON

```json
{
  "price": "1.00",
  "currencyCode": "USD",
  "priceStatus": SQIPGooglePay.TotalPriceStatusFinal,
}
```


---
### error

Contains information about a payment card processing error.

Field             | Type                      | Description
:---------------- | :------------------------ | :-----------------
code              | [ErrorCode](#errorcode)   | The enumerated error types
message           | String                    | A description of the usage error
debugCode         | String                    | Information about error state
debugMessage      | String                    | A description of the error state


#### Example JSON

```json
   {
     "code" : "USAGE_ERROR",
     "message": "Something went wrong. Please contact the developer of this application and provide them with this error code: rn_invalid_type",
     "debugCode": "rn_invalid_type",
     "debugMessage": "..."
   }
```


---
### InAppPaymentsException

 Signals that card entry exception of some sort has occurred. This
 class is the general class of exceptions produced by failed payment card
 processing operations.

Field             | Type                      | Description
:---------------- | :------------------------ | :-----------------
code              | [ErrorCode](#errorcode)   | The enumerated error types
message           | String                    | A description of the usage error
debugCode         | String                    | Information about error state
debugMessage      | String                    | A description of the error state

#### Example JSON

```json
   {
     "code" : "USAGE_ERROR",
     "message": "Something went wrong. Please contact the developer of this application and provide them with this error code: rn_apple_pay_not_initialized",
     "debugCode": "rn_apple_pay_not_initialized",
     "debugMessage": "..."
   }
```

---

### IOSTheme

Encapsulates options used to style the iOS native card entry view controller.

Field                              | Type               | Description
:--------------------------------- | :----------------- | :-----------------
**Optional**: font                 | Font               | The text field font.
**Optional**: backgroundColor      | RGBAColor          | The background color of the card entry view controller.
**Optional**: foregroundColor      | RGBAColor          | The fill color for text fields.
**Optional**: textColor            | RGBAColor          | The text field text color.
**Optional**: placeholderTextColor | RGBAColor          | The text field placeholder text color.
**Optional**: tintColor            | RGBAColor          | The tint color reflected in the text field cursor and submit button background color when enabled.
**Optional**: messageColor         | RGBAColor          | The text color used to display informational messages.
**Optional**: errorColor           | RGBAColor          | The text color when the text is invalid.
**Optional**: saveButtonTitle      | String             | The text of the entry completion button
**Optional**: saveButtonFont       | Font               | The save button font.
**Optional**: saveButtonTextColor  | RGBAColor          | The save button text color when enabled.
**Optional**: keyboardAppearance   | KeyboardAppearance | The appearance of the keyboard.

#### Example JSON

```json
{
  "font": {
    "size": 30,
  },
  "backgroundColor" :{
    "r": 239,
    "g": 239,
    "b": 244,
    "a": 1.0,
  },
  "foregroundColor" :{
    "r": 255,
    "g": 255,
    "b": 255,
  },
  "textColor" :{
    "r": 0,
    "g": 0,
    "b": 0,
    "a": 0.9,
  },
  "placeholderTextColor" :{
    "r": 0.72,
    "g": 0.72,
    "b": 0.75,
    "a": 1.00,
  },
  "tintColor" :{
    "r": 0,
    "g": 122,
    "b": 254,
    "a": 1,
  },
  "messageColor" :{
    "r": 0.72,
    "g": 0.72,
    "b": 0.75,
    "a": 1.0,
  },
  "errorColor" :{
    "r": 139,
    "g": 0,
    "b": 12,
    "a": 0.9,
  },
  "saveButtonTitle": "Pay 💳 ",
  "saveButtonFont" : {
    "size": 30,
    "name": "courier",
  },
  "saveButtonTextColor": {
    "r": 213,
    "g": 133,
    "b": 12,
    "a": 0.9,
  },
  "keyboardAppearance": "Light",
}
```

---
## Constants

### Apple Pay Payment Type values

Constant                  | Type  | Value | Description
:------------------------ | :---- | :-----| :-----------------
PaymentTypePending        | int   | 1     | A summary item representing an estimated or unknown cost.
PaymentTypeFinal          | int   | 2     | A summary item representing the known, final cost.

---

### Google Pay Price Status values

Constant                          | Type | Value  |Description
:-------------------------------- | :--- | :------| :-----------------
TotalPriceStatusNotCurrentlyKnown | int  | 1      | Used for a capability check.
TotalPriceStatusEstimated         | int  | 2      | Total price may adjust based on the details of the response, such as sales tax collected based on a billing address.
TotalPriceStatusFinal             | int  | 3      | Total price will not change from the amount presented to the user.

---

### Google Pay environment values

Constant                  | Type  | Value | Description
:------------------------ | :---- | :-----| :-----------------
EnvironmentProduction     | int   | 1     | Environment to be used when an app is granted access to the Google Pay production environment.
EnvironmentTest           | int   | 3     | Environment to be used for development and testing an application before approval for production.

---

### Brand

Supported brands for `card` payments accepted during the In-App Payments SDK checkout
flow.

* `VISA` - Visa Inc. credit or debit card.
* `MASTERCARD` - Mastercard Incorporated credit or debit card.
* `AMERICAN_EXPRESS` - American Express Company credit card.
* `DISCOVER` - Discover Financial Services credit card.
* `DISCOVER_DINERS` - Diners Club International credit card.
* `JCB` - Japan Credit Bureau credit card.
* `CHINA_UNION_PAY` - China UnionPay credit card.
* `OTHER_BRAND` - An unexpected card type.

---


### CardType

The type of card (for example, Credit or Debit). **Note**: This property is experimental and will always return `UNKNOWN`.

* `DEBIT` - Debit card.
* `CREDIT` - Credit card.
* `UNKNOWN` - Unable to determine type of the card.

---


### CardPrepaidType

The prepaid type of the credit card (for example, a Prepaid Gift Card). **Note**: This property is experimental and will always return `UNKNOWN`

* `PREPAID` - Prepaid card.
* `NOT_PREPAID` - Card that is not prepaid.
* `UNKNOWN` - Unable to determine whether the card is prepaid or not.

---


## ErrorCode

ErrorCode                          | Cause                                                            | Returned by
:--------------------------------- | :--------------------------------------------------------------- | :---
<a id="e1">`usageError`</a>        | In-App Payments SDK was used in an unexpected or unsupported way.| all methods
<a id="e2">`noNetwork`</a>         | In-App Payments SDK could not connect to the network.            | [applePayNonceRequestFailureCallback](#applepaynoncerequestfailurecallback), [googlePayNonceRequestFailureCallback](#googlepaynoncerequestfailurecallback)
<a id="e3">`failed`</a> | Square Buyer Verification SDK could not verify the provided card. | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback)
<a id="e4">`canceled`</a> | The result when the customer cancels the Square Buyer Verification flow before a card is successfully verified. | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback)
<a id="e5">`unsupportedSDKVersion`</a> | The version of the Square Buyer Verification SDK used by this application is no longer supported | [BuyerVerificationErrorCallback](#BuyerVerificationErrorCallback)


[//]: # "Link anchor definitions"
[https://developer.squareup.com/docs/]: https://developer.squareup.com/docs/
[In-App Payments SDK]: https://developer.squareup.com/docs/in-app-payments-sdk/what-it-does
[ISO 4217 format]: https://www.iban.com/currency-codes.html
[Square Dashboard]: https://squareup.com/dashboard/
[Square-issued gift card]: https://squareup.com/us/en/software/gift-cards
