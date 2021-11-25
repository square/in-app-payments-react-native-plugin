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
import Utilities from '../Utilities';
import ErrorCodes from '../ErrorCodes';
import ErrorDetails from '../models/ErrorDetails';

describe('Test Utilities', () => {
  it('createInAppPayementsError ensure correct data structure', () => {
    const message = 'test message';
    const debugCode = 'rn_test_debug_code';
    const debugMessage = 'test debug message';
    const err = new Error();
    err.message = `{ "message": "${message}", "debugCode": "${debugCode}", "debugMessage": "${debugMessage}" }`;
    const inAppPaymentsError = Utilities.createInAppPayementsError(err);
    expect(inAppPaymentsError.message).toBe(message);
    expect(inAppPaymentsError.debugCode).toBe(debugCode);
    expect(inAppPaymentsError.debugMessage).toBe(debugMessage);
  });

  it('createInAppPayementsError append parseEx with invalid ex.message', () => {
    const err = new Error('Invalid Error');
    const inAppPaymentsError = Utilities.createInAppPayementsError(err);
    expect(inAppPaymentsError.message).toBe('Invalid Error');
    expect(inAppPaymentsError.debugCode).not.toBeDefined();
    expect(inAppPaymentsError.parseEx).toBeDefined();
  });

  it('createInAppPayementsError append parseEx with invalid ex.message', () => {
    const err = new Error('Invalid Error');
    const inAppPaymentsError = Utilities.createInAppPayementsError(err);
    expect(inAppPaymentsError.message).toBe('Invalid Error');
    expect(inAppPaymentsError.debugCode).not.toBeDefined();
    expect(inAppPaymentsError.parseEx).toBeDefined();
  });

  it('verifyObjectType pass with valid object type', () => {
    const testDebugMessage = 'test debug message';
    Utilities.verifyObjectType({ test: 'abc' }, testDebugMessage);
  });

  it('verifyObjectType create error with invalid type', () => {
    expect.assertions(4);
    const testDebugMessage = 'test debug message';
    try {
      Utilities.verifyObjectType('test', testDebugMessage);
    } catch (ex) {
      const error:ErrorDetails = JSON.parse(ex.message);
      expect(error.code).toEqual(ErrorCodes.UsageError);
      expect(error.message).toContain('rn_invalid_type');
      expect(error.debugCode).toBe('rn_invalid_type');
      expect(error.debugMessage).toEqual(testDebugMessage);
    }
  });

  it('verifyStringType pass with valid string type', () => {
    const testDebugMessage = 'test debug message';
    Utilities.verifyStringType('string', testDebugMessage);
  });

  it('verifyStringType create error with invalid type', () => {
    expect.assertions(4);
    const testDebugMessage = 'test debug message';
    try {
      Utilities.verifyStringType(1, testDebugMessage);
    } catch (ex) {
      const error:ErrorDetails = JSON.parse(ex.message);
      expect(error.code).toBe(ErrorCodes.UsageError);
      expect(error.message).toContain('rn_invalid_type');
      expect(error.debugCode).toBe('rn_invalid_type');
      expect(error.debugMessage).toBe(testDebugMessage);
    }
  });

  it('verifyIntegerType pass with valid integer type', () => {
    const testDebugMessage = 'test debug message';
    Utilities.verifyIntegerType(1, testDebugMessage);
  });

  it('verifyIntegerType create error with invalid type', () => {
    expect.assertions(8);
    const testDebugMessage = 'test debug message';
    try {
      Utilities.verifyIntegerType('string', testDebugMessage);
    } catch (ex) {
      const error:ErrorDetails = JSON.parse(ex.message);
      expect(error.code).toBe(ErrorCodes.UsageError);
      expect(error.message).toContain('rn_invalid_type');
      expect(error.debugCode).toBe('rn_invalid_type');
      expect(error.debugMessage).toBe(testDebugMessage);
    }
    try {
      Utilities.verifyIntegerType(1.123, testDebugMessage);
    } catch (ex) {
      const error:ErrorDetails = JSON.parse(ex.message);
      expect(error.code).toBe(ErrorCodes.UsageError);
      expect(error.message).toContain('rn_invalid_type');
      expect(error.debugCode).toBe('rn_invalid_type');
      expect(error.debugMessage).toBe(testDebugMessage);
    }
  });

  it('verifyBooleanType pass with valid boolean type', () => {
    const testDebugMessage = 'test debug message';
    Utilities.verifyBooleanType(false, testDebugMessage);
  });

  it('verifyBooleanType create error with invalid type', () => {
    expect.assertions(4);
    const testDebugMessage = 'test debug message';
    try {
      Utilities.verifyBooleanType(undefined, testDebugMessage);
    } catch (ex) {
      const error:ErrorDetails = JSON.parse(ex.message);
      expect(error.code).toBe(ErrorCodes.UsageError);
      expect(error.message).toContain('rn_invalid_type');
      expect(error.debugCode).toBe('rn_invalid_type');
      expect(error.debugMessage).toBe(testDebugMessage);
    }
  });

  it('verifyNubmerType pass with valid number types', () => {
    const testDebugMessage = 'test debug message';
    Utilities.verifyNubmerType(123, testDebugMessage);
    Utilities.verifyNubmerType(1.23, testDebugMessage);
  });

  it('verifyNubmerType create error with invalid type', () => {
    expect.assertions(4);
    const testDebugMessage = 'test debug message';
    try {
      Utilities.verifyNubmerType(true, testDebugMessage);
    } catch (ex) {
      const error:ErrorDetails = JSON.parse(ex.message);
      expect(error.code).toBe(ErrorCodes.UsageError);
      expect(error.message).toContain('rn_invalid_type');
      expect(error.debugCode).toBe('rn_invalid_type');
      expect(error.debugMessage).toBe(testDebugMessage);
    }
  });

  it('verifyFontType pass with valid font types', () => {
    Utilities.verifyFontType({
      size: 14.3,
      name: 'hei',
    });
    Utilities.verifyFontType({
      size: 20,
    });
  });

  it('verifyColorType pass with valid color types', () => {
    Utilities.verifyColorType({
      r: 14.3,
      g: 0,
      b: 255,
      a: 2.3,
    });
    Utilities.verifyColorType({
      r: -14.3,
      g: 0,
      b: 255,
    });
  });

  it('verifyThemeType verifies all fields', () => {
    Utilities.verifyThemeType({
      font: { size: 14 },
      saveButtonFont: { size: 14 },
      backgroundColor: { r: 255, g: 255, b: 255 },
      textColor: { r: 255, g: 255, b: 255 },
      placeholderTextColor: { r: 255, g: 255, b: 255 },
      tintColor: { r: 255, g: 255, b: 255 },
      messageColor: { r: 255, g: 255, b: 255 },
      errorColor: { r: 255, g: 255, b: 255 },
      saveButtonTitle: 'mock',
      saveButtonTextColor: { r: 255, g: 255, b: 255 },
      keyboardAppearance: 'mock',
    });
  });
});
