// @flow
import React, { Fragment } from 'react'
import app from 'ampersand-app'

import Navbar from './Navbar'

const App = () => {
  const personen = app.db.prepare('SELECT id from person limit 1').get()

  return (
    <Fragment>
      <Navbar />
      <div>{`id: ${personen.id}`}</div>
      <div>Hello world</div>
    </Fragment>
  )
}

export default App
