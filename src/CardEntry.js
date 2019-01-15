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

const cardEntryEmitter = new NativeEventEmitter(RNSQIPCardEntry);
cardEntryEmitter.addListener('cardEntryCancel', onNativeCardEntryCanceled);
cardEntryEmitter.addListener('cardEntryDidObtainCardDetails', onNativeCardEntryDidObtainCardDetails);
cardEntryEmitter.addListener('cardEntryComplete', onNativeCardEntryComplete);

async function startCardEntryFlow(onCardNonceRequestSuccess, onCardEntryCancel) {
  cardEntryCardNonceRequestSuccessCallback = onCardNonceRequestSuccess;
  cardEntryCancelCallback = onCardEntryCancel;
  await RNSQIPCardEntry.startCardEntryFlow();
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
    startCardEntryFlow,
    completeCardEntry,
    showCardNonceProcessingError,
    setIOSCardEntryTheme,
  },
  android: {
    startCardEntryFlow,
    completeCardEntry,
    showCardNonceProcessingError,
  },
});
