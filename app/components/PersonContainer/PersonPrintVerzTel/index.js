import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

import storeContext from '../../../storeContext'
import Page from './Page'

const Container = styled.div`
  background-color: #eee;
  font-size: 9pt;
  cursor: default;
  /*
  * need defined height and overflow
  * to make the pages scrollable in UI
  * is removed in print
  */
  overflow-y: auto;
  height: 100vh;

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible !important;
    /* make sure body grows as needed */
    height: auto !important;

    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`

const PersonPrintVerzTelPages = () => {
  const store = useContext(storeContext)
  const { personVerzeichnis, activePrintForm } = store
  const { initiate, pages, modal, reset, building } = personVerzeichnis

  useEffect(() => {
    // only initiate if pages exist
    // otherwise re-initiates on printing
    if (!(pages.length && activePrintForm === 'personVerzTel')) initiate()
  }, [])

  return (
    <Container>
      {personVerzeichnis.pages.map((page, pageIndex) => (
        <Page key={pageIndex} pageIndex={pageIndex} />
      ))}
      <Modal isOpen={building}>
        <ModalBody>
          <p>{modal.textLine1}</p>
          <p>{modal.textLine2}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => reset()} outline>
            abbrechen
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default observer(PersonPrintVerzTelPages)
