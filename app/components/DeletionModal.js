// @flow
import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import storeContext from '../storeContext'

const DeletionModal = () => {
  const store = useContext(storeContext)
  const {
    deletionCallback,
    setDeletionCallback,
    setDeletionTitle,
    setDeletionMessage
  } = store

  const remove = useCallback(() => {
    deletionCallback()
    setDeletionCallback(null)
    setDeletionTitle(null)
    setDeletionMessage(null)
  })
  const close = useCallback(() => {
    setDeletionCallback(null)
    setDeletionTitle(null)
    setDeletionMessage(null)
  })

  return (
    <Modal isOpen={!!store.deletionMessage} toggle={close}>
      <ModalHeader toggle={close}>{store.deletionTitle}</ModalHeader>
      <ModalBody>{store.deletionMessage}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={remove} outline>
          ja
        </Button>
        <Button color="secondary" onClick={close} outline>
          nein
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default observer(DeletionModal)
