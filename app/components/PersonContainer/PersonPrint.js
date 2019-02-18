import React, { useContext, useMemo } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'
import get from 'lodash/get'

import storeContext from '../../storeContext'
import Zuletzt from './Person/Zuletzt'
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
const Content = styled.div``
const Label = styled.label`
  font-size: small;
`
const Value = styled.p``

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
  } = store

  const person = personen.find(p => p.id === activeId) || {}

  const myEtiketten = useMemo(() =>
    etiketten
      .filter(e => e.idPerson === activeId)
      .filter(w => !!w.etikett)
      .filter(p => p.deleted === 0)
      .map(e => e.etikett),
  )
  const myFunktionen = useMemo(() =>
    funktionen
      .filter(e => e.idPerson === activeId)
      .filter(w => !!w.funktion)
      .filter(p => p.deleted === 0)
      .map(e => e.funktion),
  )

  const InputValue = ({ label, value }) => (
    <Content>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Content>
  )

  const personVorgesetzt = personen.find(a => a.id === person.vorgesetztId)

  return (
    <Container>
      <PageContainer className="hochformat">
        <GlobalStyle />
        <Wrapper>
          <AreaPersonalien>
            <Title>Personalien</Title>
            {/*<PersonImage person={person} />*/}
            <InputValue value={person.name} label="Name" />
            <InputValue value={person.vorname} label="Vorname" />
            <InputValue value={person.anrede} label="Anrede" />
            <InputValue value={person.kurzzeichen} label="Kurzzei&shy;chen" />
            <InputValue value={person.adresse} label="Adresse" />
            <InputValue value={person.plz} label="PLZ" />
            <InputValue value={person.ort} label="Ort" />
            <InputValue label="Land" value={person.land} />
            <InputValue value={person.email} label="Email" />
            <InputValue value={person.geburtDatum} label="Geburtsdatum" />
            {/*<Telefones row={false} />*/}
          </AreaPersonalien>
          <AreaAnstellung>
            <Title>Anstellung</Title>
            <InputValue value={person.status} label="Status" />
            <InputValue value={person.eintrittDatum} label="Eintritt" />
            <InputValue value={person.austrittDatum} label="Austritt" />
            <InputValue
              value={person.beschaeftigungsgrad}
              label="Beschäftigungsgrad (%)"
            />
            <InputValue value={person.standort} label="Standort" />
            <InputValue value={person.bueroNr} label="Büro Nr." />
          </AreaAnstellung>
          <AreaFunktionen>
            <Title>Funktionen</Title>
            <InputValue
              value={get(aemter.find(a => a.id === person.amt), 'name') || ''}
              label="Amt"
            />
            <InputValue
              label="Abteilung"
              value={
                get(abteilungen.find(a => a.id === person.abteilung), 'name') ||
                ''
              }
            />
            <InputValue
              label="Sektion"
              value={
                get(sektionen.find(a => a.id === person.sektion), 'name') || ''
              }
            />
            <InputValue
              label="Bereich"
              value={
                get(bereiche.find(a => a.id === person.bereich), 'name') || ''
              }
            />
            <InputValue
              label="Vorgesetzte(r)"
              value={
                personVorgesetzt
                  ? `${personVorgesetzt.name} ${personVorgesetzt.vorname}`
                  : ''
              }
            />
            <InputValue label="Funktionen" value={myFunktionen.join(', ')} />
          </AreaFunktionen>
          <AreaVerzeichnis>
            <Title>Verzeichnis</Title>
            <InputValue value={person.parkplatzNr} label="Parkplatz Nr." />
            <InputValue label="Etiketten" value={myEtiketten.join(', ')} />
            <InputValue value={person.bemerkungen} label="Bemerkun&shy;gen" />
            {/*<Links row={false} />
            <Schluessels row={false} />
            <MobileAbos row={false} />*/}
          </AreaVerzeichnis>
          <AreaZuletzt>
            <Zuletzt row={false} />
          </AreaZuletzt>
        </Wrapper>
        <Footer>{moment().format('DD.MM.YYYY')}</Footer>
      </PageContainer>
    </Container>
  )
}

export default PersonPrint
