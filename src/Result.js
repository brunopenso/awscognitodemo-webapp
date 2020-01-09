import React, { useState, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'
import AWS from 'aws-sdk'
import './index.css'
import ls from 'local-storage'

export function Result () {
  const [idToken, setIdToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [apiCallBody, setApiCallBody] = useState('click on the button above')
  const [s3CallBody, setS3CallBody] = useState('click on the button above')

  useEffect(() => {
    setIdToken(ls.get('idtoken'))
    setAccessToken(ls.get('accesstoken'))
    setRefreshToken(ls.get('refreshtoken'))
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
      } else {
        console.log('returned with error') // <-- might get called if something is missing, anyways self-descriptive
        console.log(err)
      }
    })

    const params1 = {
      Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
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

  function callApiGateway () {
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
      <h2>This is result page</h2>
      <div className='buttons'>
        <button onClick={callApiGateway}>Click to call an API</button>
        <button onClick={callS3}>Click to call a S3 API</button>
      </div>
      <div className='result'>
        <p>Result from the button {apiCallBody}</p>
        <p>Result from the button {s3CallBody}</p>
      </div>
      <br />
      <p className='token'><b>ID token:</b> {idToken}</p>
      <p className='token'><b>ACCESS token:</b> {accessToken}</p>
      <p className='token'><b>REFRESH token:</b> {refreshToken}</p>

    </div>
  )
}
