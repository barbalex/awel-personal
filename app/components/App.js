// @flow
import React, { Fragment } from 'react'

import DbContext from '../context/db'
import Navbar from './Navbar'

const App = () => (
  <DbContext>
    {db => {
      const personen = db.prepare('SELECT id from person limit 1').get()

      return (
        <Fragment>
          <Navbar />
          <div>{`id: ${personen.id}`}</div>
          <div>Hello world</div>
        </Fragment>
      )
    }}
  </DbContext>
)

export default App
