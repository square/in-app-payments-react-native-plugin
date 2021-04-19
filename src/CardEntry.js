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
import { NativeModules, NativeEventEmitter, Platform } from 'react-native'; // eslint-disable-line import/no-unresolved
import Utilities from './Utilities';

const { RNSQIPCardEntry } = NativeModules;

let cardEntryCancelCallback;
const onNativeCardEntryCanceled = () => {
  if (cardEntryCancelCallback) cardEntryCancelCallback();
};

let cardEntryCardNonceRequestSuccessCallback;
const onNativeCardEntryDidObtainCardDetails = (cardDetails) => {
  if (cardEntryCardNonceRequestSuccessCallback) {
    cardEntryCardNonceRequestSuccessCallback(cardDetails);
  }
};

let cardEntryCompleteCallback;
const onNativeCardEntryComplete = () => {
  if (cardEntryCompleteCallback) cardEntryCompleteCallback();
};

let buyerVerificationSuccessCallback;
const onNativeBuyerVerificationSuccess = (verificationResult) => {
  if (buyerVerificationSuccessCallback) {
    buyerVerificationSuccessCallback(verificationResult);
  }
};

let buyerVerificationErrorCallback;
const onNativeBuyerVerificationError = (error) => {
  if (buyerVerificationErrorCallback) {
    buyerVerificationErrorCallback(error);
  }
};

const cardEntryEmitter = new NativeEventEmitter(RNSQIPCardEntry);
cardEntryEmitter.addListener('cardEntryCancel', onNativeCardEntryCanceled);
cardEntryEmitter.addListener('cardEntryDidObtainCardDetails', onNativeCardEntryDidObtainCardDetails);
cardEntryEmitter.addListener('cardEntryComplete', onNativeCardEntryComplete);
cardEntryEmitter.addListener('onBuyerVerificationSuccess', onNativeBuyerVerificationSuccess);
cardEntryEmitter.addListener('onBuyerVerificationError', onNativeBuyerVerificationError);

async function startCardEntryFlow(cardEntryConfig, onCardNonceRequestSuccess, onCardEntryCancel) {
  let cardEntryInternalConfig = {};
  if (cardEntryConfig) {
    Utilities.verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object.');
    cardEntryInternalConfig = cardEntryConfig;
  }
  if (cardEntryInternalConfig.collectPostalCode != null) {
    Utilities.verifyBooleanType(cardEntryInternalConfig.collectPostalCode, 'cardEntryConfig.collectPostalCode should be a boolean.');
  } else {
    // the default collectPostalCode is true
    cardEntryInternalConfig.collectPostalCode = true;
  }

  cardEntryCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  cardEntryCancelCallback = onCardEntryCancel;
  await RNSQIPCardEntry.startCardEntryFlow(cardEntryInternalConfig.collectPostalCode);
}

async function startBuyerVerificationFlow(paymentSourceId,
  cardEntryConfig, onBuyerVerificationSuccess, onBuyerVerificationFailure, onCardEntryCancel) {
  let cardEntryInternalConfig = {};
  if (cardEntryConfig) {
    Utilities.verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object.');
    cardEntryInternalConfig = cardEntryConfig;
  }
  const { squareLocationId } = cardEntryConfig;
  const { buyerAction } = cardEntryConfig;
  const money = {
    amount: cardEntryConfig.amount,
    currencyCode: cardEntryConfig.currencyCode,
  };
  const contact = {
    givenName: cardEntryConfig.givenName,
    familyName: cardEntryConfig.familyName,
    addressLines: cardEntryConfig.addressLines,
    city: cardEntryConfig.city,
    countryCode: cardEntryConfig.countryCode,
    email: cardEntryConfig.email,
    phone: cardEntryConfig.phone,
    postalCode: cardEntryConfig.postalCode,
    region: cardEntryConfig.region,
  };

  buyerVerificationSuccessCallback = onBuyerVerificationSuccess;
  buyerVerificationErrorCallback = onBuyerVerificationFailure;
  cardEntryCancelCallback = onCardEntryCancel;
  await RNSQIPCardEntry.startBuyerVerificationFlow(paymentSourceId,
     squareLocationId, buyerAction, money, contact,
  );
}

async function startCardEntryFlowWithBuyerVerification(
  cardEntryConfig, onBuyerVerificationSuccess, onBuyerVerificationFailure, onCardEntryCancel,
) {
  let cardEntryInternalConfig = {};
  if (cardEntryConfig) {
    Utilities.verifyObjectType(cardEntryConfig, 'cardEntryConfig should be an object.');
    cardEntryInternalConfig = cardEntryConfig;
  }
  if (cardEntryInternalConfig.collectPostalCode != null) {
    Utilities.verifyBooleanType(cardEntryInternalConfig.collectPostalCode, 'cardEntryConfig.collectPostalCode should be a boolean.');
  } else {
    // the default collectPostalCode is true
    cardEntryInternalConfig.collectPostalCode = true;
  }

  const { squareLocationId } = cardEntryConfig;
  const { buyerAction } = cardEntryConfig;
  const money = {
    amount: cardEntryConfig.amount,
    currencyCode: cardEntryConfig.currencyCode,
  };
  const contact = {
    givenName: cardEntryConfig.givenName,
    familyName: cardEntryConfig.familyName,
    addressLines: cardEntryConfig.addressLines,
    city: cardEntryConfig.city,
    countryCode: cardEntryConfig.countryCode,
    email: cardEntryConfig.email,
    phone: cardEntryConfig.phone,
    postalCode: cardEntryConfig.postalCode,
    region: cardEntryConfig.region,
  };

  buyerVerificationSuccessCallback = onBuyerVerificationSuccess;
  buyerVerificationErrorCallback = onBuyerVerificationFailure;
  cardEntryCancelCallback = onCardEntryCancel;
  await RNSQIPCardEntry.startCardEntryFlowWithVerification(
    cardEntryInternalConfig.collectPostalCode, squareLocationId, buyerAction, money, contact,
  );
}

async function startGiftCardEntryFlow(onCardNonceRequestSuccess, onCardEntryCancel) {
  cardEntryCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  cardEntryCancelCallback = onCardEntryCancel;
  await RNSQIPCardEntry.startGiftCardEntryFlow();
}

async function completeCardEntry(onCardEntryComplete) {
  cardEntryCompleteCallback = onCardEntryComplete;
  await RNSQIPCardEntry.completeCardEntry();
}

async function showCardNonceProcessingError(errorMessage) {
  Utilities.verifyStringType(errorMessage, 'errorMessage should be a string');
  await RNSQIPCardEntry.showCardNonceProcessingError(errorMessage);
}

async function setIOSCardEntryTheme(theme) {
  Utilities.verifyThemeType(theme);
  await RNSQIPCardEntry.setTheme(theme);
}

export default Platform.select({
  ios: {
    startGiftCardEntryFlow,
    startCardEntryFlow,
    startCardEntryFlowWithBuyerVerification,
    completeCardEntry,
    showCardNonceProcessingError,
    setIOSCardEntryTheme,
    startBuyerVerificationFlow,
  },
  android: {
    startGiftCardEntryFlow,
    startCardEntryFlow,
    startCardEntryFlowWithBuyerVerification,
    completeCardEntry,
    showCardNonceProcessingError,
    startBuyerVerificationFlow,
  },
});
