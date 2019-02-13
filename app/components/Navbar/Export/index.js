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
import bereichePrepareData from './bereichePrepareData'
import sektionenPrepareData from './sektionenPrepareData'
import abteilungenPrepareData from './abteilungenPrepareData'
import aemterPrepareData from './aemterPrepareData'
import doExport from './doExport'
import storeContext from '../../../storeContext'
import fetchAemter from '../../../src/fetchAemter'
import fetchAbteilungen from '../../../src/fetchAbteilungen'
import fetchBereiche from '../../../src/fetchBereiche'
import fetchSektionen from '../../../src/fetchSektionen'
import dbContext from '../../../dbContext'

const Export = () => {
  const db = useContext(dbContext)
  const store = useContext(storeContext)
  const {
    personenFiltered,
    bereicheFiltered,
    sektionenFiltered,
    abteilungenFiltered,
    aemterFiltered,
  } = store

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    fetchAemter({ db, store })
    fetchAbteilungen({ db, store })
    fetchBereiche({ db, store })
    fetchSektionen({ db, store })
  }, [])

  const onClickExportPersonen = useCallback(() => {
    const exportObjects = personenPrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Personen',
    })
  }, [personenFiltered])
  const onClickExportBereiche = useCallback(() => {
    const exportObjects = bereichePrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Bereiche',
    })
  }, [bereicheFiltered])
  const onClickExportSektionen = useCallback(() => {
    const exportObjects = sektionenPrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Sektionen',
    })
  }, [sektionenFiltered])
  const onClickExportAbteilungen = useCallback(() => {
    const exportObjects = abteilungenPrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Abteilungen',
    })
  }, [abteilungenFiltered])
  const onClickExportAemter = useCallback(() => {
    const exportObjects = aemterPrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Aemter',
    })
  }, [aemterFiltered])
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
        <DropdownItem onClick={onClickExportBereiche}>
          Bereiche (gefiltert)
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportSektionen}>
          Sektionen (gefiltert)
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportAbteilungen}>
          Abteilungen (gefiltert)
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportAemter}>
          Ämter (gefiltert)
        </DropdownItem>
      </DropdownMenu>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default observer(Export)
