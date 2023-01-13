import React, { useContext } from 'react'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'
import useDetectPrint from 'use-detect-print'

import RouterComponent from './Router'
import storeContext from '../storeContext'
import Navbar from './Navbar'

registerLocale('de', de)
setDefaultLocale('de')

const App = () => {
  const isPrinting = useDetectPrint()
  const store = useContext(storeContext)
  const { printing } = store

  if (printing || isPrinting) {
    return <RouterComponent />
  }

  return (
    <>
      <Navbar />
      <RouterComponent />
    </>
  )
}

export default App
