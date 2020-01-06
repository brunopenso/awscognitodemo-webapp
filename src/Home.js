import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'

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
      <h4>idToken: {idToken}</h4>
      <h4>refreshToken: {refreshToken}</h4>
      <h4>accessToken: {accessToken}</h4>
    </div>
  )
}
