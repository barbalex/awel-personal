import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'

import App from './components/App'
import DbContext from './db-context'
import './app.global.css'
import getDbConnection from './src/getDbConnection'

const run = async () => {
  let db
  try {
    db = await getDbConnection()
  } catch (error) {
    return console.log(error)
  }
  // TODO:
  // check if is valid db
  // if not: ask for other file

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
