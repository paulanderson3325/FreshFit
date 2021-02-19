import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import withMobileDialog from '@material-ui/core/withMobileDialog'

import { getMeal, createMeal, updateMeal } from '../../store/actions/mealActions'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  formtitle: {
    textAlign:'center',
    paddingTop: 30, 
    paddingBottom: 0, 
    fontSize: 22, 
    fontWeight: 'bold'
  },
  error: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    paddingTop: 0,
    paddingBottom: 0
  }
})

class MealDialog extends Component {
 
  state = {
    open: true,
    editMode: '',
    errorMessage: '',
    meal: {
      title: '',
      subheader: '',
      sportion: '',
      sprice: 0,
      scals: 0,
      sprotein: 0,
      scarbs: 0,
      sfat: 0,
      lportion: '',
      lprice: 0,
      lcals: 0,
      lprotein: 0,
      lcarbs: 0,
      lfat: 0
    },
    errorFlag: {
      title: false,
      subheader: false,
      sportion: false,
      sprice: false,
      scals: false,
      sprotein: false,
      scarbs: false,
      sfat: false,
      lportion: false,
      lprice: false,
      lcals: false,
      lprotein: false,
      lcarbs: false,
      lfat: false,
    },
  }

  componentDidMount() {
    if (this.props.match.path === '/meals/:id') {
      const id = this.props.match.params.id
      this.props.getMeal(id)
      .then(() => {
        if (this.props.mealError === null) {
          this.setState({ 
            ...this.state,
            editMode: 'edit',
            meal: { ...this.props.meal, 
              sprice: (this.props.meal.sprice/100).toFixed(2),
              lprice: (this.props.meal.lprice/100).toFixed(2) },
            errorMessage: null
          })
        } else {
          this.setState({ 
            ...this.state,
            editMode: 'edit',
            errorMessage: this.props.mealError
          })
        }
      })
      .catch(() => {
        this.setState({ 
          ...this.state,
          editMode: 'edit',
          errorMessage: this.props.mealError
        })
      })
    } else {
      this.setState({ 
        ...this.state,
        editMode: 'create',
        errorMessage: ''
      })
    }     
  }  
 
  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
    this.props.history.push('/meals')
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (!this.state.meal.title) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Meal Title is Required',
        errorFlag: { 
          title: true 
        }  
      })  
      return
    }

    if (this.state.meal.sprice < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          sprice: true
        }
      })  
      return
    }

    if (this.state.meal.scals < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          scals: true
        }
      })  
      return
    }

    if (this.state.meal.sprotein < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          sprotein: true
        }
      })  
      return
    }

    if (this.state.meal.scarbs < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          scarbs: true
        }
      })  
      return
    }

    if (this.state.meal.sfat < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          sfat: true
        }
      })  
      return
    }

    if (this.state.meal.lprice < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          lprice: true
        }
      })  
      return
    }

    if (this.state.meal.lcals < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          lcals: true
        }
      })  
      return
    }

    if (this.state.meal.lprotein < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          lprotein: true
        }
      })  
      return
    }

    if (this.state.meal.lcarbs < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          lcarbs: true
        }
      })  
      return
    }

    if (this.state.meal.lfat < 0 ) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Value can not be less then 0',
        errorFlag: {
          lfat: true
        }
      })  
      return
    }

    if (this.state.editMode === 'edit') {
      const id = this.props.match.params.id
      const meal = this.state.meal
      this.props.updateMeal(meal, id)
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
    } else {
      const meal = this.state.meal
      this.props.createMeal(meal)
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
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      meal: { ...this.state.meal, [e.target.id]: e.target.value },
      errorMessage: '',
      errorFlag: { [e.target.id]: false }  
    })
  }

  render() {
    const { fullScreen, auth, classes, user } = this.props
    const { meal } = this.state

    if (!auth.uid) return <Redirect to='/' />
    if (user.admin === false) return <Redirect to='/' />
    if (this.state.errorMessage === 'Meal not found') return <Redirect to='/meals' />

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle
            className={classes.formtitle}
          > 
            {this.state.editMode === 'edit' ? 'Editing a Meal' : 'Creating a Meal'}
          </DialogTitle>
          <DialogContent>
          { this.state.errorMessage !== '' ?
            <Typography
              className={classes.error}
            >
              {this.state.errorMessage}
            </Typography>  
            : null
          }  
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Meal Title"
              type="text"
              fullWidth
              required
              value={meal.title ? meal.title : ''}
              error={this.state.errorFlag.title}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="subheader"
              label="Meal Subheader"
              type="text"
              fullWidth
              value={meal.subheader ? meal.subheader : ''}
              error={this.state.errorFlag.subheader}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="sportion"
              label="Small Portion"
              type="text"
              fullWidth
              value={meal.sportion ? meal.sportion : ''}
              error={this.state.errorFlag.sportion}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="sprice"
              label="Small Price"
              type="number"
              fullWidth
              value={meal.sprice ? meal.sprice : ''}
              error={this.state.errorFlag.sprice}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="scals"
              label="Small Calories"
              type="number"
              fullWidth
              value={meal.scals ? meal.scals : ''}
              error={this.state.errorFlag.scals}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="sprotein"
              label="Small Protein"
              type="number"
              fullWidth
              value={meal.sprotein ? meal.sprotein : ''}
              error={this.state.errorFlag.sprotein}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="scarbs"
              label="Small Carbs"
              type="number"
              fullWidth
              value={meal.scarbs ? meal.scarbs : ''}
              error={this.state.errorFlag.scarbs}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="sfat"
              label="Small Fat"
              type="number"
              fullWidth
              value={meal.sfat ? meal.sfat : ''}
              error={this.state.errorFlag.sfat}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lportion"
              label="Large Portion"
              type="text"
              fullWidth
              value={meal.lportion ? meal.lportion : ''}
              error={this.state.errorFlag.lportion}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lprice"
              label="Large Price"
              type="number"
              fullWidth
              value={meal.lprice ? meal.lprice : ''}
              error={this.state.errorFlag.lprice}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lcals"
              label="Large Calories"
              type="number"
              fullWidth
              value={meal.lcals ? meal.lcals : ''}
              error={this.state.errorFlag.lcals}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lprotein"
              label="Large Protein"
              type="number"
              fullWidth
              value={meal.lprotein ? meal.lprotein : ''}
              error={this.state.errorFlag.lprotein}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lcarbs"
              label="Large Carbs"
              type="number"
              fullWidth
              value={meal.lcarbs ? meal.lcarbs : ''}
              error={this.state.errorFlag.lcarbs}
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lfat"
              label="Large Fat"
              type="number"
              fullWidth
              value={meal.lfat ? meal.lfat : ''}
              error={this.state.errorFlag.lfat}
              onChange={this.handleChange}
            />                        
            </DialogContent>
          <DialogActions>
            <Button 
              color="secondary"
              component={Link} to="/meals"
              >
              Cancel
            </Button>
            <Button 
              color="primary" 
              autoFocus
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

MealDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    meal: state.meal.meal,
    mealError: state.meal.mealError,
    auth: state.firebase.auth,
    user: state.firebase.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMeal: (id) => dispatch(getMeal(id)),
    createMeal: (meal) => dispatch(createMeal(meal)),
    updateMeal: (meal, id) => dispatch(updateMeal(meal, id))
  }
}

export default compose (
  connect(mapStateToProps, mapDispatchToProps),
  withMobileDialog(),
  withStyles(styles)
)(MealDialog)
