import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
import { Provider as MobxProvider } from 'mobx-react'
import app from 'ampersand-app'

import App from './components/App'
import './app.global.css'
import getDbConnection from './src/getDbConnection'
import Store from './store'

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
  const store = Store.create()
  app.extend({
    init() {
      this.db = db
      this.store = store
    }
  })
  app.init()

  render(
    <HotLoaderContainer>
      <MobxProvider store={store}>
        <App />
      </MobxProvider>
    </HotLoaderContainer>,
    document.getElementById('root')
  )
}

run()
