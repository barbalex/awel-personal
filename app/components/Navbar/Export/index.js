import React, { useContext, useState, useCallback } from 'react'
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
import { observer } from 'mobx-react'

import personenPrepareData from './personenPrepareData'
import personenExport from './personenExport'
import storeContext from '../../../storeContext'

const enhance = compose(observer)

const Export = () => {
  const store = useContext(storeContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const onClickExportPersonen = useCallback(
    () => {
      const personenReadable = personenPrepareData({ store })
      personenExport({ personenReadable, setModalOpen, setModalMessage })
    },
    [store.personenFiltered]
  )
  const toggleModal = useCallback(() => setModalOpen(!modalOpen), [modalOpen])

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Exporte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={onClickExportPersonen}>
          Gefilterte Personen mit allen Feldern
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem>mehr?</DropdownItem>
      </DropdownMenu>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default enhance(Export)
