import React, { useContext } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'

import Person from './Person'
import storeContext from '../../../storeContext'
/**
 * TODO:
 * Grid layout for areas
 * flex layout for label/value
 * pass every area it's fields with values
 */

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  background-color: #eee;
  font-size: 9pt;
  cursor: default;
  overflow-y: auto;
  height: 100vh;

  & div {
    background-color: white !important;
  }
  & * {
    background-color: transparent !important;
  }
  & input,
  & textarea,
  & select {
    -webkit-appearance: none;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    overflow-y: visible;
  }
  & .form-control {
    height: auto;
  }
  & .input-group-addon {
    display: none;
  }

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible;
    /* make sure body grows as needed */
    height: auto !important;

    page-break-inside: avoid;
    page-break-before: avoid;
    page-break-after: avoid;
  }
`
const PageContainer = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* set dimensions */
  height: 29.7cm;
  width: 21cm;
  padding: 1.5cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: inherit;
    width: inherit;

    margin: 0 !important;
    padding: 0.5cm !important;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  @page .hochformat {
    size: A4 portrait;
  }
`
const Footer = styled.div`
  padding-top: 5px;
  @media print {
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: auto;
  grid-template-areas:
    'personalien verzeichnis'
    'anstellung funktionen'
    'zuletzt zuletzt';
`
const Area = styled.div`
  padding: 8px;
  border: 1px solid #ccc;
  border-bottom: none;
`
const AreaPersonalien = styled(Area)`
  grid-area: personalien;
`
const AreaAnstellung = styled(Area)`
  grid-area: anstellung;
`
const AreaFunktionen = styled(Area)`
  grid-area: funktionen;
`
const AreaVerzeichnis = styled(Area)`
  grid-area: verzeichnis;
`
const AreaZuletzt = styled(Area)`
  grid-area: zuletzt;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 18px;
`
const Content = styled.div`
  display: flex;
`
const Label = styled.label`
  width: 3cm;
  flex-grow: 0;
  flex-shrink: 0;
`
const Value = styled.p`
  flex-grow: 1;
`

const PersonPrint = ({ activeId }) => {
  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    abteilungen,
    sektionen,
    bereiche,
    etiketten,
    funktionen,
    showMutationNoetig,
    statusWerte,
    anredeWerte,
    etikettWerte,
    funktionWerte,
    landWerte,
  } = store

  const person = personen.find(p => p.id === activeId) || {}

  return (
    <Container>
      <PageContainer className="hochformat">
        <GlobalStyle />
        <Person activeId={activeId} />
        <Footer>{moment().format('DD.MM.YYYY')}</Footer>
      </PageContainer>
    </Container>
  )
}

export default PersonPrint
