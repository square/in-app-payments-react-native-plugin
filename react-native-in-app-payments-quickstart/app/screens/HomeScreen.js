/*
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
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import {
  SQIPCardEntry,
  SQIPApplePay,
  SQIPCore,
  SQIPGooglePay,
} from 'react-native-square-in-app-payments';

import Modal from 'react-native-modal';
import OrderModal from '../components/OrderModal';
import CardsOnFileModal from '../components/CardsOnFileModal';
import PendingModal from '../components/PendingModal';
import GreenButton from '../components/GreenButton';
import {
  SQUARE_APP_ID,
  SQUARE_LOCATION_ID,
  CHARGE_SERVER_HOST,
  GOOGLE_PAY_LOCATION_ID,
  APPLE_PAY_MERCHANT_ID,
  CUSTOMER_ID,
} from '../Constants';
import {
  printCurlCommand,
  showAlert,
} from '../Utilities';
import chargeCardNonce from '../service/Charge';
import createCustomerCard from '../service/CreateCustomerCard';
import chargeCustomerCard from '../service/ChargeCustomerCard';

require('../images/iconCookie.png');

const cookieImage = require('../images/iconCookie.png');

const applePayStatus = {
  none: 0,
  succeeded: 1,
  nonceNotCharged: 2,
};

const iOSCardEntryTheme = {
  saveButtonFont: {
    size: 30,
  },
  saveButtonTitle: 'Pay 🍪',
  keyboardAppearance: 'Light',
  tintColor: {
    r: 36,
    g: 152,
    b: 141,
    a: 0.9,
  },
  textColor: {
    r: 36,
    g: 152,
    b: 141,
    a: 0.9,
  },
};

let errorMsg = null;

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      showingBottomSheet: false,
      showingCardsOnFileScreen: false,
      showingPendingScreen: false,
      showingCardEntry: false,
      showingGiftCardEntry: false,
      showingCustomerCardEntry: false,
      showingDigitalWallet: false,
      canUseDigitalWallet: false,
      showingBuyerVerification: false,
      applePayState: applePayStatus.none,
      applePayError: null,
      cardsOnFile: [],
    };
    this.onStartCardEntry = this.startCardEntry.bind(this);
    this.onStartGiftCardEntry = this.startGiftCardEntry.bind(this);
    this.onShowCardEntry = this.onShowCardEntry.bind(this);
    this.onShowGiftCardEntry = this.onShowGiftCardEntry.bind(this);
    this.onBuyerVerification = this.onBuyerVerification.bind(this);
    this.onShowCustomerCardEntry = this.onShowCustomerCardEntry.bind(this);
    this.onCardNonceRequestSuccess = this.onCardNonceRequestSuccess.bind(this);
    this.onCustomerCardNonceRequestSuccess = this.onCustomerCardNonceRequestSuccess.bind(this);
    this.onCardEntryCancel = this.onCardEntryCancel.bind(this);
    this.onCustomerCardEntryCancel = this.onCustomerCardEntryCancel.bind(this);
    this.onApplePayRequestNonceSuccess = this.onApplePayRequestNonceSuccess.bind(this);
    this.onApplePayRequestNonceFailure = this.onApplePayRequestNonceFailure.bind(this);
    this.onApplePayComplete = this.onApplePayComplete.bind(this);
    this.onGooglePayRequestNonceSuccess = this.onGooglePayRequestNonceSuccess.bind(this);
    this.onGooglePayRequestNonceFailure = this.onGooglePayRequestNonceFailure.bind(this);
    this.onGooglePayCanceled = this.onGooglePayCanceled.bind(this);
    this.onShowDigitalWallet = this.onShowDigitalWallet.bind(this);
    this.startCardEntry = this.startCardEntry.bind(this);
    this.startGiftCardEntry = this.startGiftCardEntry.bind(this);
    this.showOrderScreen = this.showOrderScreen.bind(this);
    this.showPendingScreen = this.showPendingScreen.bind(this);
    this.closeOrderScreen = this.closeOrderScreen.bind(this);
    this.showCardsOnFileScreen = this.showCardsOnFileScreen.bind(this);
    this.closeCardsOnFileScreen = this.closeCardsOnFileScreen.bind(this);
    this.onSelectCardOnFile = this.onSelectCardOnFile.bind(this);
    this.startCardEntryWithBuyerVerification = this.startCardEntryWithBuyerVerification.bind(this);
    this.onBuyerVerificationSuccess = this.onBuyerVerificationSuccess.bind(this);
    this.onBuyerVerificationFailure = this.onBuyerVerificationFailure.bind(this);
  }

  async componentDidMount() {
    await SQIPCore.setSquareApplicationId(SQUARE_APP_ID);
    let digitalWalletEnabled = false;
    if (Platform.OS === 'ios') {
      try {
        await SQIPApplePay.initializeApplePay(APPLE_PAY_MERCHANT_ID);
        digitalWalletEnabled = await SQIPApplePay.canUseApplePay();
      } catch (ex) {
        console.log(ex);
      }
    } else if (Platform.OS === 'android') {
      await SQIPGooglePay.initializeGooglePay(
        GOOGLE_PAY_LOCATION_ID, SQIPGooglePay.EnvironmentTest,
      );
      try {
        digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay();
      } catch (ex) {
        console.log(ex);
      }
    }

    this.setState({
      canUseDigitalWallet: digitalWalletEnabled,
    });
  }

  async onApplePayRequestNonceSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        await SQIPApplePay.completeApplePayAuthorization(true);
        this.setState({ applePayState: applePayStatus.succeeded });
      } catch (error) {
        await SQIPApplePay.completeApplePayAuthorization(false, error.message);
        this.setState({ applePayError: error.message });
      }
    } else {
      await SQIPApplePay.completeApplePayAuthorization(true);
      this.setState({ applePayState: applePayStatus.nonceNotCharged });
      printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
    }
  }

  async onApplePayRequestNonceFailure(errorInfo) {
    errorMsg = errorInfo.message;
    await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message);
    showAlert('Error processing Apple Pay payment', errorMsg);
  }

  async onApplePayComplete() {
    if (this.state.applePayState === applePayStatus.succeeded) {
      showAlert('Your order was successful',
        'Go to your Square dashboard to see this order reflected in the sales tab.');
    } else if (this.state.applePayState === applePayStatus.nonceNotCharged) {
      showAlert(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
      );
    } else if (this.state.applePayError != null) {
      showAlert('Error processing Apple Pay payment', this.state.applePayError);
    } else { // the state is none, so they canceled
      this.showOrderScreen();
    }
  }

  async onGooglePayRequestNonceSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        showAlert('Your order was successful',
          'Go to your Square dashbord to see this order reflected in the sales tab.');
      } catch (error) {
        showAlert('Error processing GooglePay payment', error.message);
      }
    } else {
      printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
      showAlert(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
      );
    }
  }

  onGooglePayRequestNonceFailure(errorInfo) {
    showAlert('Could not create GooglePay nonce', errorInfo);
  }

  onGooglePayCanceled() {
    this.showOrderScreen();
  }

  async onCardNonceRequestSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        SQIPCardEntry.completeCardEntry(() => {
          showAlert('Your order was successful',
            'Go to your Square dashbord to see this order reflected in the sales tab.');
        });
      } catch (error) {
        SQIPCardEntry.showCardNonceProcessingError(error.message);
      }
    } else {
      SQIPCardEntry.completeCardEntry(() => {
        printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
        showAlert(
          'Nonce generated but not charged',
          'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        );
      });
    }
  }

  async onSelectCardOnFile(cardOnFile) {
    try {
      this.showPendingScreen();
      await chargeCustomerCard(CUSTOMER_ID, cardOnFile.id);
      showAlert('Your order was successful',
        'Go to your Square dashbord to see this order reflected in the sales tab.',
        this.showOrderScreen);
    } catch (error) {
      showAlert(
        'An error occured processing the card on file',
        error.message,
        this.showCardsOnFileScreen,
      );
    }
  }

  async onCustomerCardNonceRequestSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        // create the customer card record and add it to the state
        const customerCard = await createCustomerCard(CUSTOMER_ID, cardDetails.nonce);
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ cardsOnFile: [...this.state.cardsOnFile, customerCard] });
        SQIPCardEntry.completeCardEntry(() => {
          showAlert('Your card was saved and is ready to use.');
        });
        this.showCardsOnFileScreen();
      } catch (error) {
        SQIPCardEntry.showCardNonceProcessingError(error.message);
      }
    } else {
      SQIPCardEntry.completeCardEntry(() => {
        showAlert(
          'Customer card nonce generated but not charged',
          'Replace CHARGE_SERVER_HOST with your server host to enable saving the card.',
        );
      });
    }
  }

  onCardEntryCancel() {
    this.showOrderScreen();
  }

  onCustomerCardEntryCancel() {
    this.showCardsOnFileScreen();
  }

  onShowDigitalWallet() {
    this.closeOrderScreen();
    this.setState({ showingDigitalWallet: true });
  }

  onShowCardEntry() {
    this.closeOrderScreen();
    this.setState({ showingCardEntry: true });
  }

  onShowGiftCardEntry() {
    this.closeOrderScreen();
    this.setState({ showingGiftCardEntry: true });
  }

  onShowCustomerCardEntry() {
    this.closeOrderScreen();
    this.setState({ showingCustomerCardEntry: true });
  }

  onBuyerVerification() {
    this.closeOrderScreen();
    this.setState({ showingBuyerVerification: true });
  }

  async onBuyerVerificationSuccess(buyerVerificationDetails) {
    if (this.chargeServerHostIsSet() && buyerVerificationDetails.nonce !== 'ccof:customer-card-id-requires-verification') {
      try {
        await chargeCardNonce(buyerVerificationDetails.nonce, buyerVerificationDetails.token);
        showAlert('Your order was successful',
          'Go to your Square dashbord to see this order reflected in the sales tab.');
      } catch (error) {
        showAlert('Error processing card payment', error.message);
      }
    } else {
      printCurlCommand(
        buyerVerificationDetails.nonce,
        SQUARE_APP_ID,
        buyerVerificationDetails.token,
      );
      showAlert(
        'Nonce and verification token generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
      );
    }
  }

  async onBuyerVerificationFailure(errorInfo) {
    showAlert('Error verifying buyer', errorInfo.message);
  }

  showOrderScreen() {
    this.setState({
      showingBottomSheet: true,
      showingCardsOnFileScreen: false,
      showingPendingScreen: false,
    });
  }

  closeOrderScreen() {
    this.setState({ showingBottomSheet: false });
  }

  showCardsOnFileScreen() {
    this.setState({
      showingBottomSheet: true,
      showingCardsOnFileScreen: true,
      showingPendingScreen: false,
    });
  }

  closeCardsOnFileScreen() {
    this.setState({
      showingCardsOnFileScreen: false,
    });
  }

  showPendingScreen() {
    this.setState({
      showingPendingScreen: true,
      showingCardsOnFileScreen: false,
    });
  }

  applicationIdIsSet() { return SQUARE_APP_ID !== 'REPLACE_ME'; }

  chargeServerHostIsSet() { return CHARGE_SERVER_HOST !== 'REPLACE_ME'; }

  googlePayLocationIsSet() { return GOOGLE_PAY_LOCATION_ID !== 'REPLACE_ME'; }

  applePayMerchantIsSet() { return APPLE_PAY_MERCHANT_ID !== 'REPLACE_ME'; }

  customerIdIsSet() { return CUSTOMER_ID !== 'REPLACE_ME'; }

  checkStateAndPerform() {
    if (this.state.showingCardEntry) {
      // if application id is not set, we will let you know where to set it,
      // but the card entry will still open due to allowing visuals to be shown
      if (!this.applicationIdIsSet()) {
        showAlert('Missing Square Application ID',
          'To request a nonce, replace SQUARE_APP_ID in Constants.js with an Square Application ID.',
          this.startCardEntry);
      } else {
        // call this.startCardEntry() to start Card Entry without buyer verification (SCA)
        this.startCardEntry();
        // OR call this.startCardEntryWithBuyerVerification() to
        // start Card Entry with buyer verification (SCA)
        // NOTE this requires _squareLocationSet to be set
        // this.startCardEntryWithBuyerVerification();
      }
    } else if (this.state.showingCustomerCardEntry) {
      // if application id is not set, we will let you know where to set it,
      // but the card entry will still open due to allowing visuals to be shown
      if (!this.applicationIdIsSet()) {
        showAlert('Missing Square Application ID',
          'To request a nonce, replace SQUARE_APP_ID in Constants.js with an Square Application ID.',
          this.startCustomerCardEntry);
      } else {
        this.startCustomerCardEntry();
      }
    } else if (this.state.showingGiftCardEntry) {
      this.startGiftCardEntry();
    } else if (this.state.showingDigitalWallet) {
      this.startDigitalWallet();
      this.setState({ showingDigitalWallet: false });
    } else if (this.state.showingBuyerVerification) {
      this.startBuyerVerificationFlow();
    }
  }

  async startBuyerVerificationFlow() {
    console.log('STARTING Buyer Verification');
    this.setState({ showingBuyerVerification: false });
    const paymentSourceId = 'ccof:customer-card-id-requires-verification';
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
      postalCode: 'SE1 7',
    };
    await SQIPCardEntry.startBuyerVerificationFlow(
      paymentSourceId,
      cardEntryConfig,
      this.onBuyerVerificationSuccess,
      this.onBuyerVerificationFailure,
      this.onCardEntryCancel,
    );
  }

  async startCardEntry() {
    console.log('STARTING card entry');
    this.setState({ showingCardEntry: false });
    const cardEntryConfig = {
      collectPostalCode: true,
    };
    if (Platform.OS === 'ios') {
      await SQIPCardEntry.setIOSCardEntryTheme({
        ...iOSCardEntryTheme,
        saveButtonTitle: 'Pay 🍪',
      });
    }
    await SQIPCardEntry.startCardEntryFlow(
      cardEntryConfig,
      this.onCardNonceRequestSuccess,
      this.onCardEntryCancel,
    );
  }

  async startGiftCardEntry() {
    console.log('STARTING gift card entry');
    this.setState({ showingGiftCardEntry: false });
    if (Platform.OS === 'ios') {
      await SQIPCardEntry.setIOSCardEntryTheme({
        ...iOSCardEntryTheme,
        saveButtonTitle: 'Pay 🍪',
      });
    }
    await SQIPCardEntry.startGiftCardEntryFlow(
      this.onCardNonceRequestSuccess,
      this.onCardEntryCancel,
    );
  }

  async startCustomerCardEntry() {
    this.setState({ showingCustomerCardEntry: false });
    const cardEntryConfig = {
      collectPostalCode: true,
    };
    if (Platform.OS === 'ios') {
      await SQIPCardEntry.setIOSCardEntryTheme({
        ...iOSCardEntryTheme,
        saveButtonTitle: 'Save 🍪',
      });
    }
    await SQIPCardEntry.startCardEntryFlow(
      cardEntryConfig,
      this.onCustomerCardNonceRequestSuccess,
      this.onCustomerCardEntryCancel,
    );
  }

  async startCardEntryWithBuyerVerification() {
    this.setState({ showingCardEntry: false });
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
      postalCode: 'SE1 7',
    };
    await SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
      cardEntryConfig,
      this.onBuyerVerificationSuccess,
      this.onBuyerVerificationFailure,
      this.onCardEntryCancel,
    );
  }

  async startDigitalWallet() {
    if (Platform.OS === 'ios' && this.state.canUseDigitalWallet) {
      if (!this.applePayMerchantIsSet()) {
        showAlert('Missing Apple Merchant ID',
          'To request an Apple Pay nonce, replace APPLE_PAY_MERCHANT_ID'
          + ' in Constants.js with an Apple Merchant ID.');
      } else {
        await SQIPApplePay.requestApplePayNonce(
          {
            price: '1.00',
            summaryLabel: 'Test Item',
            countryCode: 'US',
            currencyCode: 'USD',
            paymentType: SQIPApplePay.PaymentTypeFinal,
          },
          this.onApplePayRequestNonceSuccess,
          this.onApplePayRequestNonceFailure,
          this.onApplePayComplete,
        );
      }
    } else if (Platform.OS === 'android') {
      if (!this.googlePayLocationIsSet()) {
        showAlert('Missing GooglePay Location ID',
          'To request a GooglePay nonce, replace GOOGLE_PAY_LOCATION_ID'
          + ' in Constants.js with an Square Location ID.');
      } else {
        await SQIPGooglePay.requestGooglePayNonce(
          {
            price: '1.00',
            currencyCode: 'USD',
            priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
          },
          this.onGooglePayRequestNonceSuccess,
          this.onGooglePayRequestNonceFailure,
          this.onGooglePayCanceled,
        );
      }
    }
  }

  renderModal() {
    if (this.state.showingPendingScreen) {
      return <PendingModal />;
    // eslint-disable-next-line no-else-return
    } else if (this.state.showingCardsOnFileScreen) {
      return (
        <CardsOnFileModal
          onCloseCardsOnFileScreen={this.closeCardsOnFileScreen}
          onShowCustomerCardEntry={this.onShowCustomerCardEntry}
          onSelectCardOnFile={this.onSelectCardOnFile}
          cardsOnFile={this.state.cardsOnFile}
        />
      );
    } else {
      return (
        <OrderModal
          onCloseOrderScreen={this.closeOrderScreen}
          onPayWithGiftCard={this.onShowGiftCardEntry}
          onPayWithCard={this.customerIdIsSet() ? this.showCardsOnFileScreen : this.onShowCardEntry}
          onShowDigitalWallet={this.onShowDigitalWallet}
          onBuyerVerification={this.onBuyerVerification}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={cookieImage} />
        <Text style={styles.title}>Super Cookie</Text>
        <Text style={styles.description}>
          Instantly gain special powers when ordering a super cookie
        </Text>
        <GreenButton
          onPress={this.showOrderScreen}
          text="Buy"
        />
        <Modal
          isVisible={this.state.showingBottomSheet}
          style={styles.bottomModal}
          onBackdropPress={this.closeOrderScreen}
          // set timeout due to iOS needing to make sure modal is closed
          // before presenting another view
          onModalHide={() => setTimeout(() => this.checkStateAndPerform(), 200)}
        >
          <View style={styles.modalContent}>
            {this.renderModal()}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#78CCC5',
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
    textAlign: 'center',
  },
  modalContent: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0,
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
  },
});
