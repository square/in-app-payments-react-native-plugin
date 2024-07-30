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
import { Text, StyleSheet, Image, View, Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const FailIcon = require('../images/failIcon.png');
const SuccessIcon = require('../images/sucessIcon.png');

CommonAlert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default function CommonAlert({ title, description, status, isVisible, onDialogClick }: { title: string, description: string, status: boolean, isVisible: boolean, onDialogClick: Function }) {
  return (
    <Modal
      visible={isVisible} transparent
      style={{
        margin: 24,
        padding: 10,
      }}
      onRequestClose={() => onDialogClick()}>
      <TouchableOpacity onPress={() => onDialogClick()}
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View style={styles.container}>
          <Image
            style={{ height: 50, width: 50, tintColor: status ? '#24988D' : 'red' }}
            source={status ? SuccessIcon : FailIcon} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Modal >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 30,
    padding: 15
  },
  icon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    color: "#000",
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: "gray",
    fontSize: 15,
    margin: 30,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
  }
});
