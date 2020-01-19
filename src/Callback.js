import React, { useState, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'
import './index.css'
import ls from 'local-storage'
import { useHistory } from 'react-router-dom'

export function Callback () {
  const history = useHistory()
  const [error, setError] = useState('')

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
      .then(response => setData(response))
      .catch(err => setError(JSON.stringify(err)))
  }, [])

  function setData (response) {
    ls.set('idtoken', response.data.id_token)
    ls.set('accesstoken', response.data.access_token)
    ls.set('refreshtoken', response.data.refresh_token)
    history.push('/result')
  }

  return (
    <div>
      <h2>This is the callback page</h2>
      <p>Loading token data...</p>
      <h3>{error}</h3>
    </div>
  )
}
