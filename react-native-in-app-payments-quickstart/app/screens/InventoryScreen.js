import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
  } from 'react-native';

import GreenButton from '../components/GreenButton';

  export default class InventoryScreen extends Component {
      constructor(props) {
          super(props)

      }

      render(){
          return(
              <View style={styles.container}>
                <Text style={styles.title}>Welcome to the Bakery</Text>
                <GreenButton
                    onPress={() => this.props.navigation.navigate('Pay')}
                    text="Buy"
                />
              </View>
        )
    }
}

const styles = StyleSheet.create({
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    container: {
      alignItems: 'center',
      backgroundColor: '#78CCC5',
      flex: 1,
      justifyContent: 'center',
    },
    description: {
      color: '#FFFFFF',
      fontSize: 16,
      marginBottom: 20,
      marginLeft: 50,
      marginRight: 50,
      textAlign: 'center',
    },
    modalContent: {
      alignItems: 'flex-start',
      backgroundColor: 'white',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      flex: 0,
      flexShrink: 1,
      justifyContent: 'flex-start',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 28,
    },
  });
