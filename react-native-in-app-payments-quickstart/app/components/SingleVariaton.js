import React, {Component} from 'react';
import {
  Text,
} from 'react-native';


export default class SingleVariation extends Component {
    constructor(props){
        super(props)
        this.state={
            quantity: 0,
        }

        this.handleSelection = this.handleSelection.bind(this)
    }

    handleSelection() {
        let {id, item_variation_data} = this.props.variation

        this.props.addToCart(id,item_variation_data.price_money)
        this.setState((prevState) => {
            return {
                quantity: (prevState.quantity + 1),
            }
        })

    }

    render() {
        let {variation} = this.props
        let {name, price_money} = variation.item_variation_data
        return (
        <Text key={variation.id} onPress={this.handleSelection} >
            {`Price: ${price_money.amount / 100} ${price_money.currency} ${name} Quantity:  ${this.state.quantity} ` }
        </Text>)

    }
}
