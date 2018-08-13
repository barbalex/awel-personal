import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
import { Provider as MobxProvider } from 'mobx-react'

import App from './components/App'
import DbContext from './context/db'
import './app.global.css'
import getDbConnection from './src/getDbConnection'
import ConfigStore from './store/Config'

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
        <MobxProvider configStore={ConfigStore.create({ dbPath: db.name })}>
          <App />
        </MobxProvider>
      </DbContext.Provider>
    </HotLoaderContainer>,
    document.getElementById('root')
  )
}

run()
