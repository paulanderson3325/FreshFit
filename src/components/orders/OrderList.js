import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'


import OrderHeader from './OrderHeader'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: 'white',
    margin: 0,
    padding: 0
  },
})


class OrderList extends Component {

  render() {
    const { classes, orders, auth, user } = this.props
    if (!auth.uid) return <Redirect to='/' />
    if (user.admin === false) return <Redirect to='/' />

    return (
      <Paper className={classes.root}>
        { orders && orders.map( order => {
          return (
            <OrderHeader order={order} key={order.id}/>
          )  
        })}
      </Paper>
    )
  }
}

OrderList.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    orders: state.firestore.ordered.orders,
    user: state.firebase.profile
  }
}

export default compose (
  connect(mapStateToProps),
  firestoreConnect((props) => {
    return [
      {
        collection: 'orders',
        orderBy: 'deliveryDate'  
      }
    ]
  }),
  withStyles(styles)
)(OrderList)