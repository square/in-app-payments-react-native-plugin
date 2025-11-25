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
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { AppIcon } from './AppIcon';
import { colors } from '../constants/colors';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { dimensions } from '../constants/dimensions';

export type AlertValue = {
  title: string;
  description: string;
  status: boolean;
};

export interface CommonAlertRef {
  showAlert: (alertValue: AlertValue) => void;
  close: () => void;
}

export const CommonAlert = forwardRef<CommonAlertRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [alertValue, setAlertValue] = useState<AlertValue>({
    title: 'None to show',
    description: '...',
    status: true,
  });

  useImperativeHandle(ref, () => ({
    showAlert: (a: AlertValue) => {
      setAlertValue(a);
      setVisible(true);
    },
    close: () => setVisible(false),
  }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <AppIcon
            name={alertValue.status ? 'checkmark-circle' : 'close-circle'}
            color={alertValue.status ? colors.primary : colors.error}
            size={dimensions.xxl}
          />
          <AppText size="h3" weight="bold" style={styles.title}>
            {alertValue.title}
          </AppText>
          <AppText size="body" style={styles.description}>
            {alertValue.description}
          </AppText>
          <AppButton
            style={styles.button}
            leadingIconName="close"
            label="Close"
            onPress={() => setVisible(false)}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderRadius: dimensions.lg,
    marginHorizontal: dimensions.md,
    padding: dimensions.md,
    gap: dimensions.md,
  },
  icon: {
    color: colors.onSurface,
  },
  title: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  description: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
