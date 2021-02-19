import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Navbar from './components/layout/Navbar'
import NotFound from './components/layout/NotFound'
import Dashboard from './components/dashboard/Dashboard'
import MealList from './components/meals/MealList'
import MealDialog from './components/meals/MealDialog'
import MealDelete from './components/meals/MealDelete'
import MenuList from './components/menus/MenuList'
import MenuDialog from './components/menus/MenuDialog'
import MenuDelete from './components/menus/MenuDelete'
import SignInDialog from './components/auth/SignInDialog'
import SignUpDialog from './components/auth/SignUpDialog'
import OrderDialog from './components/orders/OrderDialog'
import OrderList from './components/orders/OrderList'

class App extends Component {

  render() {
    return (
      <Fragment>
        <CssBaseline/>
        <BrowserRouter>
          <Navbar>
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/meal/delete/:id" component={MealDelete} />
              <Route path="/meal/create" component={MealDialog} />
              <Route path="/meals/:id" component={MealDialog} />
              <Route path="/meals" component={MealList} />
              <Route path="/menu/delete/:id" component={MenuDelete} />
              <Route path="/menu/create" component={MenuDialog} />
              <Route path="/menus/:id" component={MenuDialog} />
              <Route path="/menus" component={MenuList} />
              <Route path="/orders/create" component={OrderDialog} />
              <Route path="/orders" component={OrderList} />
              <Route path="/signin" component={SignInDialog} />
              <Route path="/signup" component={SignUpDialog} />
              <Route component={NotFound} />
            </Switch>
          </Navbar>
        </BrowserRouter>
      </Fragment>
    )  
  }
}

export default App