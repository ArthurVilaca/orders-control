import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/home'
import Menu from './pages/menu'
import Clients from './pages/clients'
import Client from './pages/client'
import Orders from './pages/orders'
import Order from './pages/order'
import Report from './pages/report'

class App extends Component {
  render() {
    const currentPath = window.location.pathname;
    return (
      <MuiThemeProvider>
        <div className="App">
          <Menu />
          { currentPath ===  "/" && <Redirect to={"/home"}/> }
          <Route exact path="/clients" component={Clients}/>
          <Route exact path="/client/new" component={Client}/>
          <Route exact path="/client/:id" component={Client}/>
          <Route exact path="/orders" component={Orders}/>
          <Route exact path="/order/:id" component={Order}/>
          <Route exact path="/report" component={Report}/>
          <Route exact path="/home" component={Home}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
