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
import SQIPCardEntry from '../CardEntry';
import Utilities from '../Utilities';

jest.mock('react-native', () => {
  const emitter = {
    listeners: {},
    addListener: jest.fn((eventName, callback) => {
      emitter.listeners[eventName] = callback;
    }),
  };
  const mockReactNative = {
    Platform: {
      select: jest.fn((map) => map.ios),
    },
    MockEventEmitter: emitter,
    NativeEventEmitter: jest.fn(() => emitter),
    NativeModules: {
      RNSQIPCardEntry: {
        startCardEntryFlow: jest.fn(),
        completeCardEntry: jest.fn(),
        showCardNonceProcessingError: jest.fn(),
        setTheme: jest.fn(),
      },
    },
  };
  return mockReactNative;
});

describe('Test CardEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('startCardEntryFlow works with cardEntryDidObtainCardDetails callback', async (done) => {
    expect.assertions(3);
    try {
      const mockCardDetails = { nonce: 'fake_nonce' };
      const onCardNonceRequestSuccess = jest.fn();
      await SQIPCardEntry.startCardEntryFlow(null, onCardNonceRequestSuccess, null);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      MockEventEmitter.listeners.cardEntryDidObtainCardDetails(mockCardDetails);
      expect(onCardNonceRequestSuccess).toHaveBeenCalledTimes(1);
      expect(onCardNonceRequestSuccess).toHaveBeenCalledWith(mockCardDetails);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with cardEntryCancel callback', async (done) => {
    expect.assertions(2);
    try {
      const canceledCallback = jest.fn();
      await SQIPCardEntry.startCardEntryFlow(null, null, canceledCallback);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      MockEventEmitter.listeners.cardEntryCancel();
      expect(canceledCallback).toHaveBeenCalledTimes(1);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with null config', async (done) => {
    expect.assertions(3);
    const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType').mockImplementation();
    try {
      await SQIPCardEntry.startCardEntryFlow(null, null, null);
      expect(spyVerifyObjectType).not.toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(true);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with empty config', async (done) => {
    expect.assertions(3);
    const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType').mockImplementation();
    const cardEntryConfig = {};
    try {
      await SQIPCardEntry.startCardEntryFlow(cardEntryConfig, null, null);
      expect(spyVerifyObjectType).toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(true);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with collectPostalCode false config', async (done) => {
    expect.assertions(3);
    const spyVerifyBooleanType = jest.spyOn(Utilities, 'verifyBooleanType').mockImplementation();
    const cardEntryConfig = {
      collectPostalCode: false,
    };
    try {
      await SQIPCardEntry.startCardEntryFlow(cardEntryConfig, null, null);
      expect(spyVerifyBooleanType).toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(false);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with collectPostalCode null config', async (done) => {
    expect.assertions(3);
    const spyVerifyBooleanType = jest.spyOn(Utilities, 'verifyBooleanType').mockImplementation();
    const cardEntryConfig = {
      collectPostalCode: null,
    };
    try {
      await SQIPCardEntry.startCardEntryFlow(cardEntryConfig, null, null);
      expect(spyVerifyBooleanType).not.toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(true);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('completeCardEntry works with onCardEntryComplete callback', async (done) => {
    expect.assertions(2);
    try {
      const cardEntryCompleteCallback = jest.fn();
      await SQIPCardEntry.completeCardEntry(cardEntryCompleteCallback);
      expect(NativeModules.RNSQIPCardEntry.completeCardEntry).toHaveBeenCalledTimes(1);
      MockEventEmitter.listeners.cardEntryComplete();
      expect(cardEntryCompleteCallback).toHaveBeenCalledTimes(1);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('showCardNonceProcessingError works as expected', async (done) => {
    expect.assertions(3);
    try {
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType').mockImplementation();
      const mockErrorMessage = 'fake_error_message';
      await SQIPCardEntry.showCardNonceProcessingError(mockErrorMessage);
      expect(spyVerifyStringType).toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.showCardNonceProcessingError).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.showCardNonceProcessingError)
        .toHaveBeenCalledWith(mockErrorMessage);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('setIOSCardEntryTheme works with theme object validation', async (done) => {
    expect.assertions(3);
    try {
      const spyVerifyThemeType = jest.spyOn(Utilities, 'verifyThemeType').mockImplementation();
      const mockTheme = {
        fakeFont: 'fake_font',
      };
      await SQIPCardEntry.setIOSCardEntryTheme(mockTheme);
      expect(spyVerifyThemeType).toHaveBeenCalledWith(mockTheme);
      expect(NativeModules.RNSQIPCardEntry.setTheme).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.setTheme).toHaveBeenCalledWith(mockTheme);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });
});
