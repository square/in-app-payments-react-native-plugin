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
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

const googlePayLogo = require('../images/applePayLogo.png');
const applePayLogo = require('../images/googlePayLogo.png');

DigitalWalletButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default function DigitalWalletButton({ onPress }) {
  const imageSource = Platform.OS === 'ios'
    ? googlePayLogo
    : applePayLogo;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Image
        source={imageSource}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 32,
    justifyContent: 'center',
    marginLeft: '3%',
    minHeight: 50,
    width: '30%',
  },
});
