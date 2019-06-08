# Getting Started with the React Native Plugin for In-App Payments SDK

This guide walks you through the process of setting up a new React Native
project with In-App Payments SDK. See the
[React Native In-App Payments SDK Technical Reference](reference.md)
for more detailed information about the methods available.


## Before you start

* You will need a Square account enabled for payment processing. If you have not
  enabled payment processing on your account (or you are not sure), visit
  [squareup.com/activate].
* Install [yarn] from **yarnpkg.com**
* Follow the **Building Projects with Native Code** instructions in the
React Native [Getting Started] guide to setup your React Native development
environment.

## Process overview

* [Step 1: Create a React Native project](#step-1-create-a-react-native-project)
* [Step 2: Install and link the React Native plugin for In-App Payments SDK](#step-2-install-and-link-the-react-native-plugin-for-in-app-payments-sdk)
* [Step 3: Add the In-App Payments SDK to your iOS project](#step-3-add-the-in-app-payments-sdk-to-your-ios-project)
* [Step 4: Configure your Android project](#step-4-configure-your-android-project)

**Card Entry Usage**

* [Step 1: Get a Square Application ID](#step-1-get-a-square-application-id)
* [Step 2: Initialize the In-App Payments SDK](#step-2-initialize-the-in-app-payments-sdk)
* [Step 3: Customize card entry appearance](#step-3-customize-card-entry-appearance)
* [Step 4: Implement the Payment flow](#step-4-implement-the-payment-flow) 

**Digital Wallets**
* [Apple Pay Usage](enable-applepay)
* [Google Pay Usage](enable-googlepay)

## Step 1: Create a React Native project
In a terminal, create a folder for your React Native project and run the following command in 
the new folder:

```bash
react-native init myRNInAppPaymentsSample
```
This command creates a new React Native project with an `App.js` file and folders 
for Android and iOS specific code. The following steps in this
guide update code in the files created by the command.

>**Note:** 
If the previous `react-native` command returns `command not found` on OS X 
or `react-native is not recognized as an internal or external command` on Windows,
then the **React Native command line interface** (CLI) is not installed. To fix this, 
run `npm install -g react-native-cli` or if you have installed the **Yarn** dependency 
manager, `yarn global add react-native-cli`. 


## Step 2: Install and link the React Native plugin for In-App Payments SDK

At a terminal prompt, run the following commands in the project root folder:

```bash
yarn add react-native-square-in-app-payments
react-native link react-native-square-in-app-payments
```

## Step 3: Add the In-App Payments SDK to your iOS project

To use the In-App Payments plugin on iOS devices, install **In-App Payments SDK for iOS** 
to make it an available resource for the React Native plugin. 

1. Open your iOS project `myRNInAppPaymentsSample.xcodeproj` with **Xcode** and install **In-App Payments SDK** by following  
[Install In-App Payments SDK - Swift(iOS) Option 3: Manual Installation]. You **MUST**
put the **SquareInAppPaymentsSDK.framework** in folder `<YOUR_PROJECT_DIRECTORY>/ios`, otherwise
the project won't compile.
    > Check the supported SDK version in the top of [root README].
1. Set the `iOS Deployment Target` to 11.0 or above
1. Add an In-App Payments SDK build phase:
    1. Open the **Xcode** project for your application.
    1. In the **Build Phases** tab for your application target, click the **+**
        button at the top of the pane.
    1. Select **New Run Script Phase**.
    1. Paste the following into the editor panel of the new run script:
        ```
        FRAMEWORKS="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}"
        "${FRAMEWORKS}/SquareInAppPaymentsSDK.framework/setup"
        ```
1. Correct the resource bundle location in your project target `myRNInAppPaymentsSample`
    1. In the `Link Binary With Libraries` build phase, remove `RNSquareInAppPayments-Resources.bundle`.
    1. In the `Copy Bundle Resources` build phase, add `RNSquareInAppPayments-Resources.bundle` from `Libraries`->`RNSquareInAppPayments.xcodeproj`.

## Step 4: Configure your Android project

1. Open `android/build.gradle` and set your `minSdkVersion` to `21` or greater.
The `buildToolsVersion`, `compileSdkVersion`, `targetSdkVersion`, and `supportLibVersion` values
are just examples. 

1. (Optional) If you want to pick a different In-App Payments Android SDK version, you can override the `sqipVersion`.
    > Check the minimum supported SDK version in the top of [root README].

    ```gradle
    buildscript {
      ext {
          buildToolsVersion = "28.0.2"
          minSdkVersion = 21
          compileSdkVersion = 28
          targetSdkVersion = 27
          supportLibVersion = "28.0.0"
          sqipVersion = "1.1.0"
      }
      ...
    }
    ```

## Card Entry Usage
Complete the following steps to add the **In-App Payments** card entry screen to
your React Native project and use the card entry screen to get a nonce.

## Step 1: Get a Square Application ID

1. Open the [Square Application Dashboard].
1. Create a new Square application.
1. Click on the new application to bring up the Square application settings
   pages.
1. You will need the **Application ID** from the
   **Credentials** page to configure In-App Payments SDK in the next steps.

### Step 2: Initialize the In-App Payments SDK

1. Add code `App.js` to initialize the In-App Payments SDK.
    ```javascript
    import {
      SQIPCore,
    } from 'react-native-square-in-app-payments';

    export default class App extends Component {
      ...
      async componentDidMount() {
        await SQIPCore.setSquareApplicationId('REPLACE_WITH_APPLICATION_ID');
        ...
      }
      ...
    }
    ```
1. Replace `APPLICATION_ID` with the **application ID** from the application dashboard.

### Step 3: Customize card entry appearance
The Android and iOS platforms allow customization of the card entry screen but provide
different customization mechanisms. 

### Android
To customize the card entry appearance for Android devices, update code in the 
Android project folder as described in [customizing the payment entry form] in 
the Square developer documentation..

### iOS
For iOS devices, set the card entry error text and background color, keyboard 
appearance and message color.

* Here is an example that creates a card entry theme that customize save button
  and keyboard appearance.
  ```javascript
  import {
    SQIPCardEntry,
  } from 'react-native-square-in-app-payments';

  export default class App extends Component {
    ...
    async componentDidMount() {
      ...
      if (Platform.OS === 'ios') {
        await SQIPCardEntry.setIOSCardEntryTheme({
          saveButtonFont: {
            size: 25,
          },
          saveButtonTitle: 'Pay 💳 ',
          keyboardAppearance: 'Light',
          saveButtonTextColor: {
            r: 255,
            g: 0,
            b: 125,
            a: 0.5,
          },
        });
      }
    }
    ...
  }
  ```

### Step 4: Implement the Payment flow

Add a button and start the card entry in button `onPress` event handler.
  ```javascript
  import {
    SQIPCardEntry,
  } from 'react-native-square-in-app-payments';

  export default class App extends Component {
    constructor() {
      super();
      // bind 'this' to the methods' context
      this.onStartCardEntry = this.onStartCardEntry.bind(this);
      this.onCardNonceRequestSuccess = this.onCardNonceRequestSuccess.bind(this);
    }

    ...

    /**
     * Callback when the card entry is closed after call 'SQIPCardEntry.completeCardEntry'
     */
    onCardEntryComplete() {
      // Update UI to notify user that the payment flow is completed
    }

    /**
     * Callback when successfully get the card nonce details for processig
     * card entry is still open and waiting for processing card nonce details
     * @param {*} cardDetails
     */
    async onCardNonceRequestSuccess(cardDetails) {
      try {
        // take payment with the card details
        // await chargeCard(cardDetails);

        // payment finished successfully
        // you must call this method to close card entry
        await SQIPCardEntry.completeCardEntry(
          this.onCardEntryComplete(),
        );
      } catch (ex) {
        // payment failed to complete due to error
        // notify card entry to show processing error
        await SQIPCardEntry.showCardNonceProcessingError(ex.message);
      }
    }

    /**
     * Callback when card entry is cancelled and UI is closed
     */
    onCardEntryCancel() {
      // Handle the cancel callback
    }

    /**
     * An event listener to start card entry flow
     */
    async onStartCardEntry() {
      const cardEntryConfig = {
        collectPostalCode: false,
      };
      await SQIPCardEntry.startCardEntryFlow(
        cardEntryConfig,
        this.onCardNonceRequestSuccess,
        this.onCardEntryCancel,
      );
    }

    render() {
      return (
        <View style={styles.container}>
          ...
          <Button
            onPress={this.onStartCardEntry}
            title="Start Card Entry"
          />
        </View>
      );
    }
  }
  ```
---
**Note:** the `chargeCard` method in this example shows a typical REST request on a backend process
that uses the **Transactions API** to take a payment with the supplied nonce.
See [BackendQuickStart Sample] to learn about building an app that processes payment nonces on a server.

[//]: # "Link anchor definitions"
[docs.connect.squareup.com]: https://docs.connect.squareup.com
[In-App Payments SDK]: https://docs.connect.squareup.com/payments/in-app-payments-sdk/overview
[Square Dashboard]: https://squareup.com/dashboard/
[Testing Mobile Apps]: https://docs.connect.squareup.com/testing/mobile
[squareup.com/activate]: https://squareup.com/activate
[Square Application Dashboard]: https://connect.squareup.com/apps/
[In-App Payments SDK Android Setup Guide]: https://docs.connect.squareup.com/payments/in-app-payments/setup-android
[In-App Payments SDK iOS Setup Guide]: https://docs.connect.squareup.com/payments/in-app-payments-sdk/setup-ios
[root README]: ../README.md
[Getting Started]: https://facebook.github.io/react-native/docs/getting-started
[BackendQuickStart Sample]: https://github.com/square/in-app-payments-server-quickstart
[customizing the payment entry form]: https://docs.connect.squareup.com/payments/in-app-payments-sdk/cookbook/customize-payment-form
[yarn]: https://yarnpkg.com/lang/en/docs/install/
[Google Pay]: https://developers.google.com/pay/api/
[enable Apple Pay]: https://help.apple.com/xcode/mac/9.3/#/deva43983eb7?sub=dev44ce8ef13
[set up Apple Pay requirements]: https://developer.apple.com/documentation/passkit/apple_pay/setting_up_apple_pay_requirements
[add a card or payment account]: https://support.google.com/pay/answer/7625139?visit_id=636775920124642581-1648826871&rd=1
[Install In-App Payments SDK - Swift(iOS) Option 3: Manual Installation]:https://developer.squareup.com/docs/in-app-payments-sdk/installation#option-3-install-the-in-app-payments-sdk-manually
