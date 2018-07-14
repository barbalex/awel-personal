import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Database from 'better-sqlite3'

import App from './components/App'
import DbContext from './db-context'
import './app.global.css'

let db
try {
  db = new Database('C:/Users/alexa/kapla.db')
} catch (error) {
  console.log(error)
}

render(
  <AppContainer>
    <DbContext.Provider value={db}>
      <App />
    </DbContext.Provider>
  </AppContainer>,
  document.getElementById('root')
)
