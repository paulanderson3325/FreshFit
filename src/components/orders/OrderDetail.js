import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: 5
  },
  tablecell1: {
    fontSize: 10,
    paddingLeft: 10,
    [theme.breakpoints.up('sm')]: {
      fontSize: 14,
    },
    padding: 0,
    margin: 0,
    //minWidth: '60%'
    width: '60%'
  },
  tablecell2: {
    fontSize: 10,
    [theme.breakpoints.up('sm')]: {
      fontSize: 14,
    },
    padding: 0,
    margin: 0,
    //minWidth: '50%'
    width: '10%'
  },

})

class OrderDetail extends Component {

  render() {
    const { classes, meal } = this.props

    return (
      <TableRow>
        <TableCell className={classes.tablecell1}>{meal.title}</TableCell>
        <TableCell className={classes.tablecell2} align="right">{meal.sqty}</TableCell>
        <TableCell className={classes.tablecell2} align="right">{meal.sqtync}</TableCell>
        <TableCell className={classes.tablecell2} align="right">{meal.lqty}</TableCell>
        <TableCell className={classes.tablecell2} align="right">{meal.lqtync}</TableCell>
      </TableRow>
    )  
  }
}

OrderDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(OrderDetail)
