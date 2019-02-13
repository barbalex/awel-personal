import React, { useContext, useState, useCallback, useEffect } from 'react'
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
import fetchAemter from '../../../src/fetchAemter'
import fetchAbteilungen from '../../../src/fetchAbteilungen'
import fetchBereiche from '../../../src/fetchBereiche'
import fetchSektionen from '../../../src/fetchSektionen'
import dbContext from '../../../dbContext'

const Export = () => {
  const db = useContext(dbContext)
  const store = useContext(storeContext)
  const { personenFiltered } = store

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    fetchAemter({ db, store })
    fetchAbteilungen({ db, store })
    fetchBereiche({ db, store })
    fetchSektionen({ db, store })
  }, [])

  const onClickExportPersonen = useCallback(() => {
    const personenReadable = personenPrepareData({ store })
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
          Personen (gefiltert)
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
