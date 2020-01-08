import React, { useState, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'

export function Callback () {
  const [idToken, setIdToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [apiCallBody, setApiCallBody] = useState('click on the button above')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    console.log(params.get('code'))

    axios({
      method: 'post',
      url: 'https://simpletestemailonly.auth.us-east-1.amazoncognito.com/oauth2/token',
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
        code: params.get('code'),
        redirect_uri: 'http://localhost:3000/callback'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then(response => {
        setIdToken(response.data.id_token)
        setAccessToken(response.data.access_token)
        setRefreshToken(response.data.refresh_token)
      })
      .catch(err => console.log(err))
  }, [])

  function callApi () {
    axios({
      method: 'get',
      url: 'https://f0puh5ic21.execute-api.us-east-1.amazonaws.com/dev',
      headers: {
        Authorization: idToken
      }
    })
      .then(response => {
        console.log(response)
        setApiCallBody(response.data.body)
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <h2>This is the call back page</h2>
      <p>ID token: {idToken}</p>
      <p>ACCESS token: {accessToken}</p>
      <p>REFRESH token: {refreshToken}</p>
      <button onClick={callApi}>Click to call a API</button>
      <p>Result from the button {apiCallBody}</p>
    </div>
  )
}
