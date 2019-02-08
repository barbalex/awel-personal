import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { shell } from 'electron'
import { FaEllipsisV } from 'react-icons/fa'

import storeContext from '../../storeContext'
import dbContext from '../../dbContext'
import chooseDbConnection from '../../src/chooseDbConnection'

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
const Version = styled.div`
  padding: 4px 24px;
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
  font-style: italic;
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const More = () => {
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const {
    showDeleted,
    setShowDeleted,
    showMutationNoetig,
    setShowMutationNoetig,
    location,
    setLocation,
  } = store
  const activeLocation = location.toJSON()[0]

  const toggleShowDeleted = useCallback(() => setShowDeleted(!showDeleted), [
    showDeleted,
  ])
  const toggleShowMutationNoetig = useCallback(
    () => setShowMutationNoetig(!showMutationNoetig),
    [showMutationNoetig],
  )
  const showMutations = useCallback(() => setLocation(['mutations']))

  return (
    <MoreMenu nav inNavbar>
      <DropdownToggle nav>
        <FaEllipsisV />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={chooseDbConnection}>
          Datenbank wählen (TODO)
          <br />
          <DbPath>{`Aktuell: ${db.name}`}</DbPath>
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
            ? 'Gelöschte Datensätze verbergen'
            : 'Gelöschte Datensätze anzeigen'}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={toggleShowMutationNoetig}>
          {showMutationNoetig
            ? 'Datensätze mit Handlungsbedarf nicht hervorheben'
            : 'Datensätze mit Handlungsbedarf hervorheben'}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickIssues}>
          Fehler und Wünsche melden
        </DropdownItem>
        <DropdownItem divider />
        <Version>Version: 0.19.0 vom 19.01.2019</Version>
      </DropdownMenu>
    </MoreMenu>
  )
}

export default observer(More)
