/*
 Copyright 2022 Square Inc.

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
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
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
import { printCurlCommand, showAlert } from '../Utilities';
import chargeCardNonce from '../service/Charge';
import createCustomerCard from '../service/CreateCustomerCard';
import chargeCustomerCard from '../service/ChargeCustomerCard';
import CommonAlert from '../components/CommonAlert';
import { SQIPApplePay, SQIPCardEntry, SQIPCore, SQIPGooglePay } from "react-native-square-in-app-payments";

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

interface ErrorInfo {
  message: string;
}

let errorMsg = null;

export default function HomeScreen() {
  const [showingBottomSheet, setshowingBottomSheet] = useState(false);
  const [showingCardsOnFileScreen, setshowingCardsOnFileScreen] =
    useState(false);
  const [showingPendingScreen, setshowingPendingScreen] = useState(false);
  const [showingCardEntry, setshowingCardEntry] = useState(false);
  const [showingGiftCardEntry, setshowingGiftCardEntry] = useState(false);
  const [showingCustomerCardEntry, setshowingCustomerCardEntry] =
    useState(false);
  const [showingDigitalWallet, setshowingDigitalWallet] = useState(false);
  const [canUseDigitalWallet, setcanUseDigitalWallet] = useState(false);
  const [showingBuyerVerification, setshowingBuyerVerification] =
    useState(false);
  const [applePayState, setapplePayState] = useState(applePayStatus.none);
  const [applePayError, setapplePayError] = useState(null);
  const [cardsOnFile, setcardsOnFile] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [showingDialogSheet, setshowingDialogSheet] = useState(false);

  useEffect(() => {
    initState();
  });

  interface CardDetails {
    nonce: string;
    card: {
      prepaidType: string,
      expirationYear: number,
      brand: string,
      postalCode: string,
      expirationMonth: number,
      type: string,
      lastFourDigits: string
    };
  }

  interface BuyerVerificationDetails {
    nonce: string;
    token: string;
  }

  interface CardOnFile {
    id: string;
  }

  const initState = async () => {
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
        GOOGLE_PAY_LOCATION_ID,
        SQIPGooglePay.EnvironmentTest,
      );
      try {
        digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay();
      } catch (ex) {
        console.log(ex);
      }
    }
    setcanUseDigitalWallet(digitalWalletEnabled);
  };

  const onApplePayRequestNonceSuccess = async (cardDetails: CardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        await SQIPApplePay.completeApplePayAuthorization(true);
        setapplePayState(applePayStatus.succeeded);
      } catch (error: any) {
        await SQIPApplePay.completeApplePayAuthorization(false, error.message);
        setapplePayError(error.message);
      }
    } else {
      await SQIPApplePay.completeApplePayAuthorization(true);
      setapplePayState(applePayStatus.nonceNotCharged);
      printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
    }
  };

  const onApplePayRequestNonceFailure = async (errorInfo: ErrorInfo) => {
    errorMsg = errorInfo.message;
    await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message);
    setAlertValue('Error processing Apple Pay payment', errorMsg, false);
  };

  const onApplePayComplete = async () => {
    if (applePayState === applePayStatus.succeeded) {
      setAlertValue(
        'Congratulation, Your order was successful',
        'Go to your Square dashboard to see this order reflected in the sales tab.',
        true
      );
    } else if (applePayState === applePayStatus.nonceNotCharged) {
      setAlertValue(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        true
      );
    } else if (applePayError != null) {
      setAlertValue('Error processing Apple Pay payment', applePayError, false);
    } else {
      // the state is none, so they canceled
      showOrderScreen();
    }
  };

  const onGooglePayRequestNonceSuccess = async (cardDetails: CardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        setAlertValue(
          'Congratulation, Your order was successful',
          'Go to your Square dashbord to see this order reflected in the sales tab.',
          true
        );
      } catch (error: any) {
        setAlertValue('Error processing GooglePay payment', error.message, false);
      }
    } else {
      printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
      setAlertValue(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        true
      );
    }
  };

  const onGooglePayRequestNonceFailure = (errorInfo: any) => {
    setAlertValue('Could not create GooglePay nonce', errorInfo, false);
  };

  const onGooglePayCanceled = () => {
    showOrderScreen();
  };

  const onCardNonceRequestSuccess = async (cardDetails: CardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        SQIPCardEntry.completeCardEntry(() => {
          console.log(JSON.stringify(cardDetails));
          var cardData = cardDetails.card;
          setAlertValue('Congratulation, Your order was successful',
            'Go to your Square dashbord to see this order reflected in the sales tab.',
            true)
        });
      } catch (error: any) {
        SQIPCardEntry.showCardNonceProcessingError(error.message);
      }
    } else {
      SQIPCardEntry.completeCardEntry(() => {
        printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
        setAlertValue(
          'Nonce generated but not charged',
          'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
          true)
      });
    }
  };

  const onSelectCardOnFile = async (cardOnFile: CardOnFile) => {
    try {
      showPendingScreen();
      await chargeCustomerCard(CUSTOMER_ID, cardOnFile.id);
      setAlertValue(
        'Congratulation, Your order was successful',
        'Go to your Square dashbord to see this order reflected in the sales tab.',
        true
      );
    } catch (error: any) {
      setAlertValue(
        'An error occured processing the card on file',
        error.message,
        false,
      );
    }
  };

  const onCustomerCardNonceRequestSuccess = async (
    cardDetails: CardDetails,
  ) => {
    if (chargeServerHostIsSet()) {
      try {
        // create the customer card record and add it to the state
        const customerCard = await createCustomerCard(
          CUSTOMER_ID,
          cardDetails.nonce,
        );
        // eslint-disable-next-line react/no-access-state-in-setstate
        var array = [...cardsOnFile, customerCard];
        setcardsOnFile(array);
        SQIPCardEntry.completeCardEntry(() => {
          setAlertValue('Your card was saved and is ready to use.', '', true);
        });
        showCardsOnFileScreen();
      } catch (error: any) {
        SQIPCardEntry.showCardNonceProcessingError(error.message);
      }
    } else {
      SQIPCardEntry.completeCardEntry(() => {
        setAlertValue(
          'Customer card nonce generated but not charged',
          'Replace CHARGE_SERVER_HOST with your server host to enable saving the card.',
          true
        );
      });
    }
  };

  const onCardEntryCancel = () => {
    showOrderScreen();
  };

  const onCustomerCardEntryCancel = () => {
    showCardsOnFileScreen();
  };

  const onShowDigitalWallet = () => {
    closeOrderScreen();
    setshowingDigitalWallet(true);
  };

  const onShowCardEntry = () => {
    closeOrderScreen();
    setshowingCardEntry(true);
  };

  const onShowGiftCardEntry = () => {
    closeOrderScreen();
    setshowingGiftCardEntry(true);
  };

  const onShowCustomerCardEntry = () => {
    closeOrderScreen();
    setshowingCustomerCardEntry(true);
  };

  const onBuyerVerification = () => {
    closeOrderScreen();
    setshowingBuyerVerification(true);
  };

  const onBuyerVerificationSuccess = async (
    buyerVerificationDetails: BuyerVerificationDetails,
  ) => {
    if (
      chargeServerHostIsSet() &&
      buyerVerificationDetails.nonce !==
      'ccof:customer-card-id-requires-verification'
    ) {
      try {
        await chargeCardNonce(
          buyerVerificationDetails.nonce,
          buyerVerificationDetails.token,
        );
        setAlertValue(
          'Congratulation, Your order was successful',
          'Go to your Square dashbord to see this order reflected in the sales tab.',
          true
        );
      } catch (error: any) {
        setAlertValue('Error processing card payment', error.message, false);
      }
    } else {
      printCurlCommand(
        buyerVerificationDetails.nonce,
        SQUARE_APP_ID,
        buyerVerificationDetails.token,
      );
      setAlertValue(
        'Nonce and verification token generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        true
      );
    }
  };

  const onBuyerVerificationFailure = (errorInfo: ErrorInfo) => {
    setAlertValue('Error verifying buyer', errorInfo.message, false);
  };

  const showOrderScreen = () => {
    setshowingBottomSheet(true);
    setshowingCardsOnFileScreen(false);
    setshowingPendingScreen(false);
  };

  const closeOrderScreen = () => {
    setshowingBottomSheet(false);
  };

  const showCardsOnFileScreen = () => {
    setshowingBottomSheet(true);
    setshowingCardsOnFileScreen(true);
    setshowingPendingScreen(false);
  };

  const closeCardsOnFileScreen = () => {
    setshowingCardsOnFileScreen(false);
  };

  const showPendingScreen = () => {
    setshowingPendingScreen(true);
    setshowingCardsOnFileScreen(true);
  };

  const applicationIdIsSet = async () => {
    return SQUARE_APP_ID;
  };

  const chargeServerHostIsSet = () => {
    return CHARGE_SERVER_HOST;
  };

  const googlePayLocationIsSet = () => {
    return GOOGLE_PAY_LOCATION_ID !== 'REPLACE_ME';
  };

  const applePayMerchantIsSet = () => {
    return APPLE_PAY_MERCHANT_ID !== 'REPLACE_ME';
  };

  const customerIdIsSet = () => {
    return CUSTOMER_ID !== 'REPLACE_ME';
  };

  const checkStateAndPerform = async () => {
    if (showingCardEntry) {
      // if application id is not set, we will let you know where to set it,
      // but the card entry will still open due to allowing visuals to be shown
      if (!applicationIdIsSet()) {
        setAlertValue(
          'Missing Square Application ID',
          'To request a nonce, replace SQUARE_APP_ID in Constants.js with an Square Application ID.',
          false,
        );
      } else {
        // call this.startCardEntry() to start Card Entry without buyer verification (SCA)
        startCardEntry();
        // OR call this.startCardEntryWithBuyerVerification() to
        // start Card Entry with buyer verification (SCA)
        // NOTE this requires _squareLocationSet to be set
        // this.startCardEntryWithBuyerVerification();
      }
    } else if (showingCustomerCardEntry) {
      // if application id is not set, we will let you know where to set it,
      // but the card entry will still open due to allowing visuals to be shown
      if (!applicationIdIsSet()) {
        setAlertValue(
          'Missing Square Application ID',
          'To request a nonce, replace SQUARE_APP_ID in Constants.js with an Square Application ID.',
          false,
        );
      } else {
        startCustomerCardEntry();
      }
    } else if (showingGiftCardEntry) {
      startGiftCardEntry();
    } else if (showingDigitalWallet) {
      startDigitalWallet();
      setshowingDigitalWallet(false);
    } else if (showingBuyerVerification) {
      startBuyerVerificationFlow();
    }
  };

  const startBuyerVerificationFlow = async () => {
    console.log('STARTING Buyer Verification');
    setshowingBuyerVerification(false);
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
      onBuyerVerificationSuccess,
      onBuyerVerificationFailure,
      onCardEntryCancel,
    );
  };

  const startCardEntry = async () => {
    console.log('STARTING card entry');
    setshowingCardEntry(false);
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
      onCardNonceRequestSuccess,
      onCardEntryCancel,
    );
  };

  const startGiftCardEntry = async () => {
    console.log('STARTING gift card entry');
    setshowingGiftCardEntry(false);
    if (Platform.OS === 'ios') {
      await SQIPCardEntry.setIOSCardEntryTheme({
        ...iOSCardEntryTheme,
        saveButtonTitle: 'Pay 🍪',
      });
    }
    await SQIPCardEntry.startGiftCardEntryFlow(
      onCardNonceRequestSuccess,
      onCardEntryCancel,
    );
  };

  const startCustomerCardEntry = async () => {
    setshowingCustomerCardEntry(false);
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
      onCustomerCardNonceRequestSuccess,
      onCustomerCardEntryCancel,
    );
  };

  // const startCardEntryWithBuyerVerification = async () => {
  //   setshowingCardEntry(false)
  //   const cardEntryConfig = {
  //     collectPostalCode: true,
  //     squareLocationId: SQUARE_LOCATION_ID,
  //     buyerAction: 'Charge',
  //     amount: 100,
  //     currencyCode: 'USD',
  //     givenName: 'John',
  //     familyName: 'Doe',
  //     addressLines: ['London Eye', 'Riverside Walk'],
  //     city: 'London',
  //     countryCode: 'GB',
  //     email: 'johndoe@example.com',
  //     phone: '8001234567',
  //     postalCode: 'SE1 7',
  //   };
  //   await SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
  //     cardEntryConfig,
  //     onBuyerVerificationSuccess,
  //     onBuyerVerificationFailure,
  //     onCardEntryCancel,
  //   );
  // }

  const startDigitalWallet = async () => {
    if (Platform.OS === 'ios' && canUseDigitalWallet) {
      if (!applePayMerchantIsSet()) {
        setAlertValue(
          'Missing Apple Merchant ID',
          'To request an Apple Pay nonce, replace APPLE_PAY_MERCHANT_ID' +
          ' in Constants.js with an Apple Merchant ID.',
          false
        );
      } else {
        await SQIPApplePay.requestApplePayNonce(
          {
            price: '1.00',
            summaryLabel: 'Test Item',
            countryCode: 'US',
            currencyCode: 'USD',
            paymentType: SQIPApplePay.PaymentTypeFinal,
          },
          onApplePayRequestNonceSuccess,
          onApplePayRequestNonceFailure,
          onApplePayComplete,
        );
      }
    } else if (Platform.OS === 'android') {
      if (!googlePayLocationIsSet()) {
        setAlertValue(
          'Missing GooglePay Location ID',
          'To request a GooglePay nonce, replace GOOGLE_PAY_LOCATION_ID' +
          ' in Constants.js with an Square Location ID.',
          false
        );
      } else {
        await SQIPGooglePay.requestGooglePayNonce(
          {
            price: '1.00',
            currencyCode: 'USD',
            priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
          },
          onGooglePayRequestNonceSuccess,
          onGooglePayRequestNonceFailure,
          onGooglePayCanceled,
        );
      }
    }
  };

  const renderModal = () => {
    if (showingPendingScreen) {
      return <PendingModal />;
      // eslint-disable-next-line no-else-return
    } else if (showingCardsOnFileScreen) {
      return (
        <CardsOnFileModal
          onCloseCardsOnFileScreen={() => closeCardsOnFileScreen()}
          onShowCustomerCardEntry={() => onShowCustomerCardEntry()}
          onSelectCardOnFile={() => onSelectCardOnFile}
          cardsOnFile={cardsOnFile}
        />
      );
    } else {
      return (
        <OrderModal
          onCloseOrderScreen={() => closeOrderScreen()}
          onPayWithGiftCard={() => onShowGiftCardEntry()}
          onPayWithCard={() =>
            customerIdIsSet() ? showCardsOnFileScreen() : onShowCardEntry()
          }
          onShowDigitalWallet={() => onShowDigitalWallet()}
          onBuyerVerification={() => onBuyerVerification()}
        />
      );
    }
  };

  const showCommonAlert = (title: string, description: string) => {
    return (
      <CommonAlert title={title} description={description} status={status} isVisible={showingDialogSheet} onDialogClick={onDialogClick} />
    )
  }

  const setAlertValue = (title, description, status) => {
    setshowingDialogSheet(true)
    setTitle(title)
    setDescription(description)
    setStatus(status)
  }

  const onDialogClick = () => {
    setshowingDialogSheet(false)
  }

  return (
    <View style={styles.container}>
      <Image source={require('../images/iconCookie.png')} />
      <Text style={styles.title}>Super Cookie</Text>
      <Text style={styles.description}>
        Instantly gain special powers when ordering a super cookie
      </Text>
      <GreenButton onPress={() => { setshowingBottomSheet(true) }} text="Buy" />
      {showCommonAlert(title, description)}
      <Modal
        isVisible={showingBottomSheet}
        style={styles.bottomModal}
        onBackdropPress={closeOrderScreen}
        // set timeout due to iOS needing to make sure modal is closed
        // before presenting another view
        onModalHide={() => setTimeout(() => checkStateAndPerform(), 200)}>
        <View style={styles.modalContent}>{renderModal()}</View>
      </Modal>
    </View>
  );
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
