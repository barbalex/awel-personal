import React from 'react'
import { render } from 'react-dom'
import { ipcRenderer } from 'electron'

import App from './components/App'
import './styles.css'
import getDb from './src/getDb'
import createStore from './store'
import watchMutations from './src/watchMutations'

import { StoreContextProvider } from './storeContext'

const run = async () => {
  const store = createStore().create()
  const { addError, setDb, setUsername } = store
  watchMutations({ store })

  let db
  try {
    db = await getDb(store)
  } catch (error) {
    addError(error)
  }
  setDb(db)

  const user = await ipcRenderer.invoke('get-username')
  if (user) setUsername(user)

  window.store = store

  render(
    <StoreContextProvider value={store}>
      <App />
    </StoreContextProvider>,
    document.getElementById('root'),
  )
}

run()
