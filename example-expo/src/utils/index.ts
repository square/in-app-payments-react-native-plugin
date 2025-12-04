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
/* eslint no-bitwise: ["error", { "allow": ["|", "&"] }] */
import { Alert } from 'react-native';

export function uuidv4() {
  // Use cryptographically secure random numbers to generate UUID v4
  const bytes = new Uint8Array(16);
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    crypto.getRandomValues(bytes);
  } else {
    throw new Error(
      'crypto.getRandomValues is not available for secure UUID generation.'
    );
  }
  // Set version bits (4) and variant bits (10)
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
  const byteToHex: string[] = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substring(1));
  }
  return (
    byteToHex[bytes[0]] +
    byteToHex[bytes[1]] +
    byteToHex[bytes[2]] +
    byteToHex[bytes[3]] +
    '-' +
    byteToHex[bytes[4]] +
    byteToHex[bytes[5]] +
    '-' +
    byteToHex[bytes[6]] +
    byteToHex[bytes[7]] +
    '-' +
    byteToHex[bytes[8]] +
    byteToHex[bytes[9]] +
    '-' +
    byteToHex[bytes[10]] +
    byteToHex[bytes[11]] +
    byteToHex[bytes[12]] +
    byteToHex[bytes[13]] +
    byteToHex[bytes[14]] +
    byteToHex[bytes[15]]
  );
}

export function printCurlCommand(
  nonce: string,
  appId: string,
  verificationToken = undefined
) {
  // set host url based on application id
  //   production: https://connect.squareup.com
  //   sandbox: https://connect.squareupsandbox.com
  const hostUrl = appId.startsWith('sandbox')
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
  const uuid = uuidv4();
  if (verificationToken === undefined) {
    console.log(`Run this curl command to charge the nonce:
          curl --request POST ${hostUrl}/v2/payments \\
          --header "Content-Type: application/json" \\
          --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
          --header "Accept: application/json" \\
          --data '{
          "idempotency_key": "${uuid}",
          "amount_money": {
          "amount": 100,
          "currency": "USD"},
          "source_id": "${nonce}"
          }'`);
  } else {
    console.log(`Run this curl command to charge the nonce:
          curl --request POST ${hostUrl}/v2/payments \\
          --header "Content-Type: application/json" \\
          --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
          --header "Accept: application/json" \\
          --data '{
          "idempotency_key": "${uuid}",
          "amount_money": {
          "amount": 100,
          "currency": "USD"},
          "source_id": "${nonce}",
          "verification_token": "${verificationToken}"
          }'`);
  }
}

export async function showAlert(
  title: string,
  message = '',
  onPress = () => {}
) {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
      },
    ],
    { cancelable: false }
  );
}

export function hexToRgba(
  hex: string,
  alpha = 1
): { r: number; g: number; b: number; a: number } {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b, a: alpha };
}
