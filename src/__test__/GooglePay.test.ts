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
import SQIPGooglePay from '../GooglePay';
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
    Platform: {
      OS: 'android',
    },
    MockEventEmitter: emitter,
    NativeEventEmitter: jest.fn(() => emitter),
    NativeModules: {
      RNSQIPGooglePay: {
        initializeGooglePay: jest.fn(),
        canUseGooglePay: jest.fn(() => true),
        requestGooglePayNonce: jest.fn(),
      },
    },
  };
  return mockReactNative;
});

const nativeEventEmitter = new EventEmitter();

describe('Test Google Pay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializeGooglePay works as expected', async () => {
    expect.assertions(4);
    const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
    const spyVerifyIntegerType = jest.spyOn(Utilities, 'verifyIntegerType');
    const testSquareLocationId = 'testSquareLocationId';
    try {
      await SQIPGooglePay.initializeGooglePay(testSquareLocationId, SQIPGooglePay.EnvironmentTest);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(1);
      expect(spyVerifyIntegerType).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPGooglePay.initializeGooglePay).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPGooglePay.initializeGooglePay)
        .toHaveBeenCalledWith(testSquareLocationId, SQIPGooglePay.EnvironmentTest);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('canUseGooglePay works as expected', async () => {
    expect.assertions(2);
    try {
      const result = await SQIPGooglePay.canUseGooglePay();
      expect(NativeModules.RNSQIPGooglePay.canUseGooglePay).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('canUseGooglePay throws InAppPaymentsError', async () => {
    expect.assertions(3);
    // const code = 'TEST_ERROR';
    const message = 'test message';
    const debugCode = 'rn_test_debug_code';
    const debugMessage = 'test debug message';
    const prevMock = NativeModules.RNSQIPGooglePay.canUseGooglePay;
    NativeModules.RNSQIPGooglePay.canUseGooglePay = jest.fn(() => {
      const err = new Error();
      err.message = `{ "message": "${message}", "debugCode": "${debugCode}", "debugMessage": "${debugMessage}" }`;
      // err.code = code;
      throw err;
    });
    try {
      await SQIPGooglePay.canUseGooglePay();
    } catch (ex) {
      // expect(ex.code).toBe(code);
      expect(ex.message).toBe(message);
      expect(ex.debugCode).toBe(debugCode);
      expect(ex.debugMessage).toBe(debugMessage);
    } finally {
      NativeModules.RNSQIPGooglePay.canUseGooglePay = prevMock;
    }
  });

  it('requestGooglePayNonce works with onGooglePayNonceRequestSuccess callback', async () => {
    expect.assertions(9);
    try {
      const testGooglePayConfig = {
        price: '1.00',
        currencyCode: 'test-USD',
        priceStatus: SQIPGooglePay.TotalPriceStatusEstimated,
      };
      const mockCardDetails = { nonce: 'fake_nonce' };
      const onGooglePayNonceRequestSuccessCallback = jest.fn();
      nativeEventEmitter.addListener('onGooglePayNonceRequestSuccess', (cardDetails:CardDetails) => {
        onGooglePayNonceRequestSuccessCallback(cardDetails);
      });
      const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType');
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType');
      const spyVerifyIntegerType = jest.spyOn(Utilities, 'verifyIntegerType');
      await SQIPGooglePay.requestGooglePayNonce(
        testGooglePayConfig,
        onGooglePayNonceRequestSuccessCallback,
        null,
        null,
      );
      expect(NativeModules.RNSQIPGooglePay.requestGooglePayNonce).toHaveBeenCalledTimes(1);
      expect(spyVerifyObjectType).toHaveBeenCalledTimes(1);
      expect(spyVerifyStringType).toHaveBeenCalledTimes(2);
      expect(spyVerifyStringType).toHaveBeenCalledWith(testGooglePayConfig.price, 'googlePayConfig.price should be a valid string');
      expect(spyVerifyStringType).toHaveBeenCalledWith(testGooglePayConfig.currencyCode, 'googlePayConfig.currencyCode should be a valid string');
      expect(spyVerifyIntegerType).toHaveBeenCalledTimes(1);
      expect(spyVerifyIntegerType).toHaveBeenCalledWith(testGooglePayConfig.priceStatus, 'googlePayConfig.priceStatus should be a valid integer');
      nativeEventEmitter.emit('onGooglePayNonceRequestSuccess', mockCardDetails);
      expect(onGooglePayNonceRequestSuccessCallback).toHaveBeenCalledTimes(1);
      expect(onGooglePayNonceRequestSuccessCallback).toHaveBeenCalledWith(mockCardDetails);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestGooglePayNonce works with onGooglePayNonceRequestFailure callback', async () => {
    expect.assertions(3);
    try {
      const testGooglePayConfig = {
        price: '1.00',
        currencyCode: 'test-USD',
        priceStatus: SQIPGooglePay.TotalPriceStatusEstimated,
      };
      const mockErrorInfo = { message: 'fake_message' };
      const onGooglePayNonceRequestFailureCallback = jest.fn();
      nativeEventEmitter.addListener('onGooglePayNonceRequestFailure', (errorInfo:ErrorDetails) => {
        onGooglePayNonceRequestFailureCallback(errorInfo);
      });
      await SQIPGooglePay.requestGooglePayNonce(
        testGooglePayConfig,
        null,
        onGooglePayNonceRequestFailureCallback,
        null,
      );
      expect(NativeModules.RNSQIPGooglePay.requestGooglePayNonce).toHaveBeenCalledTimes(1);

      nativeEventEmitter.emit('onGooglePayNonceRequestFailure', mockErrorInfo);
      expect(onGooglePayNonceRequestFailureCallback).toHaveBeenCalledTimes(1);
      expect(onGooglePayNonceRequestFailureCallback).toHaveBeenCalledWith(mockErrorInfo);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('requestGooglePayNonce works with onGooglePayCanceled callback', async () => {
    expect.assertions(2);
    try {
      const testGooglePayConfig = {
        price: '1.00',
        currencyCode: 'test-USD',
        priceStatus: SQIPGooglePay.TotalPriceStatusEstimated,
      };
      const onGooglePayCanceledCallback = jest.fn();
      nativeEventEmitter.addListener('onGooglePayCanceled', () => {
        onGooglePayCanceledCallback();
      });
      await SQIPGooglePay.requestGooglePayNonce(
        testGooglePayConfig,
        null,
        null,
        onGooglePayCanceledCallback,
      );
      expect(NativeModules.RNSQIPGooglePay.requestGooglePayNonce).toHaveBeenCalledTimes(1);
      nativeEventEmitter.emit('onGooglePayCanceled');
      expect(onGooglePayCanceledCallback).toHaveBeenCalledTimes(1);
    } catch (ex) {
      console.error(ex);
    }
  });
});
