import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import moment from 'moment'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import withMobileDialog from '@material-ui/core/withMobileDialog'

import { getMenu, deleteMenu } from '../../store/actions/menuActions'

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

class MenuDelete extends Component {
 
  state = {
    open: true,
    errorMessage: '',
    menu: {}
  }

  componentDidMount() {
    const id = this.props.match.params.id
    this.props.getMenu(id)
    .then(() => {
      if (this.props.menuError === null) {
        this.setState({ 
          ...this.state,
          meal: { ...this.props.menu },
          errorMessage: null
        })
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
 
  handleClose = () => {
    this.setState({ open: false })
    this.props.history.push('/menus')
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const id = this.props.match.params.id
    this.props.deleteMenu(id)
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

  render() {
    const { auth, classes, user } = this.props
    const menuError = this.state.errorMessage
    const deliveryDate = moment(this.state.menu.deliveryDate)
    if (!auth.uid) return <Redirect to='/' />
    if (user.admin === false) return <Redirect to='/' />
    if (this.state.errorMessage === 'Menu not found') return <Redirect to='/menus' />

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
            Deleting A Menu
          </Typography>  
          { menuError === null ?
            <Typography
              className={classes.content}
            >
              {`Please confirm that you wish to delete the Menu
              with a Delivery Date of ${deliveryDate.format('dddd, MMM Do YYYY')}.`}
            </Typography>  
          : 
            <Typography
              className={classes.error}
            >
              {menuError}
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
            { !menuError ?
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

MenuDelete.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMenu: (id) => dispatch(getMenu(id)),
    deleteMenu: (id) => dispatch(deleteMenu(id))
  }
}

const mapStateToProps = (state) => {
  return {
    menu: state.menu.menu,
    menuError: state.menu.menuError,
    auth: state.firebase.auth,
    user: state.firebase.profile
  }
}


export default compose (
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withMobileDialog()
)(MenuDelete)
