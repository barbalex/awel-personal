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
        <Wrapper>
          <AreaPersonalien>
            <Title>Personalien</Title>
            <PersonImage person={person} />
            <Input
              key={`${personId}name`}
              value={person.name}
              field="name"
              label="Name"
            />
            <Input
              key={`${personId}vorname`}
              value={person.vorname}
              field="vorname"
              label="Vorname"
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}anrede`}
              value={person.anrede}
              field="anrede"
              label="Anrede"
              options={anredeOptions}
            />
            <Input
              key={`${personId}kurzzeichen`}
              value={person.kurzzeichen}
              field="kurzzeichen"
              label="Kurzzei&shy;chen"
            />
            <Input
              key={`${personId}adresse`}
              value={person.adresse}
              field="adresse"
              label="Adresse"
            />
            <Input
              key={`${personId}plz`}
              value={person.plz}
              field="plz"
              label="PLZ"
            />
            <Input
              key={`${personId}ort`}
              value={person.ort}
              field="ort"
              label="Ort"
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}land`}
              value={person.land}
              field="land"
              label="Land"
              options={landOptions}
            />
            <Input
              key={`${personId}email`}
              value={person.email}
              field="email"
              label="Email"
            />
            <Date
              key={`${personId}geburtDatum`}
              value={person.geburtDatum}
              field="geburtDatum"
              label="Geburts&shy;datum"
            />
            <Telefones row={false} />
          </AreaPersonalien>
          <AreaAnstellung>
            <Title>Anstellung</Title>
            <Select
              key={`${personId}${existsFilter ? 1 : 0}status`}
              value={person.status}
              field="status"
              label="Status"
              options={statusOptions}
            />
            <Date
              key={`${personId}${existsFilter ? 1 : 0}eintrittDatum`}
              value={person.eintrittDatum}
              field="eintrittDatum"
              label="Eintritt"
            />
            <Date
              key={`${personId}${existsFilter ? 1 : 0}austrittDatum`}
              value={person.austrittDatum}
              field="austrittDatum"
              label="Austritt"
            />
            <Input
              key={`${personId}beschaeftigungsgrad`}
              value={person.beschaeftigungsgrad}
              field="beschaeftigungsgrad"
              label="Beschäfti&shy;gungs&shy;grad (%)"
            />
            <Input
              key={`${personId}standort`}
              value={person.standort}
              field="standort"
              label="Standort"
            />
            <Input
              key={`${personId}bueroNr`}
              value={person.bueroNr}
              field="bueroNr"
              label="Büro Nr."
            />
          </AreaAnstellung>
          <AreaFunktionen>
            <Title>Funktionen</Title>
            <Select
              key={`${personId}${existsFilter ? 1 : 0}amt`}
              value={person.amt}
              field="amt"
              label="Amt"
              options={amtOptions}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}abteilung`}
              value={person.abteilung}
              field="abteilung"
              label="Abteilung"
              options={abteilungOptions}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}sektion`}
              value={person.sektion}
              field="sektion"
              label="Sektion"
              options={sektionOptions}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}bereich`}
              value={person.bereich}
              field="bereich"
              label="Bereich"
              options={bereichOptions}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}vorgesetztId`}
              value={person.vorgesetztId}
              field="vorgesetztId"
              label="Vorge&shy;setz&shy;te(r)"
              options={personOptions}
            />
            <SelectMulti
              key={`${personId}${existsFilter ? 1 : 0}funktion`}
              value={myFunktionen}
              field="funktion"
              label="Funktio&shy;nen"
              options={funktionenOptions}
            />
          </AreaFunktionen>
          <AreaVerzeichnis>
            <Title>Verzeichnis</Title>
            <Input
              key={`${personId}parkplatzNr`}
              value={person.parkplatzNr}
              field="parkplatzNr"
              label="Parkplatz Nr."
            />
            <SelectMulti
              key={`${personId}${existsFilter ? 1 : 0}etikett`}
              value={myEtiketten}
              field="etikett"
              label="Etiketten"
              options={etikettenOptions}
            />
            <Input
              key={`${personId}bemerkungen`}
              value={person.bemerkungen}
              field="bemerkungen"
              label="Bemerkun&shy;gen"
            />
            <Links row={false} />
            <Schluessels row={false} />
            <MobileAbos row={false} />
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
