/* eslint-disable camelcase */
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
import {CHARGE_CUSTOMER_CARD_SERVER_URL} from '../Constants';
import ChargeCustomerCardError from '../ChargeCustomerCardError';

export default async function chargeCustomerCard(
  customer_id: string,
  customer_card_id: string,
) {
  const response = await fetch(CHARGE_CUSTOMER_CARD_SERVER_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id,
      customer_card_id,
    }),
  });

  try {
    const responseJson = await response.json();
    if (responseJson.errorMessage != null) {
      throw new ChargeCustomerCardError(responseJson.errorMessage);
    }
    return responseJson;
  } catch (error: any) {
    throw new ChargeCustomerCardError(error.message);
  }
}
