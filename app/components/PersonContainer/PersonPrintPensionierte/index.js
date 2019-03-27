import React, { useContext } from 'react'
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

const PersonPrintPensioniertePages = () => {
  const store = useContext(storeContext)
  const { personPages } = store
  const { modal, reset, building } = personPages

  return (
    <Container>
      {personPages.pages.map((page, pageIndex) => (
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

export default observer(PersonPrintPensioniertePages)
