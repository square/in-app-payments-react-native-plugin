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
/* eslint no-undef: */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

const closeButton = require('../images/btnClose.png');

CardsOnFileTitleView.propTypes = {
  onCloseCardsOnFileScreen: PropTypes.func.isRequired,
};

export default function CardsOnFileTitleView({ onCloseCardsOnFileScreen }) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.closeButton}
        underlayColor="#FFFFFF"
        onPress={onCloseCardsOnFileScreen}
      >
        <Image
          style={styles.button}
          source={closeButton}
        />
      </TouchableHighlight>
      <Text style={styles.title}>Lauren's cards</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    zIndex: 1,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',

  },
  title: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 0,
  },
});
