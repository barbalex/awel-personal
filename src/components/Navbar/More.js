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
import { FaTrashAlt } from 'react-icons/fa'
import { FaRegEdit } from 'react-icons/fa'

import storeContext from '../../storeContext'
import chooseDbConnection from '../../src/chooseDbConnection'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
`
const MoreMenu = styled(UncontrolledDropdown)`
  > a {
    padding-left: 18px !important;
  }
`
const Version = styled.div`
  padding: 4px 24px;
  color: grey;
  user-select: none;
  font-style: italic;
`
const StyledDropdownItem = styled(DropdownItem)`
  display: flex !important;
  justify-content: space-between;
`
const Svg = styled.div`
  svg {
    margin-left: 9px;
    font-size: large;
  }
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const More = () => {
  const store = useContext(storeContext)
  const {
    showDeleted,
    setShowDeleted,
    showMutationNoetig,
    setShowMutationNoetig,
    location,
    setLocation,
    db,
  } = store
  const activeLocation = location.toJSON()[0]

  const toggleShowDeleted = useCallback(() => setShowDeleted(!showDeleted), [
    setShowDeleted,
    showDeleted,
  ])
  const toggleShowMutationNoetig = useCallback(
    () => setShowMutationNoetig(!showMutationNoetig),
    [setShowMutationNoetig, showMutationNoetig],
  )
  const showMutations = useCallback(() => setLocation(['mutations']), [
    setLocation,
  ])

  return (
    <MoreMenu nav inNavbar>
      <DropdownToggle nav caret>
        Mehr
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={chooseDbConnection}>
          Datenbank wählen
          <br />
          <DbPath>{`Aktuell: ${db.name}`}</DbPath>
        </DropdownItem>
        {!activeLocation !== 'mutations' && (
          <div>
            <DropdownItem divider />
            <DropdownItem onClick={showMutations}>
              Daten-Änderungen anzeigen
            </DropdownItem>
          </div>
        )}
        <DropdownItem divider />
        <StyledDropdownItem onClick={toggleShowDeleted}>
          <div>
            {showDeleted
              ? 'Gelöschte Datensätze verbergen'
              : 'Gelöschte Datensätze anzeigen'}
          </div>
          <Svg>
            <FaTrashAlt />
          </Svg>
        </StyledDropdownItem>
        <DropdownItem divider />
        <StyledDropdownItem onClick={toggleShowMutationNoetig}>
          <div>
            {showMutationNoetig
              ? 'Datensätze mit Handlungsbedarf nicht hervorheben'
              : 'Datensätze mit Handlungsbedarf hervorheben'}
          </div>
          <Svg>
            <FaRegEdit />
          </Svg>
        </StyledDropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickIssues}>
          Fehler und Wünsche melden
        </DropdownItem>
        <DropdownItem divider />
        <Version>Version: 1.2.12 vom 30.01.2020</Version>
      </DropdownMenu>
    </MoreMenu>
  )
}

export default observer(More)
