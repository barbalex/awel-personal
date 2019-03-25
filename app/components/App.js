import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'
import useDetectPrint from 'use-detect-print'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'
import AmtContainer from './AmtContainer'
import AbteilungContainer from './AbteilungContainer'
import SektionContainer from './SektionContainer'
import BereichContainer from './BereichContainer'
import StammdatenContainer from './StammdatenContainer'
import DeletionModal from './DeletionModal'
import Mutations from './Mutations'
import storeContext from '../storeContext'
import Errors from './Errors'
import PersonPrint from './PersonContainer/PersonPrint'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

registerLocale('de', de)
setDefaultLocale('de')

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  @media print {
    height: auto !important;
    width: auto !important;
    overflow: visible !important;
  }
`

const App = () => {
  const store = useContext(storeContext)
  const isPrinting = useDetectPrint()
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { printing, activePrintForm } = store

  if (printing || isPrinting) {
    if (activePrintForm === 'personalblatt') {
      const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
      if (activeId) return <PersonPrint activeId={activeId} />
    }
  }

  return (
    <Container>
      <Navbar />
      {activeLocation === 'Personen' && <PersonContainer />}
      {activeLocation === 'Aemter' && <AmtContainer />}
      {activeLocation === 'Sektionen' && <SektionContainer />}
      {activeLocation === 'Bereiche' && <BereichContainer />}
      {activeLocation === 'Abteilungen' && <AbteilungContainer />}
      {activeLocation.includes('Werte') && <StammdatenContainer />}
      {activeLocation === 'mutations' && <Mutations />}
      <Errors />
      <DeletionModal />
    </Container>
  )
}

export default observer(App)
