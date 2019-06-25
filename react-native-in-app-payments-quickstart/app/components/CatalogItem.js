import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import SingleVariation from './SingleVariaton'


export default class CatalogItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {name, description,variations,} = this.props.item
        return(
            <View>
                <Image style={{height:100}} source={{uri:this.props.url}}/>
                <Text>{name}</Text>
                <Text>Description: {description}</Text>
                <Text>Variations:</Text>
                {variations.map((variation) => <SingleVariation key={variation.id} addToCart={this.props.addToCart} variation={variation}/> )}
            </View>)
    }

}

const Styles ={
    card:{
        margin: 16,
        padding: 4,
        height:100,
        width:300,
        textColor:'red',
    },
    title: (chosen) => ({
        'fontSize': 20,
        color: chosen ? 'green' : 'black'
    })
}
