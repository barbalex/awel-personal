import React from 'react'
import { render } from 'react-dom'
import app from 'ampersand-app'
import username from 'username'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'

import App from './components/App'
import './app.global.css'
import getDbConnection from './src/getDbConnection'
import Store from './store'
import watchMutations from './src/watchMutations'

import { StoreContextProvider } from './storeContext'

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

  // expose store to console
  window.store = store

  watchMutations()

  let user
  try {
    user = await username()
  } catch (error) {
    console.log('Error accessing username:', error.message)
  }
  if (user) store.setUsername(user)

  render(
    <HotLoaderContainer>
      <StoreContextProvider value={store}>
        <App />
      </StoreContextProvider>
    </HotLoaderContainer>,
    document.getElementById('root')
  )
}

run()
