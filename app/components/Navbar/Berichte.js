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

const printToPDFOptions = {
  marginsType: 0,
  pageSize: 'A4',
  landscape: false,
  printBackground: false,
}
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
  const { setLocation, setPrinting } = store
  const location = store.location.toJSON()
  const showPD = location[0] === 'Personen' && location[1]
  const onClickPD = useCallback(() => {
    setLocation([...location, 'pdf'])
  }, [location])
  const onClickPrint = useCallback(() => {
    setPrinting(true)
    setTimeout(() => {
      window.print()
      setTimeout(() => setPrinting(false))
    })
  })
  const onClickCreatePdf = useCallback(() => {
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
    <StyledUncontrolledDropdown nav inNavbar active={location.includes('pdf')}>
      <DropdownToggle nav caret>
        Berichte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Personen (mit allen Feldern)
        </DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Personen (mit reduzierten Feldern)
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Kurzzeichenverzeichnis
        </DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Telefone
        </DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Mobil-Telefone
        </DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Kader
        </DropdownItem>
        <DropdownItem disabled onClick={() => console.log('TODO')}>
          Pensionierte
        </DropdownItem>
        {showPD && (
          <>
            <DropdownItem divider />
            <DropdownItem header>Für den aktiven Datensatz</DropdownItem>
            <DropdownItem onClick={onClickPD}>Personal-Blatt</DropdownItem>
          </>
        )}
      </DropdownMenu>
      {location.includes('pdf') && (
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
