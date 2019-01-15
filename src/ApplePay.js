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
import { NativeModules, NativeEventEmitter } from 'react-native'; // eslint-disable-line import/no-unresolved
import Utilities from './Utilities';

const { RNSQIPApplePay } = NativeModules;

let applePayNonceRequestSuccessCallback;
const onNativeApplePayNonceRequestSuccess = (cardDetails) => {
  if (applePayNonceRequestSuccessCallback) applePayNonceRequestSuccessCallback(cardDetails);
};

let applePayNonceRequestFailureCallback;
const onNativeApplePayNonceRequestFailure = (error) => {
  if (applePayNonceRequestFailureCallback) applePayNonceRequestFailureCallback(error);
};

let applePayCompleteCallback;
const onNativeApplePayComplete = () => {
  if (applePayCompleteCallback) applePayCompleteCallback();
};

const applePayEmitter = new NativeEventEmitter(RNSQIPApplePay);
applePayEmitter.addListener('onApplePayNonceRequestSuccess', onNativeApplePayNonceRequestSuccess);
applePayEmitter.addListener('onApplePayNonceRequestFailure', onNativeApplePayNonceRequestFailure);
applePayEmitter.addListener('onApplePayComplete', onNativeApplePayComplete);

async function initializeApplePay(applePayMerchantId) {
  Utilities.verifyStringType(applePayMerchantId, 'applePayMerchantId should be a string');
  await RNSQIPApplePay.initializeApplePay(applePayMerchantId);
}

async function canUseApplePay() {
  return RNSQIPApplePay.canUseApplePay();
}

async function requestApplePayNonce(
  applePayConfig,
  onApplePayNonceRequestSuccess,
  onApplePayNonceRequestFailure,
  onApplePayComplete,
) {
  Utilities.verifyObjectType(applePayConfig, 'applePayConfig should be a valid object');
  Utilities.verifyStringType(applePayConfig.price, 'applePayConfig.price should be a valid string');
  Utilities.verifyStringType(applePayConfig.summaryLabel, 'applePayConfig.summaryLabel should be a valid string');
  Utilities.verifyStringType(applePayConfig.countryCode, 'applePayConfig.countryCode should be a valid string');
  Utilities.verifyStringType(applePayConfig.currencyCode, 'applePayConfig.currencyCode should be a valid string');

  applePayNonceRequestSuccessCallback = onApplePayNonceRequestSuccess;
  applePayNonceRequestFailureCallback = onApplePayNonceRequestFailure;
  applePayCompleteCallback = onApplePayComplete;

  try {
    await RNSQIPApplePay.requestApplePayNonce(
      applePayConfig.price,
      applePayConfig.summaryLabel,
      applePayConfig.countryCode,
      applePayConfig.currencyCode,
    );
  } catch (ex) {
    throw Utilities.createInAppPayementsError(ex);
  }
}

async function completeApplePayAuthorization(isSuccess, errorMessage = '') {
  Utilities.verifyBooleanType(isSuccess, 'isSuccess should be a valid boolean');
  Utilities.verifyStringType(errorMessage, 'errorMessage should be a valid string');

  await RNSQIPApplePay.completeApplePayAuthorization(isSuccess, errorMessage);
}

export default {
  initializeApplePay,
  canUseApplePay,
  requestApplePayNonce,
  completeApplePayAuthorization,
};
