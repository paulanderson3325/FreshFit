import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import OrderDetail from './OrderDetail'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const styles = theme => ({
  root: {
    width: '100%',
    margin: 0,
    padding: 0
  },
  heading: {
    fontSize: 12,
    [theme.breakpoints.up('sm')]: {
      fontSize: 16,
    },
    padding: 0,
    margin: 0
  },
  tablehead1: {
    fontSize: 10,
    color: 'black',
    [theme.breakpoints.up('sm')]: {
      fontSize: 14,
    },
    padding: 0,
    paddingLeft: 10,
    margin: 0,
    //minWidth: '60%'
    width: '60%'
  },
  tablehead2: {
    fontSize: 10,
    color: 'black',
    [theme.breakpoints.up('sm')]: {
      fontSize: 14,
    },
    padding: 0,
    margin: 0,
    //minWidth: '50%'
    width: '10%'
  },
})

class OrderHeader extends Component {

  render() {
    const { classes, order } = this.props

    return (
      <ExpansionPanel className={classes.root}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography className={classes.heading}>
            {`
            ${moment(order.deliveryDate).format('ddd, MMM Do')} 
            \u00A0
            ${order.customer.name}
            \u00A0
            ${order.deliveryLocation}
            \u00A0
            ${order.mealsTotal} Meals
            `}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Table
            padding="none"
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell className={classes.tablehead1}>Meal</TableCell>
                <TableCell className={classes.tablehead2} align="right">S</TableCell>
                <TableCell className={classes.tablehead2} align="right">Snc</TableCell>
                <TableCell className={classes.tablehead2} align="right">L</TableCell>
                <TableCell className={classes.tablehead2} align="right">Lnc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { order.orderDetail.length > 0 && order.orderDetail.map( meal => {
              return (
                <OrderDetail meal={meal} key={meal.id}/>
              )  
            })}
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

OrderHeader.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(OrderHeader)
