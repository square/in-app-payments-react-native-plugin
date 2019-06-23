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
  View,
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import CardsOnFileTitleView from './CardsOnFileTitleView';
import OrderInformationTitleView from './OrderInformationTitleView';
import OrderInformationDescriptionView from './OrderInformationDescriptionView';
import AddressView from './AddressView';
import GreenButton from './GreenButton';
import DigitalWalletButton from './DigitalWalletButton';

CardsOnFileModal.propTypes = {
  cardsOnFile: PropTypes.array.isRequired,
  onCloseCardsOnFileScreen: PropTypes.func.isRequired,
  onShowCardEntry: PropTypes.func.isRequired
};

export default function CardsOnFileModal({ cardsOnFile, onCloseCardsOnFileScreen, onShowCardEntry }) {
  return (
    <View style={styles.container}>
      <CardsOnFileTitleView onCloseCardsOnFileScreen={() => onCloseCardsOnFileScreen()} />
      <View style={styles.buttonRow}>
        <GreenButton
          onPress={onShowCardEntry}
          text="Add new card"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContent: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '3%',
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '5%',
    width: '100%',
  },
  descriptionColumn: {
    flex: 2,
    flexDirection: 'column',
  },
  horizontalLine: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    marginBottom: '3%',
    marginTop: '3%',
  },
  refundText: {
    color: '#7B7B7B',
    fontSize: 12,
    marginBottom: '3%',
  },
  row: {
    flexDirection: 'row',
    width: '80%',
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
  },
});
