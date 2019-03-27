import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div``
const Field = styled.div`
  flex: 1;
  padding: 2px;
`
const StyledName = styled(Field)``
const StyledVorname = styled(Field)``
const StyledKurzzeichen = styled(Field)``
const StyledBereich = styled(Field)``
const StyledTelefon = styled(Field)``
const StyledBueroNr = styled(Field)``
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  padding: 3px;
  page-break-inside: avoid !important;
`

const PersonPrintVerzTelPage = ({ pageIndex, containerEl, columnIndex }) => {
  const store = useContext(storeContext)
  const {
    aemter,
    abteilungen,
    sektionen,
    bereiche,
    telefones,
    personVerzeichnis,
  } = store
  const {
    pages,
    activePageIndex,
    remainingRows,
    stop,
    addRow,
  } = personVerzeichnis

  const page = pages[pageIndex]
  const { full: pageIsFull, moveRowToNewColumn } = page
  const column = page[`column${columnIndex}`]
  const { rows } = column
  console.log('Column', {
    pageIndex,
    columnIndex,
    containerEl,
    page,
    column,
    rows,
  })

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

      console.log('Column, next', {
        offsetHeight,
        scrollHeight,
        pageIsFull,
        remainingRowsLength: remainingRows.length,
      })

      if (!pageIsFull && remainingRows.length > 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewColumn()
        } else {
          addRow()
        }
      }
      if (remainingRows.length === 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewColumn()
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

  return (
    <Container>
      {rows.map((r, i) => (
        <Row key={r.id}>
          <StyledName>{r.name || ''}</StyledName>
          <StyledVorname>{r.vorname || ''}</StyledVorname>
          <StyledKurzzeichen>{r.kurzzeichen || ''}</StyledKurzzeichen>
          <StyledTelefon>
            {
              telefones
                .filter(f => f.idPerson === r.id)
                .filter(f => f.deleted === 0)
                .map(f => f.nr)[0]
            }
          </StyledTelefon>
          <StyledBueroNr>{r.bueroNr || ''}</StyledBueroNr>
          <StyledBereich>
            {r.bereich
              ? bereiche.find(a => a.id === r.bereich).kurzzeichen
              : r.sektion
              ? sektionen.find(a => a.id === r.sektion).kurzzeichen
              : r.abteilungen
              ? abteilungen.find(a => a.id === r.abteilung).kurzzeichen
              : r.aemter
              ? aemter.find(a => a.id === r.amt).kurzzeichen
              : ''}
          </StyledBereich>
        </Row>
      ))}
    </Container>
  )
}

export default observer(PersonPrintVerzTelPage)
