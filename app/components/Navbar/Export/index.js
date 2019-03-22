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
import adressenPrepareData from './adressenPrepareData'
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
  const onClickExportAdressen = useCallback(() => {
    const exportObjects = adressenPrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
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
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem onClick={onClickExportPersonen}>
          Personen: alle Felder
        </DropdownItem>
        <DropdownItem onClick={onClickExportAdressen}>
          Personen: Adress-Felder
        </DropdownItem>
        <DropdownItem onClick={onClickExportBereiche}>Bereiche</DropdownItem>
        <DropdownItem onClick={onClickExportSektionen}>Sektionen</DropdownItem>
        <DropdownItem onClick={onClickExportAbteilungen}>
          Abteilungen
        </DropdownItem>
        <DropdownItem onClick={onClickExportAemter}>Ämter</DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem disabled onClick={onClickExportPersonen}>
          Adressen Aktive
        </DropdownItem>
        <DropdownItem disabled onClick={onClickExportPersonen}>
          Adressen Pensionierte
        </DropdownItem>
        <DropdownItem disabled onClick={onClickExportPersonen}>
          Adressen Kader
        </DropdownItem>
      </DropdownMenu>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default observer(Export)
