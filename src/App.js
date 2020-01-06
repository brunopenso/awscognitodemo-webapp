import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Home } from './Home'
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react'

Amplify.configure(awsconfig)

function App () {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default withAuthenticator(App, { usernameAttributes: 'email' })
