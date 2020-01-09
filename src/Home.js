import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import './index.css'

export function Home () {
  const [idToken, setIdToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  useEffect(() => {
    Auth.currentSession()
      .then(data => {
        setIdToken(data.idToken.jwtToken)
        setRefreshToken(data.idToken.jwtToken)
        setAccessToken(data.accessToken.jwtToken)
      })
      .catch(err => console.log(err))
  }, [])
  return (
    <div>
      <p className='token'><b>ID token:</b> {idToken}</p>
      <p className='token'><b>ACCESS token:</b> {accessToken}</p>
      <p className='token'><b>REFRESH token:</b> {refreshToken}</p>
    </div>
  )
}
