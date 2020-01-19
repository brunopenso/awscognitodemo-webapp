import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Home } from './Home'
import { Callback } from './Callback'
import { Result } from './Result'
import { PasswordlessAuth } from './PasswordlessAuth'

function App () {
  return (
    <Router>
      <Switch>
        <Route path='/callback'>
          <Callback />
        </Route>
        <Route path='/result'>
          <Result />
        </Route>
        <Route path='/passwordlessAuth'>
          <PasswordlessAuth />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
