## Changelog

### Unreleased

* Fix combined `*WithBuyerVerification` methods verifying the wrong payment source. In 2.0–2.1.0 they ran 3DS on the `paymentSourceId` argument first, then opened card entry / Apple Pay / Google Pay, so the verification token did not belong to the card the buyer actually paid with. They now collect the nonce first, then verify that nonce (matching 1.x). `paymentSourceId` is removed from these methods; only `startBuyerVerificationFlow` still takes it. Deprecated JS overloads still accept the old argument and ignore it.
* Document the 2.x buyer-verification APIs in `docs/reference.md`, including `SQIPBuyer`, gift-card and wallet combined flows, and `cardEntryConfig`'s role as 3DS parameters.
* Example app no longer passes the sandbox-only `ccof:customer-card-id-requires-verification` value into combined buyer-verification methods.

### v2.1.0 Jul 23, 2026

* Upgrade IAP SDK for Android `1.6.9`.
* IAP SDK Android `1.6.9` is built with Kotlin 2.3.0 and requires Kotlin `2.2.21`+ to compile, while React Native pins Kotlin 2.1.x (as of RN 0.86). The Expo config plugin now pins the Kotlin Gradle plugin to `2.2.21` automatically; bare React Native apps must pin it in their root `android/build.gradle` (see the [getting started guide](docs/get-started.md)).
* IAP SDK Android `1.6.9` pulls in OkHttp 5.x, whose multi-release jars ship duplicate `META-INF/versions/9/OSGI-INF/MANIFEST.MF` entries and fail `mergeJavaResource`. The Expo config plugin now excludes it automatically; bare React Native apps should add a `packaging` exclude to `android/app/build.gradle` (see the [getting started guide](docs/get-started.md)).

### v2.0.1 Jun 4, 2026

* Upgrade IAP SDK for Android `1.6.8` and for iOS `1.6.7`.

### v1.7.6 Jun 03, 2024

* Upgrade IAP SDK for Android `1.6.6` and for iOS `1.6.3`.

### v1.7.5 Oct 12, 2023

* Upgrade IAP SDK for Android `1.6.5`.

### v1.7.4 Oct 05, 2023

* Upgrade IAP SDK for iOS `1.6.2`.

### v1.7.3 April 05, 2023

* Upgrade IAP SDK for Android `1.6.2` and for iOS `1.6.1`.
* An important update to SquareBuyerVerificationSDK that mitigates the risk of declining 3-D Secure (3DS) payments for ios.
* Various bug fixes.

### v1.7.2 May 23, 2022

* Upgrade IAP SDK to `1.5.6`.

### v1.7.1 Feb 8, 2022

* Upgrade IAP SDK to `1.5.5`.
* Fxied iOS Xcode legacy build issue.
* Support Typescript.

### v1.7.0 Oct 29, 2021

* Upgrade IAP SDK to `1.5.4`. 
* Support IAP SDK version override with `$sqipVersion` for iOS or `ext.sqipVersion` for Android.

### v1.6.0 July 19, 2021

* Downgrading IAP SDK to `1.4.9` to solve compatability issue with newer versions of the IAP SDK.

### v1.5.0 May 14, 2021

* Added a new flow called [startBuyerVerificationFlow](docs/reference.md#startbuyerverificationflow) to support Strong Customer Authentication with a card-on-file card ID
* Updated to IAP SDK `1.5.1`.
* updated react native version to `0.64.0`.

### v1.4.0 July 10, 2020

* Updated to IAP SDK `1.4.0`.
* Added support for gift card payments.

### v1.3.1 January 8, 2020

* Bump Nested HandleBar dependency from `4.2.0` to `4.5.3`.

### v1.3.0 November 25, 2019

* Bump Square In-App Payments SDK dependency to `1.3.0`.
* Add support for Strong Customer Authentication (SCA).

### v1.2.3 September 10, 2019

* Bump Square In-App Payments SDK dependency to `1.2.0`.
* Add support for Sandbox v2.

### v1.2.2 September 6, 2019

* Upgraded to Android SDK 28. Supports AndroidX.

### v1.2.1 June 5, 2019

* Added `paymentType` parameter to support apple pay pending amount configuration.

### v1.1.2 Mar 28, 2019

* Support android In-App Payments SDK version override.

### v1.1.1 Mar 22, 2019

* Small bug fixes - #3

### v1.1.0 Feb 27, 2019

* Initial release.
