import React from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  UncontrolledDropdown
} from 'reactstrap'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { inject, observer } from 'mobx-react'

import personenPrepareData from './personenPrepareData'
import personenExport from './personenExport'

const enhance = compose(
  inject('store'),
  withState('modalOpen', 'setModalOpen', false),
  withState('modalMessage', 'setModalMessage', ''),
  withHandlers({
    onClickExportPersonen: ({ store, setModalOpen, setModalMessage }) => () => {
      const personenReadable = personenPrepareData({ store })
      personenExport({ personenReadable, setModalOpen, setModalMessage })
    },
    toggleModal: ({ modalOpen, setModalOpen }) => () => setModalOpen(!modalOpen)
  }),
  observer
)

const Export = ({
  onClickExportPersonen,
  modalOpen,
  toggleModal,
  modalMessage
}: {
  onClickExportPersonen: () => void,
  modalOpen: boolean,
  toggleModal: () => void,
  modalMessage?: string
}) => (
  <UncontrolledDropdown nav inNavbar>
    <DropdownToggle nav caret>
      Exporte
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem onClick={onClickExportPersonen}>
        Gefilterte Personen mit allen Feldern (TODO)
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem>mehr?</DropdownItem>
    </DropdownMenu>
    <Modal isOpen={modalOpen} toggle={toggleModal}>
      <ModalBody>{modalMessage}</ModalBody>
    </Modal>
  </UncontrolledDropdown>
)

export default enhance(Export)
