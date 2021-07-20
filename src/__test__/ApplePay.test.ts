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
import {
  NativeModules,
} from 'react-native';
import { EventEmitter } from 'events';
import SQIPApplePay from '../ApplePay';
import Utilities from '../Utilities';
import CardDetails from '../models/CardDetails';
import ErrorDetails from '../models/ErrorDetails';

jest.mock('react-native', () => {
  const emitter = {
    listeners: {},
    addListener: jest.fn((eventName, callback) => {
      emitter.listeners[eventName] = callback;
    }),
  };
  const mockReactNative = {
    MockEventEmitter: emitter,
    NativeEventEmitter: jest.fn(() => emitter),
    NativeModules: {
      RNSQIPApplePay: {
        initializeApplePay: jest.fn(),
        canUseApplePay: jest.fn(() => true),
        requestApplePayNonce: jest.fn(),
        completeApplePayAuthorization: jest.fn(),
      },
    },
  };
  return mockReactNative;
});

const nativeEventEmitter = new EventEmitter();

describe('Test Apple Pay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializeApplePay works as expected', async () => {
    expect.assertions(2);
    try {
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
      const testApplePayMerchantId = 'testMerchantId';
      await SQIPApplePay.initializeApplePay(testApplePayMerchantId);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.initializeApplePay).toHaveBeenCalledTimes(1);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('canUseApplePay works as expected', async () => {
    expect.assertions(2);
    try {
      const result = await SQIPApplePay.canUseApplePay();
      expect(NativeModules.RNSQIPApplePay.canUseApplePay).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with onApplePayNonceRequestSuccess callback', async () => {
    expect.assertions(11);
    try {
      const testApplePayConfig:any = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
        paymentType: SQIPApplePay.PaymentTypePending,
      };
      const mockCardDetails:CardDetails = { nonce: 'fake_nonce' };
      const onApplePayNonceRequestSuccessCallback = jest.fn();
      const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType');
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
      const spyVerifyIntegerType = jest.spyOn(Utilities, 'verifyIntegerType');
      nativeEventEmitter.addListener('onApplePayNonceRequestSuccess', (cardDetails:CardDetails) => {
        onApplePayNonceRequestSuccessCallback(cardDetails);
      });
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        onApplePayNonceRequestSuccessCallback,
        null,
        null,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledWith(
        testApplePayConfig.price,
        testApplePayConfig.summaryLabel,
        testApplePayConfig.countryCode,
        testApplePayConfig.currencyCode,
        testApplePayConfig.paymentType,
      );
      expect(spyVerifyObjectType).toHaveBeenCalledTimes(1);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(4);
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.price, 'applePayConfig.price should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.summaryLabel, 'applePayConfig.summaryLabel should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.countryCode, 'applePayConfig.countryCode should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.currencyCode, 'applePayConfig.currencyCode should be a valid string');
      expect(spyVerifyIntegerType).toHaveBeenCalledWith(testApplePayConfig.paymentType, 'applePayConfig.paymentType should be a valid integer');
      nativeEventEmitter.emit('onApplePayNonceRequestSuccess', mockCardDetails);
      expect(onApplePayNonceRequestSuccessCallback).toHaveBeenCalledTimes(1);
      expect(onApplePayNonceRequestSuccessCallback).toHaveBeenCalledWith(mockCardDetails);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with default paymentType when paymentType is undefined', async () => {
    expect.assertions(2);
    try {
      const testApplePayConfig = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
      };
      const onApplePayNonceRequestSuccess = jest.fn();
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        onApplePayNonceRequestSuccess,
        null,
        null,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledWith(
        testApplePayConfig.price,
        testApplePayConfig.summaryLabel,
        testApplePayConfig.countryCode,
        testApplePayConfig.currencyCode,
        SQIPApplePay.PaymentTypeFinal,
      );
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with default paymentType when paymentType is null', async () => {
    expect.assertions(2);
    try {
      const testApplePayConfig = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
        paymentType: null,
      };
      const onApplePayNonceRequestSuccess = jest.fn();
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        onApplePayNonceRequestSuccess,
        null,
        null,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledWith(
        testApplePayConfig.price,
        testApplePayConfig.summaryLabel,
        testApplePayConfig.countryCode,
        testApplePayConfig.currencyCode,
        SQIPApplePay.PaymentTypeFinal,
      );
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with onApplePayNonceRequestFailure callback', async () => {
    expect.assertions(3);
    try {
      const testApplePayConfig:any = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
        paymentType: SQIPApplePay.PaymentTypePending,
      };
      const mockErrorInfo:ErrorDetails = { message: 'fake_message' };
      const onApplePayNonceRequestFailureCallback = jest.fn();
      nativeEventEmitter.addListener('onApplePayNonceRequestFailure', (errorInfo:ErrorDetails) => {
        onApplePayNonceRequestFailureCallback(errorInfo);
      });
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        null,
        onApplePayNonceRequestFailureCallback,
        null,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      nativeEventEmitter.emit('onApplePayNonceRequestFailure', mockErrorInfo);
      expect(onApplePayNonceRequestFailureCallback).toHaveBeenCalledTimes(1);
      expect(onApplePayNonceRequestFailureCallback).toHaveBeenCalledWith(mockErrorInfo);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with onApplePayComplete callback', async () => {
    expect.assertions(3);
    try {
      const testApplePayConfig:any = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
        paymentType: SQIPApplePay.PaymentTypeFinal,
      };
      const onApplePayCompleteCallback = jest.fn();
      nativeEventEmitter.addListener('onApplePayComplete', () => {
        onApplePayCompleteCallback();
      });
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        null,
        null,
        onApplePayCompleteCallback,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      nativeEventEmitter.emit('onApplePayComplete');
      expect(onApplePayCompleteCallback).toHaveBeenCalledTimes(1);
      expect(onApplePayCompleteCallback).toHaveBeenCalledWith();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('completeApplePayAuthorization works as expected', async () => {
    expect.assertions(5);
    try {
      const spyVerifyBooleanType = jest.spyOn(Utilities, 'verifyBooleanType');
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
      await SQIPApplePay.completeApplePayAuthorization(true);
      expect(spyVerifyBooleanType).toHaveBeenCalledTimes(1);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.completeApplePayAuthorization).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.completeApplePayAuthorization)
        .toHaveBeenCalledWith(true, '');
      const mockErrorMessage = 'fake_message';
      await SQIPApplePay.completeApplePayAuthorization(false, mockErrorMessage);
      expect(NativeModules.RNSQIPApplePay.completeApplePayAuthorization)
        .toHaveBeenCalledWith(false, mockErrorMessage);
    } catch (ex) {
      console.error(ex);
    }
  });
});
