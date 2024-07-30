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
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import OrderTitleView from './OrderTitleView';
import OrderInformationTitleView from './OrderInformationTitleView';
import OrderInformationDescriptionView from './OrderInformationDescriptionView';
import AddressView from './AddressView';
import GreenButton from './GreenButton';
import DigitalWalletButton from './DigitalWalletButton';

interface OrderModal {
  onCloseOrderScreen: () => void;
  onPayWithGiftCard: () => void;
  onPayWithCard: () => void;
  onShowDigitalWallet: () => void;
  onBuyerVerification: () => void;
}

const OrderModal: React.FC<OrderModal> = ({
  onCloseOrderScreen,
  onPayWithGiftCard,
  onPayWithCard,
  onShowDigitalWallet,
  onBuyerVerification,
}) => {
  return (
    <View>
      <OrderTitleView onCloseOrderScreen={() => onCloseOrderScreen()} />
      <View style={styles.bodyContent}>
        <View style={styles.row}>
          <View style={styles.titleColumn}>
            <OrderInformationTitleView title="Ship To" />
          </View>
          <View style={styles.descriptionColumn}>
            <OrderInformationDescriptionView description="Lauren Nobel" />
            <AddressView
              address={'1455 Market Street\nSan Francisco, CA, 94103'}
            />
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.row}>
          <View style={styles.titleColumn}>
            <OrderInformationTitleView title="Total" />
          </View>
          <View style={styles.descriptionColumn}>
            <OrderInformationDescriptionView description="$1.00" />
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.refundText}>
          You can refund this transaction through your Square dashboard, go to
          squareup.com/dashboard.
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <GreenButton
          onPress={() => onPayWithGiftCard()}
          text="Pay with gift card"
        />
        <GreenButton onPress={() => onPayWithCard()}
          text="Pay with card" />
      </View>
      <View style={styles.buttonRow}>
        <DigitalWalletButton onPress={() => onShowDigitalWallet()} />
        <GreenButton
          onPress={() => onBuyerVerification()}
          text="Buyer Verification"
        />
      </View>
    </View>
  );
};

export default OrderModal;

const styles = StyleSheet.create({
  bodyContent: {
    marginHorizontal: '10%',
    marginTop: '2%',
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '4%',
  },
  descriptionColumn: {
  },
  horizontalLine: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    marginVertical: '3%',
  },
  refundText: {
    color: '#7B7B7B',
    fontSize: 12,
    marginBottom: '5%',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
  },
  titleColumn: {
    marginRight: '8%'
  },
});
