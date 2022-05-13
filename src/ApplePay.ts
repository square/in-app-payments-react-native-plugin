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
import { NativeModules, NativeEventEmitter } from 'react-native'; // eslint-disable-line import/no-unresolved
import ApplePayConfig from './models/ApplePayConfig';
import CancelAndCompleteCallback from './models/CancelAndCompleteCallback';
import CardDetails from './models/CardDetails';
import ErrorDetails from './models/ErrorDetails';
import FailureCallback from './models/FailureCallback';
import NonceSuccessCallback from './models/NonceSuccessCallback';
import PaymentType from './models/PaymentType';
import Utilities from './Utilities';

// const PaymentTypePending = 1;
// const PaymentTypeFinal = 2;
const { RNSQIPApplePay } = NativeModules;

let applePayNonceRequestSuccessCallback: { (cardDetails:CardDetails) : void; };
const onNativeApplePayNonceRequestSuccess = (cardDetails:CardDetails) => {
  if (applePayNonceRequestSuccessCallback) applePayNonceRequestSuccessCallback(cardDetails);
};

let applePayNonceRequestFailureCallback:{ (error:ErrorDetails) : void; };
const onNativeApplePayNonceRequestFailure = (error:ErrorDetails) => {
  if (applePayNonceRequestFailureCallback) applePayNonceRequestFailureCallback(error);
};

let applePayCompleteCallback: () => void;
const onNativeApplePayComplete = () => {
  if (applePayCompleteCallback) applePayCompleteCallback();
};

const applePayEmitter = new NativeEventEmitter(RNSQIPApplePay);
applePayEmitter.addListener('onApplePayNonceRequestSuccess', onNativeApplePayNonceRequestSuccess);
applePayEmitter.addListener('onApplePayNonceRequestFailure', onNativeApplePayNonceRequestFailure);
applePayEmitter.addListener('onApplePayComplete', onNativeApplePayComplete);

const initializeApplePay = async (applePayMerchantId:string) => {
  Utilities.verifyStringType(applePayMerchantId, 'applePayMerchantId should be a string');
  await RNSQIPApplePay.initializeApplePay(applePayMerchantId);
};

const canUseApplePay = () => RNSQIPApplePay.canUseApplePay();

const requestApplePayNonce = async (
  applePayConfig:ApplePayConfig,
  onApplePayNonceRequestSuccess:NonceSuccessCallback,
  onApplePayNonceRequestFailure:FailureCallback,
  onApplePayComplete:CancelAndCompleteCallback,
) => {
  Utilities.verifyObjectType(applePayConfig, 'applePayConfig should be a valid object');
  Utilities.verifyStringType(applePayConfig.price, 'applePayConfig.price should be a valid string');
  Utilities.verifyStringType(applePayConfig.summaryLabel, 'applePayConfig.summaryLabel should be a valid string');
  Utilities.verifyStringType(applePayConfig.countryCode, 'applePayConfig.countryCode should be a valid string');
  Utilities.verifyStringType(applePayConfig.currencyCode, 'applePayConfig.currencyCode should be a valid string');

  applePayNonceRequestSuccessCallback = onApplePayNonceRequestSuccess;
  applePayNonceRequestFailureCallback = onApplePayNonceRequestFailure;
  applePayCompleteCallback = onApplePayComplete;

  let { paymentType } = applePayConfig;
  if (!applePayConfig.paymentType) {
    paymentType = PaymentType.PaymentTypeFinal;
  } else {
    Utilities.verifyIntegerType(applePayConfig.paymentType, 'applePayConfig.paymentType should be a valid integer');
  }

  try {
    await RNSQIPApplePay.requestApplePayNonce(
      applePayConfig.price,
      applePayConfig.summaryLabel,
      applePayConfig.countryCode,
      applePayConfig.currencyCode,
      paymentType,
    );
  } catch (ex) {
    throw Utilities.createInAppPayementsError(ex);
  }
};

const completeApplePayAuthorization = async (isSuccess:boolean, errorMessage = '') => {
  Utilities.verifyBooleanType(isSuccess, 'isSuccess should be a valid boolean');
  Utilities.verifyStringType(errorMessage, 'errorMessage should be a valid string');

  await RNSQIPApplePay.completeApplePayAuthorization(isSuccess, errorMessage);
};

export default {
  initializeApplePay,
  canUseApplePay,
  requestApplePayNonce,
  completeApplePayAuthorization,
};
