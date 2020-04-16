# React Native plugin for In-App Payments SDK

[![Build Status](https://travis-ci.com/square/in-app-payments-react-native-plugin.svg?branch=master)](https://travis-ci.com/square/in-app-payments-react-native-plugin)
[![npm version](https://badge.fury.io/js/react-native-square-in-app-payments.svg)](https://badge.fury.io/js/react-native-square-in-app-payments)

The In-App Payments plugin for Square [In-App Payments SDK] is a wrapper for the native Android and iOS SDKs and 
supports the following native In-App Payments SDK versions:

  * iOS: `1.3.0`
  * Android: `1.3.0`

## Additional documentation

In addition to this README, the following is available in the [React Native plugin GitHub repo]:

* [Getting started guide]
* [Enable Apple Pay guide]
* [Enable Google Pay guide]
* [Technical reference]
* [Troubleshooting guide]
* [`docs`] - Root directory for all documentation.
* [`react-native-in-app-payments-quickstart`] - Root directory of the React Native sample app (with walkthrough).
* [Getting started with the example app]

## Build requirements

### Android

* Android minSdkVersion is API 21 (Lollipop, 5.0) or higher. 
* Android Target SDK version: API 28 (Android 9).
* Android Gradle Plugin: 3.0.0 or greater.

### iOS

* Xcode version: 9.1 or greater.
* iOS Base SDK: 11.0 or greater.
* Deployment target: iOS 11.0 or greater.

## In-App Payments SDK requirements and limitations

* In-App Payments SDK cannot issue refunds. Refunds can be issued programmatically using
  the Transactions API or manually in the [Square Dashboard].

## Sample applications
* **[Quick start React Native app]:** You can learn how the In-App-Payments React Native plugin is used by [getting started with the example app], a quick-start React Native app that lets you take a payment after completing 6 setup steps. 
* **Quick start backend app:** The [In-App Payments Server Quickstart](https://github.com/square/in-app-payments-server-quickstart) 
takes the nonce created by the React Native app and uses it to create a payment credited to your Square account. Use this backend sample to quickly create a complete payment flow.

## License

```
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
```

[//]: # "Link anchor definitions"
[In-App Payments SDK]: https://developer.squareup.com/docs/in-app-payments-sdk/what-it-does
[Square Dashboard]: https://squareup.com/dashboard/
[Testing Mobile Apps]: https://docs.connect.squareup.com/testing/mobile
[`docs`]: https://github.com/square/in-app-payments-react-native-plugin/tree/master/docs
[`react-native-in-app-payments-quickstart`]: https://github.com/square/in-app-payments-react-native-plugin/tree/master/react-native-in-app-payments-quickstart
[Getting started guide]: https://github.com/square/in-app-payments-react-native-plugin/blob/master/docs/get-started.md
[Enable Apple Pay guide]: https://github.com/square/in-app-payments-react-native-plugin/blob/master/docs/enable-applepay.md
[Enable Google Pay guide]: https://github.com/square/in-app-payments-react-native-plugin/blob/master/docs/enable-googlepay.md
[Technical reference]: https://github.com/square/in-app-payments-react-native-plugin/blob/master/docs/reference.md
[Troubleshooting guide]: https://github.com/square/in-app-payments-react-native-plugin/blob/master/docs/troubleshooting.md
[React Native plugin GitHub repo]: https://github.com/square/in-app-payments-react-native-plugin/tree/master
[Getting started with the example app]: https://github.com/square/in-app-payments-react-native-plugin/tree/master/react-native-in-app-payments-quickstart/README.md
[Quick start React Native app]: https://github.com/square/in-app-payments-react-native-plugin/tree/master/react-native-in-app-payments-quickstart