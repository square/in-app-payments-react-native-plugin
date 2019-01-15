# Enable Google Pay with the React Native Plugin for In-App Payments SDK

This guide walks you through the process of enabling the Google Pay digital wallet
for an app that uses the **React Native plugin for the Square [In-App Payments SDK]**. See the [React Native In-App Payments Plugin Technical Reference](reference.md)
for more detailed information about the Google Pay methods available.

**[Google Pay]** can only be used on Android devices. You must [add a card or payment account] before using **Google Pay**.

## Before you start

* If you haven't already created a React Native project with In-App Payments SDK, use the [Getting Started with the React Native Plugin for In-App Payments SDK](get-started.md) to 
set up a React Native project .


## Process overview

* [Step 1: Update the AndroidManifiest](#step-1-update-the-androidmanifiest)
* [Step 2: Initialize Google Pay](#step-2-initialize-google-pay)
* [Step 3: Implement the Google Pay flow](#step-3-implement-the-google-pay-flow)

## Step 1: Update the Android Manifiest

1. Open the `myRNInAppPaymentsSample/android/app/src/main/AndroidManifest.xml`
2. Add the following `meta-data` element inside of the `application` element of the manifest:

    ```xml
    <meta-data
        android:name="com.google.android.gms.wallet.api.enabled"
        android:value="true" />
    ```

## Step 2: Initialize Google Pay

1. Add code to initialize Google Pay in your application State class. 
    ```javascript
    import {
      ...
      Platform,
    } from 'react-native';
    import {
      SQIPCore,
      SQIPCardEntry,
    } from 'react-native-square-in-app-payments';

    export default class App extends Component {
      ...
      async componentDidMount() {
        ...
        let digitalWalletEnabled = false;
        if (Platform.OS === 'ios') {
        ...
        } else if (Platform.OS === 'android') {
          await SQIPGooglePay.initializeGooglePay(
            'REPLACE_WITH_SQUARE_LOCATION_ID',
            SQIPGooglePay.EnvironmentTest);
          try {
            digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay();
          } catch (ex) {
            // Handle InAppPaymentsException
          }
        }

        this.setState({
          canUseDigitalWallet: digitalWalletEnabled,
        });
      }
      ...
    }
    ```
1. Replace `REPLACE_WITH_SQUARE_LOCATION_ID` in this example with a valid Square location ID. 
The available location IDs for a Square account can be found on the Locations tab 
of the Square Developer Portal.

## Step 3: Implement the Google Pay flow
```javascript
export default class App extends Component {
  constructor() {
    super();
    ...
    // bind 'this' to the method's context
    this.onStartDigitalWallet = this.onStartDigitalWallet.bind(this);
  }

  ...

  /**
   * Callback when successfully get the card nonce details for processig
   * google pay sheet has been closed when this callback is invoked
   */
  async onGooglePayNonceRequestSuccess(cardDetails) {
    try {
      // take payment with the card nonce details
      // you can take a charge
      // await chargeCard(cardDetails);

    } catch (ex) {
      // handle card nonce processing failure
    }
  }

  /**
   * Callback when google pay is canceled
   * google pay sheet has been closed when this callback is invoked
   */
  onGooglePayCancel() {
    // handle google pay canceled
  }

  /**
   * Callback when failed to get the card nonce
   * google pay sheet has been closed when this callback is invoked
   */
  onGooglePayNonceRequestFailure(errorInfo) {
    // handle google pay failure
  }

  /**
   * An event listner to start digital wallet flow
   */
  async onStartDigitalWallet() {
    if (Platform.OS === 'ios') {
      ...
    } else if (Platform.OS === 'android') {
      const googlePayConfig = {
        price: '1.00',
        currencyCode: 'USD',
        priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
      };
      try {
        await SQIPGooglePay.requestGooglePayNonce(
          googlePayConfig,
          this.onGooglePayNonceRequestSuccess,
          this.onGooglePayNonceRequestFailure,
          this.onGooglePayCancel,
        );
      } catch (ex) {
        // Handle InAppPaymentsException
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        ...
        <Button
          onPress={this.onStartDigitalWallet}
          title="Start Digital Wallet"
          disabled={!this.state.canUseDigitalWallet}
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
[In-App Payments SDK]: https://docs.connect.squareup.com/payments/readersdk/overview
[Square Dashboard]: https://squareup.com/dashboard/
[Testing Mobile Apps]: https://docs.connect.squareup.com/testing/mobile
[squareup.com/activate]: https://squareup.com/activate
[Square Application Dashboard]: https://connect.squareup.com/apps/
[In-App Payments SDK Android Setup Guide]: https://docs.connect.squareup.com/payments/readersdk/setup-android
[In-App Payments SDK iOS Setup Guide]: https://docs.connect.squareup.com/payments/readersdk/setup-ios
[root README]: ../README.md
[React Native Getting Started]: https://facebook.github.io/react-native/docs/getting-started.html
[Google Pay]: https://developers.google.com/pay/api/android/overview
[Google Pay methods]: https://developers.google.com/pay/api/android/reference/client
[Google Pay objects]: https://developers.google.com/pay/api/android/reference/object 
[BackendQuickStart Sample]: https://github.com/square/in-app-payments-server-quickstart
[add a card or payment account]: https://support.google.com/pay/answer/7625139?visit_id=636775920124642581-1648826871&rd=1
