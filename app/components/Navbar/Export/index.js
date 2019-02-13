import React, { useContext, useState, useCallback } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  UncontrolledDropdown,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'

import personenPrepareData from './personenPrepareData'
import personenExport from './personenExport'
import storeContext from '../../../storeContext'

const Export = () => {
  const store = useContext(storeContext)
  const { personenFiltered } = store

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const onClickExportPersonen = useCallback(() => {
    const personenReadable = personenPrepareData({ store })
    console.log({ personenReadable })
    personenExport({ personenReadable, setModalOpen, setModalMessage })
  }, [personenFiltered])
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

export default observer(Export)
