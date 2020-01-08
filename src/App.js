import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Home } from './Home'
import { Users } from './Users'
import { Callback } from './Callback'
function App () {
  return (
    <Router>
      <Switch>
        <Route path='/users'>
          <Users />
        </Route>
        <Route path='/callback'>
          <Callback />>
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
