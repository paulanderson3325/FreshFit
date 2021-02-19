import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getFirestore } from 'redux-firestore'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'

import moment from 'moment'

import MenuMeal from './MenuMeal'
import { getMenu, createMenu, updateMenu } from '../../store/actions/menuActions'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginBottom: 20
  },
  formtitle: {
    textAlign:'center',
    paddingTop: 5, 
    fontSize: 22, 
    fontWeight: 'bold'
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
  warning: {
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10
  },
  error: {
    fontSize: 16,
    color: 'red',
    paddingTop: 10
  }
})

class MenuDialog extends Component {

  state = {
    editMode: '',
    errorMessage: '',
    definedMeals: [],
    firstRender: true,
    menu: {
      deliveryDate: '',
      publishDate: '',
      cutoffDate: '',  
      selectedMeals: []
    },
    errorFlag: {
      deliveryDate: false,
      publishDate: false,
      cutoffDate: false,
    }
  }

  componentDidMount() {
    if (this.props.match.path === '/menus/:id') {
      const id = this.props.match.params.id
      this.props.getMenu(id)
      .then(() => {
        if (this.props.menuError === null) {
          this.setState({ 
            ...this.state,
            editMode: 'edit',
            menu: { ...this.props.menu },
            errorMessage: null
          })
        } else {
          this.setState({ 
            ...this.state,
            editMode: 'edit',
            errorMessage: this.props.menuError
          })
        }
      })
      .catch(() => {
        this.setState({ 
          ...this.state,
          editMode: 'edit',
          errorMessage: this.props.menuError
        })
      })
    } else {
      this.setState({ 
        ...this.state,
        editMode: 'create'
      })
    } 
  }

  sortBothMeals = () => {
    this.setState({
      ...this.state,
      definedMeals: this.state.definedMeals.sort(this.sortMeals),
      menu: {
        ...this.state.menu,
        selectedMeals: this.state.menu.selectedMeals.sort(this.sortMeals)
      }  
    })
  }

  sortMeals(a,b) {
    const titleA = a.title.toUpperCase()
    const titleB = b.title.toUpperCase()
    let comparison = 0
    if (titleA > titleB) {
      comparison = 1
    } else if (titleA < titleB) {
      comparison = -1
    }
    return comparison
  }

  loadDefinedMeals() {
    const firestore = getFirestore()
    let newDefinedMeals = []
    firestore.collection('meals').get()
    .then((snapshot) => {
      snapshot.forEach( (doc) => {
        const newMeal = {...doc.data(), id: doc.id}
        const selectedMeal = this.state.menu.selectedMeals
        .filter((meal) => meal.id === newMeal.id)
        if (selectedMeal.length === 0 ) {
          newDefinedMeals = [...newDefinedMeals, newMeal]  
        }
        this.setState({
          ...this.state,
          firstRender: false,
          definedMeals: newDefinedMeals  
        }) 
      })
      this.sortBothMeals() 
    })
    .catch((err) => console.log(err))
  }  

  handleAddMeal = (meal) => {
    const id = meal.id
    const newSelectedMeals = [...this.state.menu.selectedMeals, meal]
    this.setState({
      menu: {
        ...this.state.menu,
        selectedMeals: newSelectedMeals.sort(this.sortMeals)
      },  
      definedMeals: this.state.definedMeals.filter(meal => meal.id !== id),
      errorMessage: ''
    })
  }

