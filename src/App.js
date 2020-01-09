import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Home } from './Home'
import { Callback } from './Callback'
import { Result } from './Result'

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
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
