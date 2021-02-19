import React, {Component} from 'react'
import {CardElement, injectStripe} from 'react-stripe-elements'
import { getFirestore } from 'redux-firestore'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import blue from '@material-ui/core/colors/blue'


const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? {padding} : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
}


class CheckoutForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      complete: 1, 
      paySources: [], 
      unsubscribeSrc: {},
      cardSourceId: '',
      disablePaymentButton: true,
      paymentProcessing: false,
      addCardError: '',
      addChargeError: ''
    }
  }

  componentDidMount = () => {
    const firestore = getFirestore()
    const unsubscribe = firestore
      .collection('stripe_customers')  
      .doc(this.props.auth.uid)
      .collection('sources')
      .onSnapshot( (querySnapshot) => {
        var paymentSources = []
        querySnapshot.forEach( (doc) => {
          paymentSources.push(doc.data())
        })
        if (paymentSources.length > 0) {
          this.setState({
            paySources: paymentSources, 
            unsubscribeSrc: unsubscribe,
            cardSourceId: paymentSources[0].id,
            disablePaymentButton: false
          })
        } else {
          this.setState({
            paySources: paymentSources, 
            unsubscribeSrc: unsubscribe
          })  
        }  
      })
  }

  componentWillUnmount = () => {
    this.state.unsubscribeSrc()
  }

  handleChange = (e) => {
    if (e.target.name === 'cardSourceId') {
      this.setState({ 
        [e.target.name]: e.target.value,
        disablePaymentButton: false
       })
    } else { 
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  handleAddCard = () => {
    this.setState({ complete: 2 })
  }

  submitAddCard = async (ev) => {
    const stripeName = `${this.props.user.firstName} ${this.props.user.lastName}`
    const result = await this.props.stripe.createToken({name: stripeName})
    if (result.error !== undefined) {
      this.setState({addCardError: result.error.message})
    } else {
      const firestore = getFirestore()
      await firestore.collection('stripe_customers')
        .doc(this.props.auth.uid)
        .collection('tokens')
        .add({ token: result.token })
      this.setState({complete: 1, addCardError: ''})
    }
  } 

  submitAddCharge = async () => {
    this.setState({ 
      disablePaymentButton: true, 
      paymentProcessing: true,
      addChargeError: '' 
    })

    const paymentSource = this.state.cardSourceId
    const paymentAmount = this.props.orderTotal 

    const firestore = getFirestore()
    const charge = await firestore
      .collection('stripe_customers')
      .doc(this.props.auth.uid)
      .collection('charges')
      .add({ amount: paymentAmount, source: paymentSource })

    const unsubscribe = firestore
      .collection('stripe_customers')  
      .doc(this.props.auth.uid)
      .collection('charges')
      .doc(charge.id)
      .onSnapshot({
        // Listen for document metadata changes
        includeMetadataChanges: true
      }, (doc) => {
        if (doc.data().paid !== undefined) {
          unsubscribe()
          this.handleChargeComplete(doc.id,doc.data())
        }
      })
  }

  handleChargeComplete = (chargeId,doc) => {
    if (doc.paid === true) {
      //Need to add the document to the orders collection
      this.props.handleAddOrder(chargeId, doc.receipt_url)
      this.setState({ 
        disablePaymentButton: false, 
        paymentProcessing: false,
        addChargeError: '',
        complete: 3 
      })
    } else {
      this.setState({ 
        disablePaymentButton: false, 
        paymentProcessing: false,
        addChargeError: `Payment did not complete because: ${doc.failure_message}` 
      })
    }
  }


  render() {
    const orderTotal = (this.props.orderTotal/100).toFixed(2)

    //Select Card to Use and Pay Dialog
    if (this.state.complete === 1) {
      return (
        <div
          style={{
            backgroundColor: blue[50],
            padding: 10
          }}
        >
          <FormControl
            style={{
              textAlign: 'left',
              paddingBottom: 0,
              paddingLeft: 10,
              minWidth: 300
            }}
          >
            <InputLabel 
              htmlFor="cardSourceId"
              style={{
                paddingLeft: 10,
                fontSize: 18
              }}
            >
              Select Card to Use
            </InputLabel>
            <Select
              value={this.state.cardSourceId}
              onChange={this.handleChange}
              inputProps={{
                name: 'cardSourceId',
                id: 'cardSourceId',
              }}
            >
              { this.state.paySources.map( card => {
                return (
                  <MenuItem 
                    key={card.fingerprint}
                    value={card.id}
                  >
                    {`${card.brand} ${card.last4} expires 
                    ${card.exp_month}/${card.exp_year}`}
                  </MenuItem>
                )  
              })}
            </Select>
          </FormControl> 

          {this.state.paymentProcessing ?
            <p
              style={{fontSize: 20, textAlign: 'center', color: 'red'}}
            >
              Processing Payment...
            </p>
            : null
          }

          {this.state.addChargeError ?
            <p
              style={{
                fontSize: 20, 
                textAlign: 'center', 
                color: 'red',
                maxWidth: '300px'
              }}
            >
              {this.state.addChargeError}
            </p>
            : null
          }
          
          <div style={{textAlign: 'center'}}>
            <Button 
              variant="contained"
              size="small"
              style={{marginTop: 20, marginRight: 10, marginBottom: 10}}
              disabled={this.state.paymentProcessing}
              onClick={this.handleAddCard}
            >
              New Card
            </Button>
            <Button 
              color="secondary"
              variant="contained"
              size="small"
              style={{marginTop: 20, marginRight: 10, marginBottom: 10}}
              disabled={this.state.paymentProcessing}
              onClick={this.props.handleClickClose}
            >
              Cancel
            </Button>
            <Button 
              color="primary"
              variant="contained"
              size="small"
              style={{marginTop: 20, marginRight: 10, marginBottom: 10}}
              disabled={this.state.disablePaymentButton}
              onClick={this.submitAddCharge}
            >
              {`Pay  $${orderTotal}`}
            </Button>
          </div>
        </div>  
      )
    }

    //Add a Card dialog
    if (this.state.complete === 2) {
      return (
        <div
          style={{
            backgroundColor: blue[50],
            padding: 10
          }}
        >
          <p
            style={{fontSize: 20, margin: 0, paddingBottom: 10}}
          >
            Input the Card you wish to add to your account
          </p>
          <CardElement 
            {...createOptions('16px')}
          />
          {this.state.addCardError ?
            <p
              style={{fontSize: 20, textAlign: 'center', color: 'red'}}
            >
              {this.state.addCardError}
            </p>
            : null
          }
          <div style={{textAlign: 'right'}}>
            <Button 
              color="primary"
              variant="contained"
              size="small"
              style={{marginTop: 20, marginRight: 10}}
              onClick={this.submitAddCard}
            >
              Add Card
            </Button>
            <Button 
              color="secondary"
              variant="contained"
              size="small"
              style={{marginTop: 20}}
              onClick={this.props.handleClickClose}              
            >
              Cancel
            </Button>
          </div>
        </div>
      )
    }  

    //Order Completed Dialog
    if (this.state.complete === 3) {
      return (
        <div
          style={{
            backgroundColor: blue[50],
            padding: 10
          }}
        >
          <p
            style={{fontSize: 20, margin: 0, paddingBottom: 10}}
          >
            Thank you for your order.
            An email confirmation has been sent to {this.props.auth.email}.
            The email will also contain a link to print a copy
            of your credit card receipt.
          </p>
          <div style={{textAlign: 'right'}}>
            <Button 
              color="primary"
              variant="contained"
              size="small"
              style={{marginTop: 20, marginRight: 10}}
              onClick={this.props.handleOrderComplete}              
            >
              Exit
            </Button>
          </div>
        </div>  
      )
    }
  }
}


export default injectStripe(CheckoutForm)