  handleDeleteMeal = (meal) => {
    const id = meal.id
    const newDefinedMeals = [...this.state.definedMeals, meal]
    this.setState({
      ...this.state,
      definedMeals: newDefinedMeals.sort(this.sortMeals),  
      menu: {
        ...this.state.menu,
        selectedMeals: this.state.menu.selectedMeals.filter((meal) => meal.id !== id)
      },
      errorMessage: ''
    })  
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (!this.state.menu.deliveryDate) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Delivery Date is Required',
        errorFlag: {
          deliveryDate: true
        }
      })  
      return
    }

    if (!this.state.menu.publishDate) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Publish Date is Required',
        errorFlag: {
          publishDate: true
        }
      })  
      return
    }
    if (moment(this.state.menu.publishDate) > moment(this.state.menu.deliveryDate)) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Publish Date can not be greater then the Delivery Date',
        errorFlag: {
          publishDate: true
        }
      })  
      return
    }

    if (!this.state.menu.cutoffDate) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Cutoff Date is Required',
        errorFlag: {
          publishDate: true
        }
      })  
      return
    }

    if (moment(this.state.menu.cutoffDate) > moment(this.state.menu.deliveryDate)) {
      this.setState({ 
        ...this.state,
        errorMessage: 'Cutoff Date can not be greater then the Delivery Date',
        errorFlag: {
          publishDate: true
        }
      })  
      return
    }
    
    if (this.state.menu.selectedMeals.length === 0) {
      this.setState({ 
        ...this.state,
        errorMessage: 'A Menu must contain at least one meal'
      })  
      return
    }

    if (this.state.editMode === 'edit') {
      const id = this.props.match.params.id
      const menu = this.state.menu
      this.props.updateMenu(menu, id)
      .then(() => {
        if (this.props.menuError === null) {
          this.handleClose()
        } else {
          this.setState({ 
            ...this.state,
            errorMessage: this.props.menuError
          })
        }  
      })
      .catch(() => {
        this.setState({ 
          ...this.state,
          errorMessage: this.props.menuError
        })
      })
    } else {
      const menu = this.state.menu
      this.props.createMenu(menu)
      .then(() => {
        if (this.props.menuError === null) {
          this.handleClose()
        } else {
          this.setState({ 
            ...this.state,
            errorMessage: this.props.menuError
          })
        }  
      })
      .catch(() => {
        this.setState({ 
          ...this.state,
          errorMessage: this.props.menuError
        })
      })
    }  
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      menu: { ...this.state.menu, [e.target.id]: e.target.value },
      errorMessage: '',
      errorFlag: { [e.target.id]: false }  
    })
  }

  handleClose = () => {
    this.props.history.push('/menus')
  }


  render() {
    if (this.state.errorMessage === 'Menu not found') return <Redirect to='/menus' />

    if (this.state.editMode === 'create' && this.state.firstRender === true) {
      this.loadDefinedMeals()
    }

    if (this.state.editMode === 'edit' && this.state.firstRender === true) {
      this.loadDefinedMeals()
    }
    
    const { definedMeals, errorMessage } = this.state
    const { deliveryDate, publishDate, cutoffDate, selectedMeals } = this.state.menu
    const { classes, auth, user } = this.props

    if (!auth.uid) return <Redirect to='/' />
    if (user.admin === false) return <Redirect to='/' />

    return (
      <Grid container spacing={8} className={classes.root}>
        <Grid item xs={12} sm={6}>
          <Paper 
            className={classes.paper} 
            elevation={5}
          >
            <Typography
              className={classes.formtitle}
            >
            {this.state.editMode === 'edit' ? 'Editing a Menu' : 'Creating a Menu'}  
            </Typography>  
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="deliveryDate"
                label="Delivery Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true
                }}
                error={this.state.errorFlag.deliveryDate}
                value={deliveryDate ? deliveryDate : ''}
                onChange={this.handleChange}
              />            
              <TextField
                margin="dense"
                id="publishDate"
                label="Publish Date"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true
                }}
                error={this.state.errorFlag.publishDate}
                value={publishDate ? publishDate : ''}
                onChange={this.handleChange}
              />            
              <TextField
                margin="dense"
                id="cutoffDate"
                label="Cutoff Date"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true
                }}
                error={this.state.errorFlag.cutoffDate}
                value={cutoffDate ? cutoffDate : ''}
                onChange={this.handleChange}
              />            
            { errorMessage !== '' ?
              <Typography
                className={classes.error}
              >
                {errorMessage}
              </Typography>  
            : null
            }  
            </DialogContent>
            <DialogActions>
              <Button 
                color="secondary"
                onClick={this.handleClose}
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
          </Paper>
          <Typography
            className={classes.listtitle}
          >
            Menu Meals Selected
          </Typography>
          { this.state.menu.selectedMeals.length === 0
            ? <Paper
                className={classes.paper} 
                elevation={5}
              >
                <Typography
                  className={classes.warning} 
                >
                  Please select at least one meal for the menu
                </Typography>
              </Paper>
            : null 
          }
          <List 
            className={classes.list}      
          >
            { selectedMeals && selectedMeals.map( meal => {
              return (
                <MenuMeal 
                  meal={meal} 
                  key={meal.id}
                  buttonText={'Remove'}
                  onSubmit={this.handleDeleteMeal}
                />
              )  
            })}
          </List>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            className={classes.listtitle}
          >
            Meals to Select From
          </Typography>
          <List 
            className={classes.list}      
          >
            { definedMeals && definedMeals.map( meal => {
              return (
                <MenuMeal 
                  meal={meal} 
                  key={meal.id}
                  buttonText={'Add'}
                  onSubmit={this.handleAddMeal}
                />
              )  
            })}
          </List>
        </Grid>
      </Grid>
    )
  }
}

MenuDialog.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    menu: state.menu.menu,
    menuError: state.menu.menuError,
    auth: state.firebase.auth,
    user: state.firebase.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMenu: (id) => dispatch(getMenu(id)),
    createMenu: (menu) => dispatch(createMenu(menu)),
    updateMenu: (menu, id) => dispatch(updateMenu(menu, id))
  }
}

export default compose (
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(MenuDialog)

