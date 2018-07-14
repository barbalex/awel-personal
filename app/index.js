import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
import Database from 'better-sqlite3'

import App from './components/App'
import DbContext from './db-context'
import './app.global.css'
import chooseDb from './src/chooseDb'

const run = async () => {
  // TODO:
  // 1. get dbPath from config file or standard config value
  let db
  let dbPath = 'C:/Users/alexa/kapla.db'
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    if (error.code === 'SQLITE_CANTOPEN') {
      // await user choose db file
      try {
        dbPath = await chooseDb()
      } catch (chooseError) {
        return console.log('Error after choosing db:', chooseError)
      }
      db = new Database(dbPath, { fileMustExist: true })
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
