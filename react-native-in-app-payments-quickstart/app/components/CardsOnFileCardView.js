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
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

CardsOnFileListView.propTypes = {
  card: PropTypes.object.isRequired,
  onSelectCard: PropTypes.func.isRequired,
};

export default function CardsOnFileCardView({ card, onSelectCard }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onSelectCard}
        style={styles.row}>
        <Text style={styles.card}>{card.brand} {card.last_4}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  card: {
    borderColor: '#123456',
    borderWidth: 2,
    flex: 1,
  },
  row: {

  },
});
