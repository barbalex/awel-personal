import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
import Database from 'better-sqlite3'

import App from './components/App'
import DbContext from './db-context'
import './app.global.css'

const run = async () => {
  // TODO:
  // 1. get dbPath from config file or standard config value
  let db
  try {
    db = new Database('C:/Users/alexa/kapla.db', { fileMustExist: true })
  } catch (error) {
    if (error.code === 'SQLITE_CANTOPEN') {
      // TODO:
      // await user choose db file
      console.log('index.js, TODO: await user choose db file')
    } else {
      console.log('index.js, Error opening db file:', error)
    }
  }
  // TODO:
  // check if is valid db
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
