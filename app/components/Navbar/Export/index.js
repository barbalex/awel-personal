import React, { useContext, useState, useCallback, useEffect } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  UncontrolledDropdown,
} from 'reactstrap'
import pick from 'lodash/pick'
import { observer } from 'mobx-react-lite'

import personenPrepareData from './personenPrepareData'
import personenKaderPrepareData from './personenKaderPrepareData'
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

const adressenFields = ['name', 'vorname', 'adresse', 'plz', 'ort', 'land']

const Export = () => {
  const db = useContext(dbContext)
  const store = useContext(storeContext)
  const {
    personenSorted,
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
    const exportObjects = personenFiltered
      .slice()
      .map(p => pick(p, adressenFields))
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
    })
  }, [personenFiltered])
  const onClickExportAdressenAktive = useCallback(() => {
    const exportObjects = personenSorted
      .slice()
      .filter(p => p.status === 'aktiv')
      .map(p => pick(p, adressenFields))
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
    })
  }, [personenSorted])
  const onClickExportAdressenPensionierte = useCallback(() => {
    const exportObjects = personenSorted
      .slice()
      .filter(p => p.status === 'pensioniert')
      .map(p => pick(p, adressenFields))
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
    })
  }, [personenSorted])
  const onClickExportPersonenKader = useCallback(() => {
    const exportObjects = personenKaderPrepareData({ store })
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Kader',
      sorting: {
        name: 1,
        vorname: 2,
        amt: 3,
        abteilung: 4,
        sektion: 5,
        bereich: 6,
        kaderFunktionen: 7,
        funktionen: 8,
      },
    })
  }, [personenSorted])

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
        <DropdownItem onClick={onClickExportAdressenAktive}>
          Adressen Aktive
        </DropdownItem>
        <DropdownItem onClick={onClickExportAdressenPensionierte}>
          Adressen Pensionierte
        </DropdownItem>
        <DropdownItem onClick={onClickExportPersonenKader}>Kader</DropdownItem>
      </DropdownMenu>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default observer(Export)
