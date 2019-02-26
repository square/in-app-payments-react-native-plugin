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
  NativeModules, MockEventEmitter,
} from 'react-native';
import SQIPApplePay from '../ApplePay';
import Utilities from '../Utilities';

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

describe('Test Apple Pay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializeApplePay works as expected', async (done) => {
    expect.assertions(2);
    try {
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
      const testApplePayMerchantId = 'testMerchantId';
      await SQIPApplePay.initializeApplePay(testApplePayMerchantId);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPApplePay.initializeApplePay).toHaveBeenCalledTimes(1);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('canUseApplePay works as expected', async (done) => {
    expect.assertions(2);
    try {
      const result = await SQIPApplePay.canUseApplePay();
      expect(NativeModules.RNSQIPApplePay.canUseApplePay).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with onApplePayNonceRequestSuccess callback', async (done) => {
    expect.assertions(9);
    try {
      const testApplePayConfig = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
      };
      const mockCardDetails = { nonce: 'fake_nonce' };
      const onApplePayNonceRequestSuccess = jest.fn();
      const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType');
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        onApplePayNonceRequestSuccess,
        null,
        null,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      expect(spyVerifyObjectType).toHaveBeenCalledTimes(1);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(4);
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.price, 'applePayConfig.price should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.summaryLabel, 'applePayConfig.summaryLabel should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.countryCode, 'applePayConfig.countryCode should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testApplePayConfig.currencyCode, 'applePayConfig.currencyCode should be a valid string');

      MockEventEmitter.listeners.onApplePayNonceRequestSuccess(mockCardDetails);
      expect(onApplePayNonceRequestSuccess).toHaveBeenCalledTimes(1);
      expect(onApplePayNonceRequestSuccess).toHaveBeenCalledWith(mockCardDetails);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with onApplePayNonceRequestFailure callback', async (done) => {
    expect.assertions(3);
    try {
      const testApplePayConfig = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
      };
      const mockErrorInfo = { message: 'fake_message' };
      const onApplePayNonceRequestFailureCallback = jest.fn();
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        null,
        onApplePayNonceRequestFailureCallback,
        null,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      MockEventEmitter.listeners.onApplePayNonceRequestFailure(mockErrorInfo);
      expect(onApplePayNonceRequestFailureCallback).toHaveBeenCalledTimes(1);
      expect(onApplePayNonceRequestFailureCallback).toHaveBeenCalledWith(mockErrorInfo);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestApplePayNonce works with onApplePayComplete callback', async (done) => {
    expect.assertions(3);
    try {
      const testApplePayConfig = {
        price: '1.00',
        summaryLabel: 'test label',
        countryCode: 'test-US',
        currencyCode: 'test-USD',
      };
      const onApplePayCompleteCallback = jest.fn();
      await SQIPApplePay.requestApplePayNonce(
        testApplePayConfig,
        null,
        null,
        onApplePayCompleteCallback,
      );
      expect(NativeModules.RNSQIPApplePay.requestApplePayNonce).toHaveBeenCalledTimes(1);
      MockEventEmitter.listeners.onApplePayComplete();
      expect(onApplePayCompleteCallback).toHaveBeenCalledTimes(1);
      expect(onApplePayCompleteCallback).toHaveBeenCalledWith();
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('completeApplePayAuthorization works as expected', async (done) => {
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
      done();
    } catch (ex) {
      console.error(ex);
    }
  });
});
