import React from 'react'

export function Home () {
  const url = `https://${process.env.REACT_APP_AWS_COGNITO_URL}/login?response_type=code&client_id=${process.env.REACT_APP_AWS_COGNITO_CLIENT_ID}&redirect_uri=http://localhost:3000/callback`
  
  return (
    <div>
      <h2>Public page</h2>
      <p>Click <a href={url}>here</a> to login</p>
    </div>
  )
}
