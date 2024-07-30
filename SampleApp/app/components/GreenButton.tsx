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
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

interface GreenButton {
  onPress: () => void;
  text: string;
}

const GreenButton: React.FC<GreenButton> = ({onPress, text}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default GreenButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#24988D',
    borderRadius: 15,
    justifyContent: 'center',
    marginLeft: '3%',
    minHeight: 45,
    width: '36%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
