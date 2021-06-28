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
import { Platform, NativeModules, NativeEventEmitter } from 'react-native'; // eslint-disable-line import/no-unresolved
import { CardDetails } from './models/CardDetails';
import { ErrorDetails } from './models/ErrorDetails';
import Utilities from './Utilities';

const { RNSQIPGooglePay } = NativeModules;

let googlePayNonceRequestSuccessCallback: {(cardDetails:CardDetails) : void;};
const onNativeGooglePayNonceRequestSuccess = (cardDetails:CardDetails) => {
  if (googlePayNonceRequestSuccessCallback) googlePayNonceRequestSuccessCallback(cardDetails);
};

let googlePayNonceRequestFailureCallback:{ (error:ErrorDetails) : void;};
const onNativeGooglePayNonceRequestFailure = (error:ErrorDetails) => {
  if (googlePayNonceRequestFailureCallback) googlePayNonceRequestFailureCallback(error);
};

let googlePayCancelCallback: () => void;
const onNativeGooglePayCanceled = () => {
  if (googlePayCancelCallback) googlePayCancelCallback();
};

if (Platform.OS === 'android') {
  const googlePayEmitter = new NativeEventEmitter(RNSQIPGooglePay);
  googlePayEmitter.addListener('onGooglePayNonceRequestSuccess', onNativeGooglePayNonceRequestSuccess);
  googlePayEmitter.addListener('onGooglePayNonceRequestFailure', onNativeGooglePayNonceRequestFailure);
  googlePayEmitter.addListener('onGooglePayCanceled', onNativeGooglePayCanceled);
}

async function initializeGooglePay(squareLocationId:string, environment:any) {
  Utilities.verifyStringType(squareLocationId, 'squareLocationId should be a valid string');
  Utilities.verifyIntegerType(environment, 'environment should be a valid integer');

  await RNSQIPGooglePay.initializeGooglePay(squareLocationId, environment);
}

async function canUseGooglePay() {
  try {
    return await RNSQIPGooglePay.canUseGooglePay();
  } catch (ex) {
    throw Utilities.createInAppPayementsError(ex);
  }
}

async function requestGooglePayNonce(
  googlePayConfig:any,
  onGooglePayNonceRequestSuccess:any,
  onGooglePayNonceRequestFailure:any,
  onGooglePayCanceled:any,
) {
  Utilities.verifyObjectType(googlePayConfig, 'googlePayConfig should be a valid object');
  Utilities.verifyStringType(googlePayConfig.price, 'googlePayConfig.price should be a valid string');
  Utilities.verifyStringType(googlePayConfig.currencyCode, 'googlePayConfig.currencyCode should be a valid string');
  Utilities.verifyIntegerType(googlePayConfig.priceStatus, 'googlePayConfig.priceStatus should be a valid integer');

  googlePayNonceRequestSuccessCallback = onGooglePayNonceRequestSuccess;
  googlePayNonceRequestFailureCallback = onGooglePayNonceRequestFailure;
  googlePayCancelCallback = onGooglePayCanceled;

  try {
    await RNSQIPGooglePay.requestGooglePayNonce(
      googlePayConfig.price,
      googlePayConfig.currencyCode,
      googlePayConfig.priceStatus,
    );
  } catch (ex) {
    throw Utilities.createInAppPayementsError(ex);
  }
}

const TotalPriceStatusNotCurrentlyKnown = 1;
const TotalPriceStatusEstimated = 2;
const TotalPriceStatusFinal = 3;

const EnvironmentProduction = 1;
const EnvironmentTest = 3;

export default {
  initializeGooglePay,
  canUseGooglePay,
  requestGooglePayNonce,
  TotalPriceStatusNotCurrentlyKnown,
  TotalPriceStatusEstimated,
  TotalPriceStatusFinal,
  EnvironmentProduction,
  EnvironmentTest,
};
