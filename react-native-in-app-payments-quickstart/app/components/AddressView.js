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
import React from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

AddressView.propTypes = {
  address: PropTypes.string.isRequired,
};

export default function AddressView({ address }) {
  return (
    <Text style={styles.address}>{address}</Text>
  );
}

const styles = StyleSheet.create({
  address: {
    color: '#7B7B7B',
    fontSize: 16,
    marginTop: 10,
  },
});
