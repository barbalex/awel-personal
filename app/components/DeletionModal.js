// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const enhance = compose(
  inject('store'),
  withHandlers({
    remove: ({ store }) => () => {
      store.deletionCallback()
      store.setDeletionCallback(null)
      store.setDeletionTitle(null)
      store.setDeletionMessage(null)
    },
    close: ({ store }) => () => {
      store.setDeletionCallback(null)
      store.setDeletionTitle(null)
      store.setDeletionMessage(null)
    }
  }),
  observer
)

const DeletionModal = ({
  store,
  remove,
  close
}: {
  store: Object,
  remove: () => void,
  close: () => void
}) => (
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

export default enhance(DeletionModal)
