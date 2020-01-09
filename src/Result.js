import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AWS from 'aws-sdk'
import './index.css'
import ls from 'local-storage'
import qs from 'qs'

export function Result () {
  const [idToken, setIdToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    loadLocalStorage()
  }, [])

  function loadLocalStorage () {
    setIdToken(ls.get('idtoken'))
    setAccessToken(ls.get('accesstoken'))
    setRefreshToken(ls.get('refreshtoken'))
  }
  function cleanState () {
    setResult('starting...')
    setError(false)
  }

  function getCredencials () {
    const url = 'cognito-idp.us-east-1.amazonaws.com/' + process.env.REACT_APP_AWS_USERPOOL_ID
    const logins = {}
    logins[url] = idToken // <- the one obtained before
    const params = {
      IdentityPoolId: process.env.REACT_APP_AWS_IDENTITYPOOL_ID,
      Logins: logins
    }

    const creds = new AWS.CognitoIdentityCredentials(params)
    AWS.config.region = process.env.REACT_APP_AWS_REGION
    AWS.config.credentials = creds
    creds.get((err) => {
      if (!err) {
        getS3Data()
      } else {
        setResult(JSON.stringify(error))
        setError(true)
      }
    })
  }

  function callS3 () {
    cleanState()
    getCredencials()
  }

  function getS3Data () {
    const params1 = {
      Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
      MaxKeys: 2
    }

    var bucket = new AWS.S3()
    bucket.listObjectsV2(params1, (err, data) => {
      if (!err) {
        setResult('has ' + data.Contents.length + ' objects')
        setError(false)
      } else {
        setResult(JSON.stringify(err))
        setError(true)
      }
    })
  }

  function callApiGateway () {
    cleanState()
    axios({
      method: 'get',
      url: process.env.REACT_APP_AWS_API_GATEWAY,
      headers: {
        Authorization: idToken
      }
    })
      .then(response => {
        setResult('' + response.data.body)
        setError(false)
      })
      .catch(err => {
        setResult(JSON.stringify(err))
        setError(true)
      })
  }
  function callRefreshToken() {
    axios({
      method: 'post',
      url: 'https://' + process.env.REACT_APP_AWS_COGNITO_URL + '/oauth2/token',
      data: qs.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
        refresh_token: refreshToken
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then(response => {
        ls.set('idtoken', response.data.id_token)
        ls.set('accesstoken', response.data.access_token)
        loadLocalStorage()
      })
      .catch(err => setError(JSON.stringify(err)))
  }
  return (
    <div>
      <h3>Click on the buttons bellow</h3>
      <div>
        <button onClick={callApiGateway}>Click to call an API</button>
        <button onClick={callS3}>Click to call a S3 API</button>
        <button onClick={callRefreshToken}>Click to refresh token</button>
      </div>
      <div className={error ? 'error' : (result.length > 0 ? 'result' : 'hide')}>
        Here is the result of the action: {result}
      </div>
      <br />
      <br />
      <p className='token'><b>ID token:</b> {idToken}</p>
      <p className='token'><b>ACCESS token:</b> {accessToken}</p>
      <p className='token'><b>REFRESH token:</b> {refreshToken}</p>

    </div>
  )
}
