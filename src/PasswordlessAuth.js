import React, { useState } from 'react'
import axios from 'axios'
import './index.css'
import { useHistory } from 'react-router-dom'
import ls from 'local-storage'

export function PasswordlessAuth () {
  const history = useHistory()
  const [name, setName] = useState('BrunoPenso')
  const [email, setEmail] = useState('bruno.penso@gmail.com')
  const [response, setResponse] = useState('')
  const [session, setSession] = useState('')
  const [code, setCode] = useState('')

  function createUser () {
    setResponse('loading....')
    axios({
      method: 'post',
      url: 'https://' + process.env.REACT_APP_AWS_PLA_URL,
      data: {
        ClientId: process.env.REACT_APP_AWS_PLA_CLIENT_ID,
        Username: email,
        Password: 'c00f814cf24b92e48e555977b75f54857540d42aa47316f0bf21c16e65d9',
        UserAttributes:
            [
              {
                Name: 'name',
                Value: name
              }
            ],
        ValidationData: null
      },
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        authority: 'cognito-idp.us-east-1.amazonaws.com',
        // 'sec-fetch-mode': 'cors',
        // 'sec-fetch-site': 'cross-site',
        'x-amz-target': 'AWSCognitoIdentityProviderService.SignUp'
      }
    })
      .then(response => {
        setResponse(JSON.stringify(response.data))
      })
      .catch(err => setResponse(JSON.stringify(err)))
  }
  function requestChallenge () {
    setResponse('loading....')
    axios({
      method: 'post',
      url: 'https://' + process.env.REACT_APP_AWS_PLA_URL,
      data: {
        AuthFlow: 'CUSTOM_AUTH',
        ClientId: process.env.REACT_APP_AWS_PLA_CLIENT_ID,
        AuthParameters:
          {
            USERNAME: email
          },
        ClientMetadata: {}
      },
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        authority: 'cognito-idp.us-east-1.amazonaws.com',
        // 'sec-fetch-mode': 'cors',
        // 'sec-fetch-site': 'cross-site',
        'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth'
      }
    })
      .then(response => {
        setResponse(JSON.stringify(response.data))
        setSession(response.data.Session)
      })
      .catch(err => setResponse(JSON.stringify(err)))
  }
  function makeChallenge () {
    setResponse('loading....')
    axios({
      method: 'post',
      url: 'https://' + process.env.REACT_APP_AWS_PLA_URL,
      data: {
        ChallengeName: 'CUSTOM_CHALLENGE',
        ChallengeResponses:
          {
            USERNAME: email,
            ANSWER: code
          },
        ClientId: process.env.REACT_APP_AWS_PLA_CLIENT_ID,
        Session: session
      },
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        authority: 'cognito-idp.us-east-1.amazonaws.com',
        // 'sec-fetch-mode': 'cors',
        // 'sec-fetch-site': 'cross-site',
        'x-amz-target': 'AWSCognitoIdentityProviderService.RespondToAuthChallenge'
      }
    })
      .then(response => {
        ls.set('idtoken', response.data.AuthenticationResult.IdToken)
        ls.set('accesstoken', response.data.AuthenticationResult.AccessToken)
        ls.set('refreshtoken', response.data.AuthenticationResult.RefreshToken)
        history.push('/result')
      })
      .catch(err => setResponse(JSON.stringify(err)))
  }
  return (
    <div>
      <h2>Steps to logging passwordless</h2>
      <p>Name: <input type='text' value={name} onChange={(event) => setName(event.target.value)} /></p>
      <p>Email: <input type='text' value={email} onChange={(event) => setEmail(event.target.value)} /></p>
      <p>Challenge code: <input type='text' value={code} onChange={(event) => setCode(event.target.value)} /></p>
      <div>
        <button onClick={createUser}>Create user</button>
        <button onClick={requestChallenge}>Request challenge</button>
        <button onClick={makeChallenge}>Make challenge</button>
      </div>
      <br />
      <p>{response}</p>
    </div>
  )
}
