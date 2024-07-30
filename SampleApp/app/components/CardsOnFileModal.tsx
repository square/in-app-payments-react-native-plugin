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
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import CardsOnFileTitleView from './CardsOnFileTitleView';
import CardsOnFileCardView from './CardsOnFileCardView';
import GreenButton from './GreenButton';

interface Props {
  onCloseCardsOnFileScreen: () => void;
  onShowCustomerCardEntry: () => void;
  onSelectCardOnFile: () => void;
  cardsOnFile: any;
}

interface CardOnFile {
  id: string;
  card_brand: string;
  last_4: string;
  exp_month: string;
  exp_year: string;
}

const CardsOnFileModal: React.FC<Props> = ({
  onCloseCardsOnFileScreen,
  onShowCustomerCardEntry,
  onSelectCardOnFile,
  cardsOnFile,
}) => {
  return (
    <View style={styles.container}>
      <CardsOnFileTitleView
        onCloseCardsOnFileScreen={() => onCloseCardsOnFileScreen()}
      />
      <View style={styles.bodyContent}>
        {cardsOnFile.length === 0 ? (
          <Text style={styles.noCardsText}>
            {'No cards on file found.' +
              'Please tap the button to add a card that you can use for future transactions.'}
          </Text>
        ) : (
          cardsOnFile.map((cardOnFile: CardOnFile) => (
            <React.Fragment key={cardOnFile.id}>
              <View style={styles.row}>
                <CardsOnFileCardView
                  cardOnFile={cardOnFile}
                  // eslint-disable-next-line react/jsx-no-bind
                  onSelectCardOnFile={() => onSelectCardOnFile.bind(cardOnFile)}
                />
              </View>
              <View style={styles.horizontalLine} />
            </React.Fragment>
          ))
        )}
      </View>
      <View style={styles.buttonRow}>
        <GreenButton
          onPress={() => onShowCustomerCardEntry()}
          text="Add card"
        />
      </View>
    </View>
  );
};

export default CardsOnFileModal;

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
    marginBottom: '6%',
    width: '100%',
  },
  container: {
    width: '100%',
  },
  horizontalLine: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    marginBottom: '3%',
    marginTop: '3%',
  },
  noCardsText: {
    color: '#7B7B7B',
    fontSize: 12,
    marginBottom: '3%',
    minHeight: 50,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
});
