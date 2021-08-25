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
import FailureCallback from './models/FailureCallback';
import BuyerVerificationSuccessCallback from './models/BuyerVerificationSuccessCallback';
import CancelAndCompleteCallback from './models/CancelAndCompleteCallback';
import CardDetails from './models/CardDetails';
import CardEntryConfig from './models/CardEntryConfig';
import NonceSuccessCallback from './models/NonceSuccessCallback';
import ErrorDetails from './models/ErrorDetails';
import VerificationResult from './models/VerificationResult';
import Utilities from './Utilities';
import ThemeType from './models/ThemeType';

const { RNSQIPCardEntry } = NativeModules;

let cardEntryCancelCallback: () => void;
const onNativeCardEntryCanceled = () => {
  if (cardEntryCancelCallback) cardEntryCancelCallback();
};

let cardEntryCardNonceRequestSuccessCallback: { (cardDetails:CardDetails) : void; };
const onNativeCardEntryDidObtainCardDetails = (cardDetails:CardDetails) => {
  if (cardEntryCardNonceRequestSuccessCallback) {
    cardEntryCardNonceRequestSuccessCallback(cardDetails);
  }
};

let cardEntryCompleteCallback: () => void;
const onNativeCardEntryComplete = () => {
  if (cardEntryCompleteCallback) cardEntryCompleteCallback();
};

let buyerVerificationSuccessCallback:{ (verificationResult:VerificationResult) : void; };
const onNativeBuyerVerificationSuccess = (verificationResult:VerificationResult) => {
  if (buyerVerificationSuccessCallback) {
    buyerVerificationSuccessCallback(verificationResult);
  }
};

let buyerVerificationErrorCallback:{ (error:ErrorDetails) : void; };
const onNativeBuyerVerificationError = (error:ErrorDetails) => {
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

const startCardEntryFlow = async (cardEntryConfig:CardEntryConfig,
  onCardNonceRequestSuccess:NonceSuccessCallback,
  onCardEntryCancel:CancelAndCompleteCallback) => {
  let cardEntryInternalConfig : CardEntryConfig = { collectPostalCode: true };
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
};

const startBuyerVerificationFlow = async (paymentSourceId:string,
  cardEntryConfig:CardEntryConfig,
  onBuyerVerificationSuccess:BuyerVerificationSuccessCallback,
  onBuyerVerificationFailure:FailureCallback,
  onCardEntryCancel:CancelAndCompleteCallback) => {
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
  await RNSQIPCardEntry.startBuyerVerificationFlow(
    paymentSourceId, cardEntryConfig.squareLocationId, cardEntryConfig.buyerAction, money, contact,
  );
};

const startCardEntryFlowWithBuyerVerification = async (cardEntryConfig:CardEntryConfig,
  onBuyerVerificationSuccess:BuyerVerificationSuccessCallback,
  onBuyerVerificationFailure:FailureCallback,
  onCardEntryCancel:CancelAndCompleteCallback) => {
  let cardEntryInternalConfig : CardEntryConfig = { collectPostalCode: true };
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
};

const startGiftCardEntryFlow = async (onCardNonceRequestSuccess:NonceSuccessCallback,
  onCardEntryCancel:CancelAndCompleteCallback) => {
  cardEntryCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  cardEntryCancelCallback = onCardEntryCancel;
  await RNSQIPCardEntry.startGiftCardEntryFlow();
};

const completeCardEntry = async (onCardEntryComplete:CancelAndCompleteCallback) => {
  cardEntryCompleteCallback = onCardEntryComplete;
  await RNSQIPCardEntry.completeCardEntry();
};

const showCardNonceProcessingError = async (errorMessage:string) => {
  Utilities.verifyStringType(errorMessage, 'errorMessage should be a string');
  await RNSQIPCardEntry.showCardNonceProcessingError(errorMessage);
};

const setIOSCardEntryTheme = async (theme:ThemeType) => {
  Utilities.verifyThemeType(theme);
  await RNSQIPCardEntry.setTheme(theme);
};

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
