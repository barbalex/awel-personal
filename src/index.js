import React from 'react'
import { render } from 'react-dom'
import username from 'username'

import App from './components/App'
import './styles.css'
import getDbConnection from './src/getDbConnection'
import createStore from './store'
import watchMutations from './src/watchMutations'

import { StoreContextProvider } from './storeContext'

const run = async () => {

  const store = createStore().create()
  watchMutations({ store })
  let db
  try {
    db = await getDbConnection()
  } catch (error) {
    return console.log(error)
  }
  store.setDb(db)

  let user
  try {
    user = await username()
  } catch (error) {
    console.log('Error accessing username:', error.message)
  }
  if (user) store.setUsername(user)

  window.store = store

  render(
      <StoreContextProvider value={store}>
        <App />
      </StoreContextProvider>,
    document.getElementById('root'),
  )
}

run()
