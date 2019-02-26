import React, { useContext, useMemo } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'

import storeContext from '../../storeContext'
import LogoAwel from '../../etc/LogoAwel.jpg'

const labelWidth = 200

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  background-color: #eee;
  font-size: 10.5px;
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
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-areas:
    'area1'
    'area2'
    'area3'
    'area4';
  font-family: Arial, Helvetica, sans-serif;
  border: none;
`
const Area = styled.div`
  padding: 8px;
`
const Cell = styled.div`
  display: grid;
  grid-template-columns: ${labelWidth}px auto;
  > div:first-of-type {
    border-right: 1px solid #ccc;
  }
`
const Area1 = styled(Area)`
  grid-area: area1;
  display: grid;
  grid-template-areas: '1eintritt' '1austritt';
`
const Area1Eintritt = styled(Cell)`
  grid-area: 1eintritt;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area1Austritt = styled(Cell)`
  grid-area: 1austritt;
  border: 1px solid #ccc;
`
const Area2 = styled(Area)`
  grid-area: area2;
  display: grid;
  grid-template-areas: '2name' '2vorname' '2abteilung' '2sektion' '2kostenstelle';
`
const Area2Name = styled(Cell)`
  grid-area: 2name;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Vorname = styled(Cell)`
  grid-area: 2vorname;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Abteilung = styled(Cell)`
  grid-area: 2abteilung;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Sektion = styled(Cell)`
  grid-area: 2sektion;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Kostenstelle = styled(Cell)`
  grid-area: 2kostenstelle;
  border: 1px solid #ccc;
`
const Area3 = styled(Area)`
  grid-area: area3;
  display: grid;
  grid-template-areas: '3title' '3telvon' '3rufnummer' '3schluessel';
`
const Area3Title = styled.div`
  grid-area: 3title;
`
const Area3Telvon = styled.div`
  grid-area: 3telvon;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area3Rufnummer = styled.div`
  grid-area: 3rufnummer;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area3Schluessel = styled.div`
  grid-area: 3schluessel;
  border: 1px solid #ccc;
`
const Area4 = styled(Area)`
  grid-area: area4;
  display: grid;
  grid-template-areas: '4title' '4eroeffnung' '4software' '4hardware' '4abmeldung' '4bemerkungen';
`
const Area4Title = styled.div`
  grid-area: 4title;
`
const Area4Eroeffnung = styled.div`
  grid-area: 4eroeffnung;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Software = styled.div`
  grid-area: 4software;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Hardware = styled.div`
  grid-area: 4hardware;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Abmeldung = styled.div`
  grid-area: 4abmeldung;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Bemerkungen = styled.div`
  grid-area: 4bemerkungen;
  border: 1px solid #ccc;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 14px;
  font-family: Arial Black;
`
const Img = styled.img`
  max-width: 260px;
  margin-top: -50px;
  margin-left: -40px;
`

const PersonMutationPrint = ({ activeId }) => {
  const store = useContext(storeContext)
  const { personen, aemter, abteilungen, sektionen, bereiche } = store

  const person = personen.find(p => p.id === activeId) || {}

  return (
    <Container>
      <PageContainer className="hochformat">
        <GlobalStyle />
        <Img src={LogoAwel} />
        <Wrapper>
          <Area1>
            <Area1Eintritt>
              <div>Eintritt per:</div>
              <div />
            </Area1Eintritt>
            <Area1Austritt>
              <div>Austritt</div>
              <div />
            </Area1Austritt>
          </Area1>
          <Area2>
            <Area2Name>
              <div>Name</div>
              <div>{person.name}</div>
            </Area2Name>
            <Area2Vorname>
              <div>Vorname</div>
              <div>{person.vorname}</div>
            </Area2Vorname>
            <Area2Abteilung>
              <div>Abteilung</div>
              <div>{person.abteilung}</div>
            </Area2Abteilung>
            <Area2Sektion>
              <div>Sektion</div>
              <div>{person.sektion}</div>
            </Area2Sektion>
            <Area2Kostenstelle>
              <div>Kostenstelle</div>
              <div>{person.kostenstelle}</div>
            </Area2Kostenstelle>
          </Area2>
          <Area3>
            <Area3Title>
              <Title>Telefonmutation / Schlüssel / Badge</Title>
            </Area3Title>
            <Area3Telvon>Telelefon übernommen von</Area3Telvon>
            <Area3Rufnummer>Rufnummer</Area3Rufnummer>
            <Area3Schluessel>Schlüssel / Badge benötigt?</Area3Schluessel>
          </Area3>
          <Area4>
            <Area4Title>
              <Title>IT Mutation</Title>
            </Area4Title>
            <Area4Eroeffnung>Arbeitsplatzeröffnung per</Area4Eroeffnung>
            <Area4Software>benötigte Software</Area4Software>
            <Area4Hardware>standardabweichende Hardware</Area4Hardware>
            <Area4Abmeldung>Abmeldung Arbeitsplatz per</Area4Abmeldung>
            <Area4Bemerkungen>Bemerkungen</Area4Bemerkungen>
          </Area4>
        </Wrapper>
      </PageContainer>
    </Container>
  )
}

export default PersonMutationPrint
