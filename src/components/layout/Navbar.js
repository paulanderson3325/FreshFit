import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import grey from '@material-ui/core/colors/grey'
import { withStyles } from '@material-ui/core/styles'

import withMobileDialog from '@material-ui/core/withMobileDialog'

import { signOut } from '../../store/actions/authActions'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer +1,
    backgroundColor: grey[800]
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 1,
    },
  },
  nested: {
    paddingLeft: theme.spacing.unit * 1
  },
  typography: {
    flex: 1,  
    color: grey[50]
  },
  button: {
    marginLeft: 10,
    color: grey[50]
  }
})


class Navbar extends Component {
  
  state = {
    mobileOpen: false
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  render() {
    const { 
      classes, 
      location: { pathname }, 
      children, 
      fullScreen, 
      auth,
      user 
    } = this.props

    const { mobileOpen } = this.state

    const myAdminMenu = () => {
      return (
        <div>
          <MenuItem 
            component={Link} to="/" selected={'/' === pathname}
            onClick={fullScreen ? this.handleDrawerToggle : null}
          >
            Home
          </MenuItem>
          <MenuItem 
            component={Link} to="/meals" selected={'/meals' === pathname}
            onClick={fullScreen ? this.handleDrawerToggle : null}
          >
            Meals
          </MenuItem>
          <MenuItem 
            component={Link} to="/menus" selected={'/menus' === pathname}
            onClick={fullScreen ? this.handleDrawerToggle : null}
          >
            Menus
          </MenuItem>
          <MenuItem 
            component={Link} to="/orders" selected={'/orders' === pathname}
            onClick={fullScreen ? this.handleDrawerToggle : null}
          >
            Orders
          </MenuItem>
        </div>  
      )
    }    

    const myUserMenu = () => {
      return (
        <div>
          <MenuItem 
            component={Link} to="/" selected={'/' === pathname}
            onClick={fullScreen ? this.handleDrawerToggle : null}
          >
            Home
          </MenuItem>
          <MenuItem 
            component={Link} to="/orders/create" selected={'/orders/create' === pathname}
            onClick={fullScreen ? this.handleDrawerToggle : null}
          >
            Add Order
          </MenuItem>
        </div>  
      )
    }    

    const drawer = (
      <div>
        <Hidden xsDown>
          <div className={classes.toolbar} />
        </Hidden>
        <MenuList>
          {user.admin === false ? myUserMenu() : myAdminMenu()}      
        </MenuList>
      </div>
    )

    return (     
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap
              className={classes.typography}
            >
              {"F{re}sh Fit Meals"}
            </Typography>
              <div>
                { !auth.uid ?
                  <Button
                    component={Link} to ="/signin"
                    className={classes.button}
                  >
                    Login
                  </Button>
                  :
                  <Button 
                    className={classes.button}
                    onClick={this.props.signOut}
                  >
                    Logout
                  </Button>
                }
            </div>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              open={mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{ paper: classes.drawerPaper }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{ paper: classes.drawerPaper }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    )    
  }  
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.firebase.profile  
  }
}

//connect(mapStateToProps, mapDispatchToProps),

export default compose (
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withMobileDialog(),  
  withStyles(styles)
)(Navbar)