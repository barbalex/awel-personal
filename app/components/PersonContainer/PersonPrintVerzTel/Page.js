import React, { useContext } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import Column from './Column'

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
  grid-template-rows: 5mm 16.75cm 5mm;
  grid-template-areas:
    'title title title'
    'column0 column1 column2'
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
  font-size: 1.2em;
  justify-self: center;
`
const Column0 = styled.div`
  grid-area: column0;
`
const Column1 = styled.div`
  grid-area: column1;
`
const Column2 = styled.div`
  grid-area: column2;
`
const Footer = styled.div`
  grid-area: footer;
  display: flex;
  justify-content: space-between;
`
// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  @page {
    size: A4 landscape;
  }
`

const PersonPrintVerzTelPage = ({ pageIndex }) => {
  const store = useContext(storeContext)
  const { personVerzeichnis } = store
  const { pages, building } = personVerzeichnis

  return (
    <Container className="querformat">
      <GlobalStyle />
      <InnerPageContainer building={building}>
        <Title>AWEL Telefon-Verzeichnis</Title>
        <Column0>
          <Column pageIndex={pageIndex} columnIndex={0} />
        </Column0>
        <Column1>
          <Column pageIndex={pageIndex} columnIndex={1} />
        </Column1>
        <Column2>
          <Column pageIndex={pageIndex} columnIndex={2} />
        </Column2>
        <Footer>
          <div>{`Stand: ${moment().format('DD.MM.YYYY')}`}</div>
          <div>
            Seite {pageIndex + 1}/{pages.length}
          </div>
        </Footer>
      </InnerPageContainer>
    </Container>
  )
}

export default observer(PersonPrintVerzTelPage)
