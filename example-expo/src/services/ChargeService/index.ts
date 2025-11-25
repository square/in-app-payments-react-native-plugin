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

import {
  ChargeCustomerCardError,
  ChargeError,
  CreateCustomerCardError,
  type ChargeServiceInterface,
} from './interface';
import { strings } from '../../constants/strings';

export { ChargeServiceInterface };

export class ChargeService implements ChargeServiceInterface {
  async chargeCardNonce(
    nonce: string,
    verificationToken?: string
  ): Promise<void> {
    try {
      console.log(
        'sqip: chargeCardNonce: input ->',
        ' nonce: ',
        nonce,
        ', verificationToken: ',
        verificationToken
      );
      const response = await fetch(strings.CHARGE_SERVER_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nonce,
          verificationToken,
        }),
      });
      const responseJson = await response.json();
      if (responseJson.errorMessage != null) {
        throw new ChargeError(responseJson.errorMessage);
      }
      console.log('sqip: chargeCardNonce: response ->', responseJson);
    } catch (error: any) {
      console.log('sqip: chargeCardNonce: error ->', error.message);
      throw new ChargeError(error.message);
    } finally {
      console.log('sqip: chargeCardNonce: resolved');
    }
  }

  async chargeCustomerCard(
    customer_id: string,
    customer_card_id: string
  ): Promise<any> {
    try {
      console.log(
        'sqip: chargeCustomerCard: input ->',
        ' customer_id: ',
        customer_id,
        ', customer_card_id: ',
        customer_card_id
      );
      const response = await fetch(strings.CHARGE_CUSTOMER_CARD_SERVER_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id,
          customer_card_id,
        }),
      });
      const responseJson = await response.json();
      if (responseJson.errorMessage != null) {
        throw new ChargeCustomerCardError(responseJson.errorMessage);
      }
      return responseJson;
    } catch (error: any) {
      throw new ChargeCustomerCardError(error.message);
    } finally {
      console.log('sqip: chargeCustomerCard: resolved');
    }
  }

  async createCustomerCard(customer_id: string, nonce: string): Promise<any> {
    try {
      console.log(
        'sqip: createCustomerCard: input ->',
        ' customer_id: ',
        customer_id,
        ', nonce: ',
        nonce
      );
      const response = await fetch(strings.CREATE_CUSTOMER_CARD_SERVER_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id,
          nonce,
        }),
      });
      const responseJson = await response.json();
      if (responseJson.errorMessage != null) {
        throw new CreateCustomerCardError(responseJson.errorMessage);
      }
      return responseJson;
    } catch (error: any) {
      throw new CreateCustomerCardError(error.message);
    } finally {
      console.log('sqip: createCustomerCard: resolved');
    }
  }
}

async function delayBlocking(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {}
    resolve();
  });
}

export class MockChargeService implements ChargeServiceInterface {
  async chargeCardNonce(
    nonce: string,
    verificationToken?: string
  ): Promise<void> {
    const random = Math.random();
    const success = random > 0.4; // 40% chance of success
    const delay = 1000;
    const errorMessage = 'Mock error';
    console.log(
      'sqip: chargeCardNonce: input ->',
      ' nonce: ',
      nonce,
      ', verificationToken: ',
      verificationToken
    );
    console.log(
      'sqip: chargeCardNonce: result ->',
      ' expected_result: ',
      success ? 'success' : 'error',
      ', random: ',
      random
    );
    return new Promise(async (resolve, reject) => {
      await delayBlocking(delay);
      if (success) {
        console.log('sqip: chargeCardNonce: resolved');
        resolve();
      } else {
        reject(new ChargeError(errorMessage));
      }
    });
  }

  async chargeCustomerCard(
    customer_id: string,
    customer_card_id: string
  ): Promise<any> {
    const random = Math.random();
    const success = random > 0.4; // 40% chance of success
    const delay = 1000;
    const errorMessage = 'Mock error';
    console.log(
      'sqip: chargeCustomerCard: input ->',
      ' customer_id: ',
      customer_id,
      ', customer_card_id: ',
      customer_card_id
    );
    console.log(
      'sqip: chargeCustomerCard: result ->',
      ' expected_result: ',
      success ? 'success' : 'error',
      ', random: ',
      random
    );
    return new Promise(async (resolve, reject) => {
      await delayBlocking(delay);
      if (success) {
        console.log('sqip: chargeCustomerCard: resolved');
        resolve({
          success,
        });
      } else {
        reject(new ChargeError(errorMessage));
      }
    });
  }

  async createCustomerCard(customer_id: string, nonce: string): Promise<any> {
    const random = Math.random();
    const success = random > 0.4; // 40% chance of success
    const delay = 1000;
    const errorMessage = 'Mock error';
    console.log(
      'sqip: createCustomerCard: input ->',
      ' customer_id: ',
      customer_id,
      ', nonce: ',
      nonce
    );
    console.log(
      'sqip: createCustomerCard: result ->',
      ' expected_result: ',
      success ? 'success' : 'error',
      ', random: ',
      random
    );
    return new Promise(async (resolve, reject) => {
      await delayBlocking(delay);
      if (success) {
        console.log('sqip: createCustomerCard: resolved');
        resolve({
          success,
        });
      } else {
        reject(new ChargeError(errorMessage));
      }
    });
  }
}
