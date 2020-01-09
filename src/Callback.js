import React, { useState, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'
import AWS from 'aws-sdk'
import './index.css'

export function Callback () {
  const [idToken, setIdToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [apiCallBody, setApiCallBody] = useState('click on the button above')
  const [s3CallBody, setS3CallBody] = useState('click on the button above')
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
        setIdToken(response.data.id_token)
        setAccessToken(response.data.access_token)
        setRefreshToken(response.data.refresh_token)
      })
      .catch(err => console.log(err))
  }, [])

  function callS3 () {
    setS3CallBody('clicked - wait - getting results')

    const url = 'cognito-idp.us-east-1.amazonaws.com/' + process.env.REACT_APP_AWS_USERPOOL_ID
    const logins = {}
    logins[url] = idToken // <- the one obtained before
    const params = {
      IdentityPoolId: process.env.REACT_APP_AWS_IDENTITYPOOL_ID,
      Logins: logins
    }

    const creds = new AWS.CognitoIdentityCredentials(params)
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = creds
    creds.get((err) => {
      if (!err) {
        console.log('returned without error') // <-- this gets called!!!
        // and the values are correctly set!
        var accessKeyId = AWS.config.credentials.accessKeyId
        var secretAccessKey = AWS.config.credentials.secretAccessKey
        var sessionToken = AWS.config.credentials.sessionToken
      } else {
        console.log('returned with error') // <-- might get called if something is missing, anyways self-descriptive. 
        console.log(err)
      }
    })

    const params1 = {
      Bucket: 'simplescognitotest',
      MaxKeys: 2
    }

    var bucket = new AWS.S3()
    bucket.listObjectsV2(params1, (err, data) => {
      if (!err) {
        setS3CallBody('has ' + data.Contents.length + ' objects')
      } else {
        setS3CallBody('error getting content: ' + err)
      }
    })
  }

  function callApi () {
    axios({
      method: 'get',
      url: process.env.REACT_APP_AWS_API_GATEWAY,
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
      <p className='token'><b>ID token:</b> {idToken}</p>
      <p className='token'><b>ACCESS token:</b> {accessToken}</p>
      <p className='token'><b>REFRESH token:</b> {refreshToken}</p>
      <p className='token'>###</p>
      <button onClick={callApi}>Click to call an API</button>
      <p>Result from the button {apiCallBody}</p>
      <br />
      <br />
      <button onClick={callS3}>Click to call a S3 API</button>
      <p>Result from the button {s3CallBody}</p>
    </div>
  )
}
