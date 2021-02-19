import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MealDetail from './MealDetail'
import List from '@material-ui/core/List'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: 'white'
  },
  fab: {
    position: 'fixed',

    [theme.breakpoints.up('sm')]: {
      zIndex: 99,
      marginLeft: 350,
      marginTop: 1
    },
    [theme.breakpoints.down('sm')]: {
      zIndex: 99,
      marginLeft: 330,
      marginTop: 5
    },

  }
})

class MealList extends Component {

  render() {
    const { classes, meals, auth, user } = this.props
    if (!auth.uid) return <Redirect to='/signin' />
    if (user.admin === false) return <Redirect to='/' />

    return (
      <div className={classes.root}>
        <div className={classes.fab}
        >
          <Fab 
            size="small"
            color='secondary'
            component={Link} to="/meal/create" 
          > 
            <AddIcon/>
          </Fab>
        </div>
        <List 
          style={{ 
            maxHeight: '100%', 
            overflow: 'auto'
          }}
        >
          { meals && meals.map( meal => {
            return (
              <MealDetail meal={meal} key={meal.id}/>
            )  
          })}
        </List>
      </div>
    )
  }
}

MealList.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    meals: state.firestore.ordered.meals,
    auth: state.firebase.auth,
    user: state.firebase.profile
  }
}

export default compose (
  connect(mapStateToProps),
  firestoreConnect((props) => {
    return [
      {
        collection: 'meals',
        orderBy: 'title'  
      }
    ]
  }),
  withStyles(styles)
)(MealList)