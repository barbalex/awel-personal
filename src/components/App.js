import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'
import useDetectPrint from 'use-detect-print'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'
import PersonTab from './PersonContainer/PersonTab'
import AmtContainer from './AmtContainer'
import Amt from './AmtContainer/Amt'
import AbteilungContainer from './AbteilungContainer'
import Abteilung from './AbteilungContainer/Abteilung'
import SektionContainer from './SektionContainer'
import Sektion from './SektionContainer/Sektion'
import BereichContainer from './BereichContainer'
import Bereich from './BereichContainer/Bereich'
import StammdatenContainer from './StammdatenContainer'
import DeletionModal from './DeletionModal'
import Mutations from './Mutations'
import storeContext from '../storeContext'
import Errors from './Errors'
import PersonPrintFunktionen from './PersonContainer/PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonContainer/PersonPrintPensionierte'
import PersonPrintKader from './PersonContainer/PersonPrintKader'
import PersonPrintVerzTel from './PersonContainer/PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonContainer/PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonContainer/PersonPrintVerzKurzzeichen'
import NavigateSetter from './NavigateSetter'

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
const A4Landscape = createGlobalStyle`
  @page {
    size: A4 landscape;
  }
`

const App = () => {
  const store = useContext(storeContext)
  const isPrinting = useDetectPrint()
  const { printing, activePrintForm } = store

  if (printing || isPrinting) {
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
      <Routes>
        <Route path="/" element={<PersonContainer />} />
        <Route path="/Personen/*" element={<PersonContainer />}>
          <Route path=":personId" element={<PersonTab />} />
        </Route>
        <Route path="/Aemter/*" element={<AmtContainer />}>
          <Route path=":amtId" element={<Amt />} />
        </Route>
        <Route path="/Sektionen/*" element={<SektionContainer />}>
          <Route path=":sektionId" element={<Sektion />} />
        </Route>
        <Route path="/Bereiche/*" element={<BereichContainer />}>
          <Route path=":bereichId" element={<Bereich />} />
        </Route>
        <Route path="/Abteilungen/*" element={<AbteilungContainer />}>
          <Route path=":abteilungId" element={<Abteilung />} />
        </Route>
        <Route path="/Werte/*" element={<StammdatenContainer />}>
          <Route path=":tableName/*" element={<StammdatenContainer />} />
          <Route path=":tableName/:tableId" element={<StammdatenContainer />} />
        </Route>
        <Route path="/mutations" element={<Mutations />} />
      </Routes>
      <Errors />
      <DeletionModal />
      <NavigateSetter />
    </Container>
  )
}

export default observer(App)
