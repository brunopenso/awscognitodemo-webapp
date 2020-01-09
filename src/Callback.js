import React, { useState, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'
import './index.css'

export function Callback () {
  const [idToken, setIdToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    console.log(params.get('code'))

    axios({
      method: 'post',
      url: 'https://' + process.env.REACT_APP_AWS_COGNITO_URL + '/oauth2/token',
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
        console.log(response.data)
        setIdToken(response.data.id_token)
        setAccessToken(response.data.access_token)
        setRefreshToken(response.data.refresh_token)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <h2>This is the call back page</h2>
      <p className='token'><b>ID token:</b> {idToken}</p>
      <p className='token'><b>ACCESS token:</b> {accessToken}</p>
      <p className='token'><b>REFRESH token:</b> {refreshToken}</p>
      <p className='token'>###</p>
    </div>
  )
}
