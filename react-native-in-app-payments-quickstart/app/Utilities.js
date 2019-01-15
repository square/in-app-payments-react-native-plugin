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
/* eslint no-bitwise: ["error", { "allow": ["|", "&"] }] */
import {
  Alert,
} from 'react-native';

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

export function printCurlCommand(nonce) {
  const uuid = uuidv4();
  console.log(`Run this curl command to charge the nonce:
          curl --request POST https://connect.squareup.com/v2/locations/SQUARE_LOCATION_ID/transactions \\
          --header "Content-Type: application/json" \\
          --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
          --header "Accept: application/json" \\
          --data '{
          "idempotency_key": "${uuid}",
          "amount_money": {
          "amount": 100,
          "currency": "USD"},
          "card_nonce": "${nonce}"
          }'`);
}

export async function showAlert(title, message, onPress = null) {
  await Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onPress == null ? null : () => { onPress(); },
      },
    ],
    { cancelable: false },
  );
}
