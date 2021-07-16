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
  NativeModules
} from 'react-native';
import { EventEmitter } from 'events';
import SQIPCardEntry from '../CardEntry';
import CardEntryConfig from '../models/CardEntryConfig';
import Utilities from '../Utilities';
import CardDetails from '../models/CardDetails';


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
    NativeEventEmitter: jest.fn(() => emitter),
    MockEventEmitter: emitter,
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
const nativeEventEmitter = new EventEmitter();

describe('Test CardEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('startCardEntryFlow works with cardEntryDidObtainCardDetails callback', async () => {
    expect.assertions(3);
    try {
      const mockCardDetails:CardDetails = { nonce: 'fake_nonce',card:{} };
      const onCardNonceRequestSuccess = jest.fn();
      nativeEventEmitter.addListener('cardEntryDidObtainCardDetails', (cardDetails:CardDetails) => {
         console.log(cardDetails, '- mockCardDetails');
        onCardNonceRequestSuccess(cardDetails);
      });
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.startCardEntryFlow(null, onCardNonceRequestSuccess, null);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      nativeEventEmitter.emit('cardEntryDidObtainCardDetails', mockCardDetails);
      expect(onCardNonceRequestSuccess).toHaveBeenCalledTimes(1);
      expect(onCardNonceRequestSuccess).toHaveBeenCalledWith(mockCardDetails);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with cardEntryCancel callback', async () => {
    expect.assertions(2);
    try {
      const canceledCallback = jest.fn();
      nativeEventEmitter.addListener('cardEntryCancel', () => {
        console.log('cardEntryCancel');
        canceledCallback();
      });
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.startCardEntryFlow(null, null, canceledCallback);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      nativeEventEmitter.emit('cardEntryCancel');
      expect(canceledCallback).toHaveBeenCalledTimes(1);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with null config', async () => {
    expect.assertions(3);
    const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType').mockImplementation();
    try {
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.startCardEntryFlow(null, null, null);
      expect(spyVerifyObjectType).not.toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(true);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with empty config', async () => {
    expect.assertions(3);
    const spyVerifyObjectType = jest.spyOn(Utilities, 'verifyObjectType').mockImplementation();
    const cardEntryConfig : CardEntryConfig = {};
    try {
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.startCardEntryFlow(cardEntryConfig, null, null);
      expect(spyVerifyObjectType).toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(true);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with collectPostalCode false config', async () => {
    expect.assertions(3);
    const spyVerifyBooleanType = jest.spyOn(Utilities, 'verifyBooleanType').mockImplementation();
    const cardEntryConfig : CardEntryConfig = {collectPostalCode:false};
    try {
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.startCardEntryFlow(cardEntryConfig, null, null);
      expect(spyVerifyBooleanType).toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(false);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('startCardEntryFlow works with collectPostalCode null config', async () => {
    expect.assertions(3);
    const spyVerifyBooleanType = jest.spyOn(Utilities, 'verifyBooleanType').mockImplementation();
    const cardEntryConfig : CardEntryConfig = {collectPostalCode:null};
    try {
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.startCardEntryFlow(cardEntryConfig, null, null);
      expect(spyVerifyBooleanType).not.toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.startCardEntryFlow).toHaveBeenCalledWith(true);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('completeCardEntry works with onCardEntryComplete callback', async () => {
    expect.assertions(2);
    try {
      const cardEntryCompleteCallback = jest.fn();
      nativeEventEmitter.addListener('cardEntryComplete', () => {
        console.log('cardEntryComplete');
        cardEntryCompleteCallback();
      });
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.completeCardEntry(cardEntryCompleteCallback);
      expect(NativeModules.RNSQIPCardEntry.completeCardEntry).toHaveBeenCalledTimes(1);
      nativeEventEmitter.emit('cardEntryComplete');
      expect(cardEntryCompleteCallback).toHaveBeenCalledTimes(1);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('showCardNonceProcessingError works as expected', async () => {
    expect.assertions(3);
    try {
      const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType').mockImplementation();
      const mockErrorMessage = 'fake_error_message';
      if (SQIPCardEntry === undefined) { return; }
      await SQIPCardEntry.showCardNonceProcessingError(mockErrorMessage);
      expect(spyVerifyStringType).toHaveBeenCalled();
      expect(NativeModules.RNSQIPCardEntry.showCardNonceProcessingError).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.showCardNonceProcessingError)
        .toHaveBeenCalledWith(mockErrorMessage);
    } catch (ex) {
      console.error(ex);
    }
  });

  it('setIOSCardEntryTheme works with theme object validation', async () => {
    expect.assertions(3);
    try {
      const spyVerifyThemeType = jest.spyOn(Utilities, 'verifyThemeType').mockImplementation();
      const mockTheme = {
        fakeFont: 'fake_font',
      };
      if (SQIPCardEntry === undefined) { return; }
      if (SQIPCardEntry.setIOSCardEntryTheme) await SQIPCardEntry.setIOSCardEntryTheme(mockTheme);
      expect(spyVerifyThemeType).toHaveBeenCalledWith(mockTheme);
      expect(NativeModules.RNSQIPCardEntry.setTheme).toHaveBeenCalledTimes(1);
      expect(NativeModules.RNSQIPCardEntry.setTheme).toHaveBeenCalledWith(mockTheme);
    } catch (ex) {
      console.error(ex);
    }
  });
});
