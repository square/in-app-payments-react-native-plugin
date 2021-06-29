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
import ErrorCodes from './ErrorCodes';

class ErrorData {
  code: string | undefined;

  message: string | undefined;

  debugCode: string | undefined;

  debugMessage: string | undefined;
}

function createInAppPayementsError(ex:any) {
  try {
    const errorDetails = JSON.parse(ex.message);
    ex.message = errorDetails.message; // eslint-disable-line no-param-reassign
    ex.debugCode = errorDetails.debugCode; // eslint-disable-line no-param-reassign
    ex.debugMessage = errorDetails.debugMessage; // eslint-disable-line no-param-reassign
  } catch (parseEx) {
    ex.parseEx = parseEx; // eslint-disable-line no-param-reassign
  }

  return ex;
}

function createJSError(debugErrorMessage:any) {
  // Create the javascript layer error with same data structure
  // as error processed by createInAppPayementsError
  const errorCode = 'rn_invalid_type';
  const ex = new ErrorData();
  ex.code = ErrorCodes.UsageError;
  ex.message = `Something went wrong. Please contact the developer of this application and provide them with this error code: ${errorCode}`;
  ex.debugCode = errorCode;
  ex.debugMessage = debugErrorMessage;
  return ex;
}

function isNullOrUndefined(value:any) {
  // This is same as (value === null || typeof value === 'undefined')
  return value == null;
}

function verifyObjectType(value:any, debugErrorMessage:any) {
  if (isNullOrUndefined(value) || typeof value !== 'object' || value.constructor !== Object) {
    throw createJSError(debugErrorMessage);
  }
}

function verifyStringType(value:any, debugErrorMessage:any) {
  if (isNullOrUndefined(value) || (typeof value !== 'string' && !(value instanceof String))) {
    throw createJSError(debugErrorMessage);
  }
}

function verifyIntegerType(value:any, debugErrorMessage:any) {
  if (isNullOrUndefined(value) || typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    throw createJSError(debugErrorMessage);
  }
}

function verifyBooleanType(value:any, debugErrorMessage:any) {
  if (isNullOrUndefined(value) || typeof value !== 'boolean') throw createJSError(debugErrorMessage);
}

function verifyNubmerType(value:any, debugErrorMessage:any) {
  if (isNullOrUndefined(value) || typeof value !== 'number' || !Number.isFinite(value)) {
    throw createJSError(debugErrorMessage);
  }
}

function verifyFontType(value:any) {
  exportFunctions.verifyObjectType(value, 'font should be an object type.');
  exportFunctions.verifyNubmerType(value.size, 'font.size should be a number.');
  if (value.name) {
    verifyStringType(value.name, 'font.name should be a string type.');
  }
}

function verifyColorType(value:any) {
  exportFunctions.verifyObjectType(value, 'color should be an object type.');
  exportFunctions.verifyNubmerType(value.r, 'value.r should be a number type.');
  exportFunctions.verifyNubmerType(value.g, 'value.g should be a number type.');
  exportFunctions.verifyNubmerType(value.b, 'value.b should be a number type.');
  if (value.a) {
    exportFunctions.verifyNubmerType(value.a, 'value.a should be a number type.');
  }
}

function verifyThemeType(value:any) {
  if (isNullOrUndefined(value) || typeof value !== 'object' || value.constructor !== Object) {
    throw createJSError('theme is not an object type.');
  }

  if (value.font) {
    exportFunctions.verifyFontType(value.font);
  }
  if (value.saveButtonFont) {
    exportFunctions.verifyFontType(value.saveButtonFont);
  }
  if (value.backgroundColor) {
    exportFunctions.verifyColorType(value.backgroundColor);
  }
  if (value.textColor) {
    exportFunctions.verifyColorType(value.textColor);
  }
  if (value.placeholderTextColor) {
    exportFunctions.verifyColorType(value.placeholderTextColor);
  }
  if (value.tintColor) {
    exportFunctions.verifyColorType(value.tintColor);
  }
  if (value.messageColor) {
    exportFunctions.verifyColorType(value.messageColor);
  }
  if (value.errorColor) {
    exportFunctions.verifyColorType(value.errorColor);
  }
  if (value.saveButtonTitle) {
    exportFunctions.verifyStringType(value.saveButtonTitle, 'value.saveButtonTitle should be a valid string type.');
  }
  if (value.saveButtonTextColor) {
    exportFunctions.verifyColorType(value.saveButtonTextColor);
  }
  if (value.keyboardAppearance) {
    exportFunctions.verifyStringType(value.keyboardAppearance, 'value.keyboardAppearance should be a valid string type.');
  }
}

const exportFunctions = {
  createInAppPayementsError,
  verifyObjectType,
  verifyStringType,
  verifyIntegerType,
  verifyNubmerType,
  verifyBooleanType,
  verifyColorType,
  verifyFontType,
  verifyThemeType,
};

export default exportFunctions;
