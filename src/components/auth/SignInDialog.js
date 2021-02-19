import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import { signIn } from '../../store/actions/authActions'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'

class SignInDialog extends Component {
 
  state = {
    open: true,
    email: '',
    password: '',
    submitted: false
  }

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
    this.props.signIn(this.state)
    this.setState({submitted: true})
  }
  render() {
    const { fullScreen, auth } = this.props
    if (auth.uid) return <Redirect to='/' />

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle> 
            Login Form
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
            {this.state.submitted && this.props.authError ? this.props.authError : null}     
          </DialogContent>
          <DialogActions>
            <Button 
              color="primary"
              component={Link} to ="/signup"
            >
              Signup
            </Button>
            <Button 
              color="primary"
              onClick={this.handleSubmit}
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

SignInDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth 
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}

export default compose (
  connect(mapStateToProps, mapDispatchToProps),
  withMobileDialog()  
)(SignInDialog)