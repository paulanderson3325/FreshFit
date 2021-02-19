import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getFirestore } from 'redux-firestore'
import { compose } from 'recompose'
import moment from 'moment'
import PropTypes from 'prop-types'
import {Elements, StripeProvider} from 'react-stripe-elements'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import blue from '@material-ui/core/colors/blue'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import { red } from '@material-ui/core/colors'

import OrderMealDetail from './OrderMealDetail'
import { getMenuMeals } from '../../store/actions/orderActions'

import CheckoutForm from './CheckoutForm'
import { signOut } from '../../store/actions/authActions'


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginBottom: 20,
    width: 375
  },
  formtitle: {
    textAlign:'center',
    paddingTop: 5, 
    paddingBottom: 0, 
    fontSize: 22, 
    fontWeight: 'bold'
  },
  formCustomerName: {
    textAlign:'center',
    paddingBottom: 10, 
    fontSize: 22, 
    fontWeight: 'bold'
  },
  formControl: {
    paddingLeft: 20, 
    paddingBottom: 20, 
    minWidth: 300
  },
  inputLabel: {
    paddingLeft: 20, 
  },
  list: {
    maxHeight: '100%', 
    overflow: 'auto',
  },
  listtitle: {
    textAlign:'center',
    paddingTop: 5, 
    fontSize: 22, 
    fontWeight: 'bold',
    paddingLeft: 0
  },
  actions: {
    display: 'block',
    textAlign: 'center'
  },
  warning: {
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10
  },
  ordertotals: {
    textAlign: 'center',
    backgroundColor: red[50],
    paddingTop: 10,
    paddingBottom: 10
  },
  ordertotalstext: {
    fontSize: 18
  },
  checkoutdialog: {
    backgroundColor: blue[50],
    padding: 0,
    margin: 0
  },
  error: {
    fontSize: 16,
    color: 'red',
    paddingTop: 10
  },
  table: {
    minWidth: 700,
  },
})

class OrderDialog extends Component {

  state = {
    open: false,
    deliveryDates: [],
    meals: [],
    menuId: '',
    pickUpId: 0,
    pickUpLocations: [
      {pickUpId: 1, pickUpName: 'Koda Central'},
      {pickUpId: 2, pickUpName: 'Koda Native'},
      {pickUpId: 3, pickUpName: 'CFOKC'}
    ],
    orderTotal: 0,
    mealsTotal:0
  }

  componentDidMount() {
    const firestore = getFirestore()
    let newMenus = []
    firestore.collection('menus')
    .orderBy('deliveryDate')
    .get()
    .then((snapshot) => {
      snapshot.forEach( (doc) => {
        if (moment(Date.now()) < moment(doc.data().cutoffDate) ) {
          const newMenu = { id: doc.id, deliveryDate: doc.data().deliveryDate }
          newMenus = [...newMenus, newMenu]  
          this.setState({
            ...this.state,
            deliveryDates: newMenus  
          }) 
        }
      })
    })
    .catch((err) => console.log(err))
  }

