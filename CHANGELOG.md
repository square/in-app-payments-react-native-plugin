## Changelog


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
