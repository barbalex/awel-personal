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
import styled from 'styled-components'

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

const Hint = styled.div`
  padding: 4px 24px;
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
  font-style: italic;
  font-size: small;
  width: 200px;
  padding-top: 0;
`

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
        <Hint>Exporte übernehmen Filter</Hint>
        <DropdownItem onClick={onClickExportPersonen}>Personen</DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportBereiche}>Bereiche</DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportSektionen}>Sektionen</DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportAbteilungen}>
          Abteilungen
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickExportAemter}>Ämter</DropdownItem>
      </DropdownMenu>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default observer(Export)
