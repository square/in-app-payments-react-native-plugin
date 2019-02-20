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
import { NativeModules } from 'react-native';
import SQIPCore from '../Core';

jest.mock('react-native', () => ({
  NativeModules: {
    RNSquareInAppPayments: { setApplicationId: jest.fn() },
  },
}));

describe('Test Core', () => {
  it('setSquareApplication success', async (done) => {
    expect.assertions(1);
    try {
      await SQIPCore.setSquareApplicationId('test_application_id ');
      expect(NativeModules.RNSquareInAppPayments.setApplicationId.mock.calls.length).toBe(1);
      done();
    } catch (ex) {
      console.error(ex);
    }
  });

  it('setSquareApplication failed with invalid applicaiton id type', async () => {
    expect.assertions(1);
    try {
      await SQIPCore.setSquareApplicationId(123);
    } catch (ex) {
      expect(ex.message).toContain('rn_invalid_type');
    }
  });
});