  handleClearOrder = () => {
    let orderMeals = []
    orderMeals = this.state.meals.map( menuMeal => {
      return {...orderMeals, ...menuMeal, 
        sqty: 0,
        sqtync: 0,
        lqty: 0,
        lqtync: 0
       }
    })
    this.setState({ 
      ...this.state,
      meals: orderMeals,
      orderTotal: 0,
      mealsTotal: 0
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClickClose = () => {
    this.setState({ open: false })
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  handleLogOut = () => {
    this.props.signOut()
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    if (e.target.name === 'menuId') {
      if (e.target.value !== this.state.menuId) {
        if (e.target.value !== '') {
          this.props.getMenuMeals(e.target.value)
          .then(() => {
            if (this.props.orderError === null) {
              let orderMeals = []
              orderMeals = this.props.menuMeals.map( menuMeal => {
                return {...orderMeals, ...menuMeal, 
                  sqty: 0,
                  sqtync: 0,
                  lqty: 0,
                  lqtync: 0
                 }
              })
              this.setState({ 
                ...this.state,
                meals: orderMeals,
                orderTotal: 0,
                mealsTotal: 0,
                errorMessage: this.props.orderError
              })
            } else {
              this.setState({ 
                ...this.state,
                meals: [],
                orderTotal: 0,
                mealsTotal: 0,
                errorMessage: this.props.orderError
              })
            } 
          })
          .catch(() => {
            this.setState({ 
              ...this.state,
              meals: [],
              orderTotal: 0,
              mealsTotal: 0,
              errorMessage: this.props.orderError
            })
          })
        } else {
          this.setState({ 
            ...this.state,
            meals: [],
            orderTotal: 0,
            mealsTotal: 0
          })
        }
      }
    }
  }

  handleUpdateQty = (updatedMeal) => {
    const orgMeal = this.state.meals.find(meal => meal.id === updatedMeal.id)
    const orgMealCount = orgMeal.sqty *1 
                      + orgMeal.sqtync *1 
                      + orgMeal.lqty *1 
                      + orgMeal.lqtync *1

    const newMealCount = updatedMeal.sqty *1 
                       + updatedMeal.sqtync *1 
                       + updatedMeal.lqty *1 
                       + updatedMeal.lqtync *1

    const orgOrderTotal = (orgMeal.sqty * orgMeal.sprice)
                        + (orgMeal.sqtync * orgMeal.sprice)
                        + (orgMeal.lqty * orgMeal.lprice)
                        + (orgMeal.lqtync * orgMeal.lprice)

    const newOrderTotal = (updatedMeal.sqty * updatedMeal.sprice)
                        + (updatedMeal.sqtync * updatedMeal.sprice)
                        + (updatedMeal.lqty * updatedMeal.lprice)
                        + (updatedMeal.lqtync * updatedMeal.lprice)

    const updatedMeals = this.state.meals.map(meal =>
      meal.id === updatedMeal.id ? { ...meal, ...updatedMeal } : meal
    )

    this.setState({ 
      ...this.state,
      meals: updatedMeals,
      mealsTotal: this.state.mealsTotal + newMealCount - orgMealCount,
      orderTotal: this.state.orderTotal + newOrderTotal - orgOrderTotal
    })
  }

  handleAddOrder = (chargeId, receiptUrl) => {
    const orderDate = new Date()
    const deliveryLocation = this.state.pickUpLocations[this.state.pickUpId-1].pickUpName
    const deliveryDates = 
      this.state.deliveryDates.filter( date => date.id === this.state.menuId)

    const orderDetail = 
      this.state.meals.filter( meal => 
        meal.sqty > 0 || meal.sqtync > 0 || meal.lqty > 0 || meal.lqtync > 0)  

    const firestore = getFirestore()
    firestore.collection('orders')
    .add({ 
      deliveryDate: deliveryDates[0].deliveryDate, 
      orderDate: orderDate,
      deliveryLocation: deliveryLocation,
      customer: {
        id: this.props.auth.uid,
        name: `${this.props.user.firstName} ${this.props.user.lastName}`,
        email: this.props.auth.email 
      },
      orderTotal: this.state.orderTotal,
      mealsTotal: this.state.mealsTotal, 
      orderDetail: orderDetail,
      receiptUrl: receiptUrl,
      chargeId: chargeId
    })
  }

  render() {
    const { classes, auth, user, fullScreen } = this.props
    const { meals, mealsTotal } = this.state
    const orderTotal = (this.state.orderTotal/100).toFixed(2)

    if (!auth.uid) return <Redirect to='/' />

    return (
      <div>
        <Grid container spacing={8} className={classes.root}>
          <Paper 
            className={classes.paper} 
            elevation={5}
          >
            <Typography
              className={classes.formtitle}
            >
              {'F{re}sh Fit Meal Order'}  
            </Typography>  
            <Typography
              className={classes.formCustomerName}
            >
              {`${user.firstName} ${user.lastName}`}  
            </Typography>  
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="menuId-helper"
                className={classes.inputLabel}
              >
                Delivery Date
              </InputLabel>
              <Select
                value={this.state.menuId}
                onChange={this.handleChange}
                inputProps={{
                  name: 'menuId',
                  id: 'menuId',
                }}
              >
                { this.state.deliveryDates && this.state.deliveryDates.map( deliveryDate => {
                  return (
                    <MenuItem 
                      key={deliveryDate.id}
                      value={deliveryDate.id}
                    >
                      {moment(deliveryDate.deliveryDate).format('MMMM Do YYYY')}
                    </MenuItem>
                  )  
                })}
              </Select>
              <FormHelperText>Please select a delivery date</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="pickUpId-helper"
                className={classes.inputLabel}
              >
                Pick Up Location
              </InputLabel>
              <Select
                value={this.state.pickUpId}
                onChange={this.handleChange}
                inputProps={{
                  name: 'pickUpId',
                  id: 'pickUpId',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                { this.state.pickUpLocations.map( pickUpLocation => {
                  return (
                    <MenuItem 
                      key={pickUpLocation.pickUpId}
                      value={pickUpLocation.pickUpId}
                    >
                      {pickUpLocation.pickUpName}
                    </MenuItem>
                  )  
                })}
              </Select>
              <FormHelperText>Select a pick up location</FormHelperText>
            </FormControl> 
            <Paper
              className={classes.ordertotals} 
              elevation={5}
            >
              <Typography className={classes.ordertotalstext}>
                Order Total: {`$${orderTotal}`} <br/>
                Meals Total: {mealsTotal}
              </Typography>      
              
              
              <CardActions className={classes.actions}>
                <Button 
                  className={classes.button}
                  size="small" 
                  variant="contained"
                  color="secondary" 
                  onClick={this.handleClearOrder}
                >
                  Clear Order
                </Button>
                <Button 
                  className={classes.button}
                  size="small" 
                  variant="contained"
                  color="primary" 
                  disabled={this.state.mealsTotal ? false : true}
                  onClick={this.handleClickOpen}
                >
                  Process Order
                </Button>
            </CardActions>
            </Paper> 
            { meals.length === 0 
              ?
              <Typography
                className={classes.warning} 
              >
                { this.state.menuId 
                ? 
                  'Sorry No Meals Available to Order'
                :
                  'Please select a delivery date'
                }
              </Typography>
              : null 
            }
            <List 
              className={classes.list}      
            >
              { meals && meals.map( meal => {
                return (
                  <OrderMealDetail 
                    meal={meal} 
                    key={meal.id}
                    handleUpdateQty={this.handleUpdateQty}
                  />
                )  
              })}
            </List>
          </Paper>
        </Grid>

        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          //onClose={this.handleClose}
        >
          <DialogTitle 
            className={classes.checkoutdialog}
            style={{textAlign: 'center', paddingTop: '15px'}}
          > 
            Complete Order
          </DialogTitle>
          <DialogContent className={classes.checkoutdialog}>

            <StripeProvider apiKey="pk_test_BNEjtp1SJc89IMf697OPPdqJ">
              <div className={classes.checkoutdialog}>
                <Elements>
                  <CheckoutForm 
                    auth={auth} 
                    user={user} 
                    handleClickClose={this.handleClickClose}
                    handleOrderComplete={this.handleLogOut}
                    handleAddOrder={this.handleAddOrder}
                    orderTotal={this.state.orderTotal}
                  />
                </Elements>
              </div>
            </StripeProvider>


          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

OrderDialog.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    menuMeals: state.order.menuMeals,
    orderError: state.order.orderError,
    auth: state.firebase.auth,
    user: state.firebase.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMenuMeals: (id) => dispatch(getMenuMeals(id)),
    signOut: () => dispatch(signOut())
  }
}

export default compose (
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withMobileDialog()
)(OrderDialog)

