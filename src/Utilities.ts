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
import ColorType from './models/ColorType';
import ErrorDetails from './models/ErrorDetails';
import FontType from './models/FontType';
import ThemeType from './models/ThemeType';

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

function createJSError(debugErrorMessage:string) {
  // Create the javascript layer error with same data structure
  // as error processed by createInAppPayementsError
  const errorCode = 'rn_invalid_type';
  const ex:ErrorDetails = {
    debugMessage: debugErrorMessage,
    message: `Something went wrong. Please contact the developer of this application and provide them with this error code: ${errorCode}`,
  };
  ex.code = ErrorCodes.UsageError;
  ex.debugCode = errorCode;
  throw new Error(JSON.stringify(ex));
}

function isNullOrUndefined(value:any) {
  // This is same as (value === null || typeof value === 'undefined')
  return value == null;
}

function verifyObjectType(value:any, debugErrorMessage:string) {
  if (isNullOrUndefined(value) || typeof value !== 'object' || value.constructor !== Object) {
    createJSError(debugErrorMessage);
  }
}

function verifyStringType(value:any, debugErrorMessage:string) {
  if (isNullOrUndefined(value) || (typeof value !== 'string' && !(value instanceof String))) {
    createJSError(debugErrorMessage);
  }
}

function verifyIntegerType(value:any, debugErrorMessage:string) {
  if (isNullOrUndefined(value) || typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    createJSError(debugErrorMessage);
  }
}

function verifyBooleanType(value:any, debugErrorMessage:string) {
  if (isNullOrUndefined(value) || typeof value !== 'boolean') { createJSError(debugErrorMessage); }
}

function verifyNubmerType(value:any, debugErrorMessage:string) {
  if (isNullOrUndefined(value) || typeof value !== 'number' || !Number.isFinite(value)) {
    createJSError(debugErrorMessage);
  }
}

function verifyFontType(value:FontType) {
  verifyObjectType(value, 'font should be an object type.');
  verifyNubmerType(value.size, 'font.size should be a number.');
  if (value.name) {
    verifyStringType(value.name, 'font.name should be a string type.');
  }
}

function verifyColorType(value:ColorType) {
  verifyObjectType(value, 'color should be an object type.');
  verifyNubmerType(value.r, 'value.r should be a number type.');
  verifyNubmerType(value.g, 'value.g should be a number type.');
  verifyNubmerType(value.b, 'value.b should be a number type.');
  if (value.a) {
    verifyNubmerType(value.a, 'value.a should be a number type.');
  }
}

function verifyThemeType(value:ThemeType) {
  if (isNullOrUndefined(value) || typeof value !== 'object' || value.constructor !== Object) {
    createJSError('theme is not an object type.');
  }

  if (value.font) {
    verifyFontType(value.font);
  }
  if (value.saveButtonFont) {
    verifyFontType(value.saveButtonFont);
  }
  if (value.backgroundColor) {
    verifyColorType(value.backgroundColor);
  }
  if (value.textColor) {
    verifyColorType(value.textColor);
  }
  if (value.placeholderTextColor) {
    verifyColorType(value.placeholderTextColor);
  }
  if (value.tintColor) {
    verifyColorType(value.tintColor);
  }
  if (value.messageColor) {
    verifyColorType(value.messageColor);
  }
  if (value.errorColor) {
    verifyColorType(value.errorColor);
  }
  if (value.saveButtonTitle) {
    verifyStringType(value.saveButtonTitle, 'value.saveButtonTitle should be a valid string type.');
  }
  if (value.saveButtonTextColor) {
    verifyColorType(value.saveButtonTextColor);
  }
  if (value.keyboardAppearance) {
    verifyStringType(value.keyboardAppearance, 'value.keyboardAppearance should be a valid string type.');
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
