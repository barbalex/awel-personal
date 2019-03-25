import React, { useContext } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'

import storeContext from '../../../storeContext'
import LogoAwel from '../../../etc/LogoAwel.jpg'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  cursor: default;
  overflow-y: auto;
  height: 100vh;
  width: 29.7cm;
  font-size: 10.5px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 1.5cm;
  @page {
    size: A4 landscape;
  }

  @media print {
    /* this is when it is actually printed */
    /*height: 21cm;*/
    height: inherit;
    /*width: inherit;*/

    margin: 0 !important;
    padding: 0.5cm !important;
    overflow-y: hidden !important;
    /* try this */
    /*page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;*/
  }
`
// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  @page .querformat {
    size: A4 landscape;
    @bottom  {
       content: Page counter(page) of counter(pages);
    }
  }
`
const Footer = styled.div`
  margin-bottom: -5px;
  position: fixed;
  bottom: 0;
  .seite:before {
    content: counter(page);
  }
  @media print {
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const LogoImg = styled.img`
  max-width: 260px;
  margin-top: -20px;
  margin-left: -10px;
`
const StyledHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const HeaderRow = styled.div`
  display: flex;
  padding: 3px;
`
const StyledName = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 47.8mm;
  max-width: 47.8mm;
`
const StyledVorname = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 47.8mm;
  max-width: 47.8mm;
`
const StyledAbteilung = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 47.8mm;
  max-width: 47.8mm;
`
const StyledSektion = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 47.8mm;
  max-width: 47.8mm;
`
const StyledBereich = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 47.8mm;
  max-width: 47.8mm;
`
const StyledFunktionen = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 47.8mm;
  max-width: 47.8mm;
`
const Row = styled.div`
  display: flex;
  padding: 3px;
  background-color: ${props =>
    props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
  page-break-inside: avoid !important;
`

function isOdd(num) {
  return num % 2
}

const PersonPrintAdresses = () => {
  const store = useContext(storeContext)
  const {
    personenFiltered,
    abteilungen,
    sektionen,
    bereiche,
    funktionen,
  } = store

  return (
    <Container className="querformat">
      <GlobalStyle />
      <LogoImg src={LogoAwel} />
      <StyledHeader>
        <HeaderRow>
          <StyledName>Name</StyledName>
          <StyledVorname>Vorname</StyledVorname>
          <StyledAbteilung>Abteilung</StyledAbteilung>
          <StyledSektion>Sektion</StyledSektion>
          <StyledBereich>Bereich</StyledBereich>
          <StyledFunktionen>Funktionen</StyledFunktionen>
        </HeaderRow>
      </StyledHeader>
      {personenFiltered.map((p, i) => (
        <Row key={p.id} shaded={!isOdd(i)}>
          <StyledName>{p.name}</StyledName>
          <StyledVorname>{p.vorname}</StyledVorname>
          <StyledAbteilung>
            {p.abteilung
              ? abteilungen.find(a => a.id === p.abteilung).name
              : ''}
          </StyledAbteilung>
          <StyledSektion>
            {p.sektion ? sektionen.find(a => a.id === p.sektion).name : ''}
          </StyledSektion>
          <StyledBereich>
            {p.bereich ? bereiche.find(a => a.id === p.bereich).name : ''}
          </StyledBereich>
          <StyledFunktionen>
            {funktionen
              .filter(f => f.idPerson === p.id)
              .filter(f => f.deleted === 0)
              .map(f => f.funktion)
              .join(', ')}
          </StyledFunktionen>
        </Row>
      ))}
      <Footer>
        {moment().format('DD.MM.YYYY')}
        <span>{` Seite `}</span>
        <span className="seite" />
      </Footer>
    </Container>
  )
}

export default PersonPrintAdresses
