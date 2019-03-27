import React, { useContext, useRef, useEffect } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  /* Divide single pages with some space and center all pages horizontally */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;

  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  /* set page size and padding for screen */
  width: 29.7cm;
  height: 20.95cm;
  padding: 1.5cm;

  overflow: hidden;
  overflow-y: visible;

  font-size: 10.5px;
  font-family: Arial, Helvetica, sans-serif;

  /* When the document is actually printed */
  @media print {
    /**
   * something seems to change the measurements
   * if they are not repeated here using important
   * seems like export to pdf is moved right down
   * without this
   */
    width: inherit;
    height: inherit;

    /* gingerly set margins and padding */
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 0.5cm !important;
    padding-left: 0.5cm !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;

    overflow: hidden !important;

    page-break-inside: avoid !important;
    page-break-before: always !important;
    page-break-after: always !important;
  }
`
/**
 * width of PageContainer is set in print by @page
 * somehow this makes positioning of its children not react as usual
 * flex and relative/absolute positioning behave as if the page were not full size
 * but would grow with the containerEl
 * Solution:
 * set a InnerPageContainer inside PageContainer
 * and give it full page size
 */
const InnerPageContainer = styled.div`
  display: grid;
  grid-template-rows: 20mm auto 4mm;
  grid-template-areas:
    'title title title'
    'column1 column2 column3'
    'footer footer footer';
  max-height: 17.95cm;
  max-width: 26.7cm;
  /*
   * need overflow while building list
   * so list does not flow outside padding
   */
  overflow-y: ${props => (props.building ? 'auto' : 'hidden')};
  overflow-x: hidden;
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
`
const Column1 = styled.div`
  grid-area: column1;
`
const Column2 = styled.div`
  grid-area: column2;
`
const Column3 = styled.div`
  grid-area: column3;
`
const Footer = styled.div`
  grid-area: footer;
`
// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  @page {
    size: A4 landscape;
  }
`
const Field = styled.div`
  flex: 1;
  padding: 2px;
`
const StyledName = styled(Field)``
const StyledVorname = styled(Field)``
const StyledAbteilung = styled(Field)``
const StyledSektion = styled(Field)``
const StyledBereich = styled(Field)``
const StyledFunktionen = styled(Field)``
const StyledKaderfunktionen = styled(Field)``
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  padding: 3px;
  background-color: ${props =>
    props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
  page-break-inside: avoid !important;
`

function isOdd(num) {
  return num % 2
}

const PersonPrintVerzTelPage = ({ pageIndex }) => {
  const store = useContext(storeContext)
  const {
    abteilungen,
    sektionen,
    bereiche,
    funktionen,
    kaderFunktionen,
    personenFiltered,
    personVerzeichnis,
  } = store
  const {
    pages,
    building,
    activePageIndex,
    remainingRows,
    moveRowToNewPage,
    addRow,
    stop,
  } = personVerzeichnis
  const containerEl = useRef(null)

  const page = pages[pageIndex]
  const { column0, column1, column2 } = page

  const next = () => {
    /**
     * - measure height of pageSize-component
     * - if > desired page height:
     *  - move last row to next page
     *  - render
     * - else:
     *  - insert next row
     *  - render
     */
    // don't do anything on not active pages
    if (pageIndex === activePageIndex) {
      const offsetHeight = containerEl ? containerEl.current.offsetHeight : null
      const scrollHeight = containerEl ? containerEl.current.scrollHeight : null
      const activePageIsFull = page.full

      if (!activePageIsFull && remainingRows.length > 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewPage(activePageIndex)
          //this.showPagesModal()
        } else {
          addRow(page)
        }
      }
      if (remainingRows.length === 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewPage(activePageIndex)
          //this.showPagesModal()
        } else {
          // for unknown reason setTimeout is needed
          setTimeout(() => {
            stop()
          })
        }
      }
    }
  }

  useEffect(() => {
    next()
  })

  if (!rows) return null

  const personen = personenFiltered.filter(p => rows.includes(p.id))

  return (
    <Container className="querformat">
      <GlobalStyle />
      <InnerPageContainer building={building} ref={containerEl}>
        <Title>AWEL Telefon-Verzeichnis</Title>
        <Column1>
          {personen.map((p, i) => (
            <Row key={p.id} shaded={!isOdd(i)}>
              <StyledName>{p.name || ''}</StyledName>
              <StyledVorname>{p.vorname || ''}</StyledVorname>
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
              <StyledKaderfunktionen>
                {kaderFunktionen
                  .filter(f => f.idPerson === p.id)
                  .filter(f => f.deleted === 0)
                  .map(f => f.funktion)
                  .join(', ')}
              </StyledKaderfunktionen>
            </Row>
          ))}
        </Column1>
        <Footer>
          <div>{moment().format('DD.MM.YYYY')}</div>
          <div>
            Seite {pageIndex + 1}/{pages.length}
          </div>
        </Footer>
      </InnerPageContainer>
    </Container>
  )
}

export default observer(PersonPrintVerzTelPage)
