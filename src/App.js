/**
 * Root level of the React application.
 *
 * For a typical application, this would contain access to a lot of your own UI components, one or more of which might contain Layer XDK Components.
 */
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/Login'
import Messenger from './components/Messenger'
import '@layerhq/web-xdk/themes/layer-basic-blue.css'

class App extends Component {
  render() {
    return (<BrowserRouter>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/conversations' component={Messenger} />
        <Route path='/conversations/:conversationId' component={Messenger} />
      </Switch>
    </BrowserRouter>)
  }
}

export default App;
