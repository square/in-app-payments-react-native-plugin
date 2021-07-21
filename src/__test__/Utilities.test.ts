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
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe(testDebugMessage);
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
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe(testDebugMessage);
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
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe(testDebugMessage);
    }
    try {
      Utilities.verifyIntegerType(1.123, testDebugMessage);
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe(testDebugMessage);
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
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe(testDebugMessage);
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
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe(testDebugMessage);
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

  it('verifyFontType create error with invalid type', () => {
    expect.assertions(12);
    try {
      Utilities.verifyFontType('string');
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe('font should be an object type.');
    }
    try {
      Utilities.verifyFontType({
        name: 'hei',
      });
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toContain('font.size');
    }
    try {
      Utilities.verifyFontType({
        size: 20,
        name: 1,
      });
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toContain('font.name');
    }
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

  it('verifyColorType create error with invalid type', () => {
    expect.assertions(12);
    try {
      Utilities.verifyColorType('string');
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toBe('color should be an object type.');
    }
    try {
      Utilities.verifyColorType({
        g: 0,
        b: 255,
        a: 2.3,
      });
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toContain('value.r');
    }
    try {
      Utilities.verifyColorType({
        r: 1.3,
        g: 'string',
        b: 255,
      });
    } catch (ex) {
      expect(ex.code).toBe(ErrorCodes.UsageError);
      expect(ex.message).toContain('rn_invalid_type');
      expect(ex.debugCode).toBe('rn_invalid_type');
      expect(ex.debugMessage).toContain('value.g');
    }
  });

  it('verifyThemeType verifies all fields', () => {
    const spyVerifyFontType = jest.spyOn(Utilities, 'verifyFontType').mockImplementation();
    const spyVerifyColorType = jest.spyOn(Utilities, 'verifyColorType').mockImplementation();
    const spyVerifyStringType = jest.spyOn(Utilities, 'verifyStringType').mockImplementation();
    Utilities.verifyThemeType({
      font: 'mock',
      saveButtonFont: 'mock',
      backgroundColor: 'mock',
      textColor: 'mock',
      placeholderTextColor: 'mock',
      tintColor: 'mock',
      messageColor: 'mock',
      errorColor: 'mock',
      saveButtonTitle: 'mock',
      saveButtonTextColor: 'mock',
      keyboardAppearance: 'mock',
    });

    expect(spyVerifyFontType).toHaveBeenCalledTimes(2);
    expect(spyVerifyColorType).toHaveBeenCalledTimes(7);
    expect(spyVerifyStringType).toHaveBeenCalledTimes(2);

    spyVerifyFontType.mockRestore();
    spyVerifyColorType.mockRestore();
    spyVerifyStringType.mockRestore();
  });
});
