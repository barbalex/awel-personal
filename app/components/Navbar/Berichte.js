import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { remote, shell } from 'electron'
import fs from 'fs'

import storeContext from '../../storeContext'

const { dialog } = remote

const StyledUncontrolledDropdown = styled(UncontrolledDropdown)`
  display: flex;
  border: ${props =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const dialogOptions = {
  title: 'pdf speichern',
  filters: [
    {
      name: 'pdf',
      extensions: ['pdf'],
    },
  ],
}

const Berichte = () => {
  const store = useContext(storeContext)
  const {
    setPrinting,
    activePrintForm,
    setActivePrintForm,
    setFilter,
    emptyFilter,
    setLocation,
    setFilterPersonKader,
    setFilterPersonAktivJetztMitTel,
    setFilterPersonAktivJetztMitMobiltel,
    setFilterPersonAktivJetztMitKurzzeichen,
  } = store
  const location = store.location.toJSON()
  const showPD = location[0] === 'Personen' && location[1]

  const onClickPD = useCallback(() => {
    setActivePrintForm('personalblatt')
  }, [location])
  const onClickPrint = useCallback(() => {
    setPrinting(true)
    setTimeout(() => {
      window.print()
      // turned off because printBackground = true did not work
      /*const win = remote.getCurrentWindow()
      win.webContents.print({
        silent: false,
        // true did not work!!!???
        printBackground: false,
        deviceName: '',
      })*/
      setTimeout(() => setPrinting(false))
    })
  })
  const onClickCreatePdf = useCallback(() => {
    const landscape = !['personalblatt'].includes(activePrintForm)
    const printToPDFOptions = {
      marginsType: 0,
      pageSize: 'A4',
      landscape,
      printBackground: true,
    }
    const win = remote.getCurrentWindow()
    // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsprinttopdfoptions-callback

    setPrinting(true)
    setTimeout(() => {
      win.webContents.printToPDF(printToPDFOptions, (error, data) => {
        if (error) throw error
        dialog.showSaveDialog(dialogOptions, filePath => {
          if (filePath) {
            fs.writeFile(filePath, data, err => {
              if (err) throw err
              shell.openItem(filePath)
            })
          }
        })
      })
      setTimeout(() => setPrinting(false))
    })
  })

  return (
    <StyledUncontrolledDropdown nav inNavbar active={!!activePrintForm}>
      <DropdownToggle nav caret>
        Berichte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            setActivePrintForm('personFunktionen')
            store.personPages.initiate()
          }}
        >
          Personen: Funktionen
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            emptyFilter()
            setFilterPersonKader(true)
            setTimeout(() => {
              setActivePrintForm('personKader')
              store.personPages.initiate()
            }, 1000)
          }}
        >
          Personen: Kader
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            emptyFilter()
            setFilter({
              model: 'filterPerson',
              value: { status: 'pensioniert' },
            })
            setTimeout(() => {
              setActivePrintForm('personPensionierte')
              store.personPages.initiate()
            }, 1000)
          }}
        >
          Personen: Pensionierte
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            emptyFilter()
            setFilterPersonAktivJetztMitKurzzeichen(true)
            setTimeout(() => {
              setActivePrintForm('personVerzKurzzeichen')
              store.personVerzeichnis.initiate('personVerzKurzzeichen')
            }, 1000)
          }}
        >
          Personen: Kurzzeichen
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            emptyFilter()
            setFilterPersonAktivJetztMitTel(true)
            setTimeout(() => {
              setActivePrintForm('personVerzTel')
              store.personVerzeichnis.initiate()
            }, 1000)
          }}
        >
          Personen: Telefone
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            emptyFilter()
            setFilterPersonAktivJetztMitMobiltel(true)
            setTimeout(() => {
              setActivePrintForm('personVerzMobiltel')
              store.personVerzeichnis.initiate()
            }, 1000)
          }}
        >
          Personen: Mobil-Telefone
        </DropdownItem>
        {showPD && (
          <>
            <DropdownItem divider />
            <DropdownItem header>Für den aktiven Datensatz</DropdownItem>
            <DropdownItem onClick={onClickPD}>Personal-Blatt</DropdownItem>
          </>
        )}
      </DropdownMenu>
      {!!activePrintForm && (
        <>
          <StyledButton title="drucken" onClick={onClickPrint}>
            <FaPrint />
          </StyledButton>
          <StyledButton title="PDF erzeugen" onClick={onClickCreatePdf}>
            <FaRegFilePdf />
          </StyledButton>
        </>
      )}
    </StyledUncontrolledDropdown>
  )
}

export default observer(Berichte)
