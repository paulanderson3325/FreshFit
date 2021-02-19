import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import withMobileDialog from '@material-ui/core/withMobileDialog'

import { getMeal, deleteMeal } from '../../store/actions/mealActions'


const styles = theme => ({
  title: {
    textAlign:'center',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'red'
  },
  content: {
    maxWidth: 300, 
    paddingLeft: 20, 
    paddingRight: 20, 
    fontSize: 16 
  },
  error: {
    maxWidth: 300, 
    color: 'red',
    paddingLeft: 20, 
    paddingRight: 20, 
    fontSize: 16 
  }
})

class MealDelete extends Component {
 
  state = {
    open: true,
    errorMessage: '',
    meal: {}
  }

  componentDidMount() {
    const id = this.props.match.params.id
    this.props.getMeal(id)
    .then(() => {
      if (this.props.mealError === null) {
        this.setState({ 
          ...this.state,
          meal: { ...this.props.meal },
          errorMessage: null
        })
      } else {
        this.setState({ 
          ...this.state,
          errorMessage: this.props.mealError
        })
      }
    })
    .catch(() => {
      this.setState({ 
        ...this.state,
        errorMessage: this.props.mealError
      })
    })
  }
 
  handleClose = () => {
    this.setState({ open: false })
    this.props.history.push('/meals')
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const id = this.props.match.params.id
    this.props.deleteMeal(id)
    .then(() => {
      if (this.props.mealError === null) {
        this.handleClose()
      } else {
        this.setState({ 
          ...this.state,
          errorMessage: this.props.mealError
        })
      }  
    })
    .catch(() => {
      this.setState({ 
        ...this.state,
        errorMessage: this.props.mealError
      })
    })
  }


  render() {
    const { auth, classes, user } = this.props
    const mealError = this.state.errorMessage
    const title =this.state.meal.title

    if (!auth.uid) return <Redirect to='/' />
    if (user.admin === false) return <Redirect to='/' />
    if (this.state.errorMessage === 'Meal not found') return <Redirect to='/meals' />

    return (
      <div>
        <Dialog
          //fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <Typography
            className={classes.title}
          >
            Deleting A Meal
          </Typography>  
          { mealError === null ?
            <Typography
              className={classes.content}
            >
              {`Please confirm that you wish to delete the Meal "${title}".`}
            </Typography>  
          : 
            <Typography
              className={classes.error}
            >
              {mealError}
            </Typography>  
          }  
          <DialogActions>
            <Button 
              color="secondary"
              autoFocus
              onClick={this.handleClose}
            >
              Cancel
            </Button>
            { !mealError ?
              <Button 
                color="primary" 
                onClick={this.handleSubmit}
              >
                confirm
              </Button>
            : null  
            }
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

MealDelete.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMeal: (id) => dispatch(getMeal(id)),
    deleteMeal: (id) => dispatch(deleteMeal(id))
  }
}

const mapStateToProps = (state) => {
  return {
    meal: state.meal.meal,
    mealError: state.meal.mealError,
    auth: state.firebase.auth,
    user: state.firebase.profile
  }
}

export default compose (
  connect(mapStateToProps,mapDispatchToProps),
  withStyles(styles),
  withMobileDialog()
)(MealDelete)
