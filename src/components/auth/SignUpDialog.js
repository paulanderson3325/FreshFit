import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { compose } from 'recompose'
//import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import { signUp } from '../../store/actions/authActions'

class SignUpDialog extends Component {
 
  state = {
    open: true,
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.signUp(this.state)
    this.handleClose()
  }

  render() {
    const { fullScreen, auth, authError } = this.props
    if (auth.uid) return <Redirect to='/' />

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle> 
            Signup Form
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              required
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              required
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="firstName"
              label="First Name"
              type="text"
              fullWidth
              required
              onChange={this.handleChange}
            />            
            <TextField
              margin="dense"
              id="lastName"
              label="Last Name"
              type="text"
              fullWidth
              required
              onChange={this.handleChange}
            />            
            Need to fix Signup Error Message
            { authError ? authError : null }
          </DialogContent>
          <DialogActions>
            <Button 
              color="primary"
              onClick={this.handleSubmit}
              >
              Sign Up
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

SignUpDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError 
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser))
  }
}

export default compose (
  connect(mapStateToProps, mapDispatchToProps),
  withMobileDialog()  
)(SignUpDialog)
