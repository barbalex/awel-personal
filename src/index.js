import React from 'react'
import { render } from 'react-dom'
import username from 'username'

import App from './components/App'
import './styles.css'
import getDbConnection from './src/getDbConnection'
import createStore from './store'
import watchMutations from './src/watchMutations'

import { StoreContextProvider } from './storeContext'
import { DbContextProvider } from './dbContext'

const run = async () => {
  let db
  try {
    db = await getDbConnection()
  } catch (error) {
    return console.log(error)
  }
  const store = createStore(db).create()

  watchMutations({ store })

  let user
  try {
    user = await username()
  } catch (error) {
    console.log('Error accessing username:', error.message)
  }
  if (user) store.setUsername(user)

  window.store = store

  render(
    <DbContextProvider value={db}>
      <StoreContextProvider value={store}>
        <App />
      </StoreContextProvider>
    </DbContextProvider>,
    document.getElementById('root'),
  )
}

run()