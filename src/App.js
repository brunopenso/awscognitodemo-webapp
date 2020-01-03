import React from 'react'
import logo from './logo.svg'
import './App.css'

function App () {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          This is a public page. Click <a href='/login'>here</a> to login.
        </p>
      </header>
    </div>
  )
}

export default App
