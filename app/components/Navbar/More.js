import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import styled from 'styled-components'
import app from 'ampersand-app'
import { observer } from 'mobx-react-lite'
import { shell } from 'electron'
import { FaEllipsisV } from 'react-icons/fa'

import storeContext from '../../storeContext'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
`
const MoreMenu = styled(UncontrolledDropdown)`
  width: 40px;
  > a {
    padding-left: 18px !important;
  }
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const More = () => {
  const store = useContext(storeContext)
  const { showDeleted, setShowDeleted, location, setLocation } = store
  const activeLocation = location.toJSON()[0]

  const toggleShowDeleted = useCallback(() => setShowDeleted(!showDeleted), [
    showDeleted
  ])
  const showMutations = useCallback(() => setLocation(['mutations']))

  return (
    <MoreMenu nav inNavbar>
      <DropdownToggle nav>
        <FaEllipsisV />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>
          Datenbank wählen (TODO)
          <br />
          <DbPath>{`Aktuell: ${app.db.name}`}</DbPath>
        </DropdownItem>
        {!activeLocation !== 'mutations' && (
          <>
            <DropdownItem divider />
            <DropdownItem onClick={showMutations}>
              Daten-Änderungen anzeigen
            </DropdownItem>
          </>
        )}
        <DropdownItem divider />
        <DropdownItem onClick={toggleShowDeleted}>
          {showDeleted
            ? 'gelöschte Datensätze verbergen'
            : 'gelöschte Datensätze anzeigen'}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickIssues}>
          Fehler und Wünsche melden
        </DropdownItem>
      </DropdownMenu>
    </MoreMenu>
  )
}

export default observer(More)
