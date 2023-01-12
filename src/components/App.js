import React, { useContext } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
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
import PersonMutationPrint from './PersonContainer/PersonMutationPrint'
import PersonPrintFunktionen from './PersonContainer/PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonContainer/PersonPrintPensionierte'
import PersonPrintKader from './PersonContainer/PersonPrintKader'
import PersonPrintVerzTel from './PersonContainer/PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonContainer/PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonContainer/PersonPrintVerzKurzzeichen'
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
const A4Portrait = createGlobalStyle`
  @page {
    size: A4 portrait;
  }
`
const A4Landscape = createGlobalStyle`
  @page {
    size: A4 landscape;
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
      if (activeId)
        return (
          <>
            <A4Portrait />
            <PersonPrint activeId={activeId} />
          </>
        )
    }
    if (activePrintForm === 'personMutation') {
      const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
      if (activeId)
        return (
          <>
            <A4Portrait />
            <PersonMutationPrint activeId={activeId} />
          </>
        )
    }
    if (activePrintForm === 'personFunktionen') {
      return (
        <>
          <A4Landscape />
          <PersonPrintFunktionen />
        </>
      )
    }
    if (activePrintForm === 'personPensionierte') {
      return (
        <>
          <A4Landscape />
          <PersonPrintPensionierte />
        </>
      )
    }
    if (activePrintForm === 'personKader') {
      return (
        <>
          <A4Landscape />
          <PersonPrintKader />
        </>
      )
    }
    if (activePrintForm === 'personVerzTel') {
      return (
        <>
          <A4Landscape />
          <PersonPrintVerzTel />
        </>
      )
    }
    if (activePrintForm === 'personVerzMobiltel') {
      return (
        <>
          <A4Landscape />
          <PersonPrintVerzMobiltel />
        </>
      )
    }
    if (activePrintForm === 'personVerzKurzzeichen') {
      return (
        <>
          <A4Landscape />
          <PersonPrintVerzKurzzeichen />
        </>
      )
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
