import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Login from './pages/login'
import Home from './pages/home'
import Menu from './pages/menu'
import Clients from './pages/clients'
import Client from './pages/client'

class App extends Component {
  render() {
    const currentPath = window.location.pathname;
    return (
      <MuiThemeProvider>
        <div className="App">
          { !currentPath.includes(`/login`) ? <Menu /> : null }
          { currentPath ===  "/" ? <Redirect to={"/login"}/> : null }
          <Route exact path="/login" component={Login}/>
          <Route exact path="/clients" component={Clients}/>
          <Route exact path="/client/new" component={Client}/>
          <Route exact path="/client/:id" component={Client}/>
          <Route exact path="/home" component={Home}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
