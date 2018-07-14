import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
import Database from 'better-sqlite3'

import App from './components/App'
import DbContext from './db-context'
import './app.global.css'

const run = async () => {
  let db
  try {
    db = new Database('C:/Users/alexa/kapla.db', { fileMustExist: true })
  } catch (error) {
    if (error.code === 'SQLITE_CANTOPEN') {
      // TODO:
      // 1. await user choose db file
      // 2. check if is valid db
      console.log('index.js, SQLITE_CANTOPEN Error')
    } else {
      console.log('index.js, Error:', error)
    }
  }
  // TODO:
  // fill store with db data?
  // in the process check if is valid db
  // if not: ask for other file
  console.log('index.js, db:', db)

  render(
    <HotLoaderContainer>
      <DbContext.Provider value={db}>
        <App />
      </DbContext.Provider>
    </HotLoaderContainer>,
    document.getElementById('root')
  )
}

run()
