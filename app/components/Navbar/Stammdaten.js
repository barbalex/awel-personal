import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  UncontrolledTooltip,
} from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'

import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

const Sup = styled.sup`
  padding-left: 3px;
`
const StamdatenContainer = styled.div`
  display: flex;
  border: ${props =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Stammdaten = () => {
  const store = useContext(storeContext)
  const { setDeletionMessage, setDeletionTitle, setDeletionCallback } = store
  const location = store.location.toJSON()
  const activeTable = location[0]
  const activeId = ifIsNumericAsNumber(location[1])
  let stammdatenCount = 0
  if (activeTable.includes('Werte')) {
    stammdatenCount = store[activeTable].length
  }
  let mayAddNewWert
  if (activeTable && store[activeTable]) {
    mayAddNewWert =
      store[activeTable].filter(p => p.deleted === 0 && !p.value).length === 0
  }
  const existsActiveWert = activeTable.includes('Werte') && location[1]

  const addWert = useCallback(() => {
    store.addWert(activeTable)
  }, [activeTable])
  const deleteWert = useCallback(() => {
    const activeWert = store[activeTable].find(p => p.id === activeId)
    if (activeWert.deleted === 1) {
      // deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        store.deleteWert({ id: activeId, table: activeTable })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activeWert.value
        ? `"${activeWert.value}"`
        : 'Dieser Datensatz'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ihn nochmals löschen, ist das endgültig und unwiederbringlich. Möchten Sie das?`,
      )
      setDeletionTitle(`${activeTable} unwiederbringlich löschen`)
    } else {
      // do not true delete yet
      // only set deleted = 1
      setDeletionCallback(() => {
        store.setWertDeleted({ id: activeId, table: activeTable })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      setDeletionMessage(
        `${
          activeWert.value ? `"${activeWert.value}"` : 'Diesen Datensatz'
        } wirklich löschen?`,
      )
      setDeletionTitle(`${activeTable} löschen`)
    }
  }, [activeTable, activeId])
  const onClickStatusTable = useCallback(e => {
    store.setLocation([e.target.name])
  })

  return (
    <StamdatenContainer active={activeTable.includes('Werte')}>
      <UncontrolledDropdown nav inNavbar active={activeTable.includes('Werte')}>
        <DropdownToggle nav caret>
          {activeTable.includes('Werte') ? (
            <span>
              {activeTable}
              <Sup>{stammdatenCount}</Sup>
            </span>
          ) : (
            'Stammdaten'
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem name="anredeWerte" onClick={onClickStatusTable}>
            Anrede
          </DropdownItem>
          <DropdownItem name="etikettWerte" onClick={onClickStatusTable}>
            Etikett
          </DropdownItem>
          <DropdownItem name="funktionWerte" onClick={onClickStatusTable}>
            Funktion
          </DropdownItem>
          <DropdownItem name="kostenstelleWerte" onClick={onClickStatusTable}>
            Kostenstelle
          </DropdownItem>
          <DropdownItem name="landWerte" onClick={onClickStatusTable}>
            Land
          </DropdownItem>
          <DropdownItem
            name="mobileAboKostenstelleWerte"
            onClick={onClickStatusTable}
          >
            Mobile Abo Kostenstelle
          </DropdownItem>
          <DropdownItem name="mobileAboTypWerte" onClick={onClickStatusTable}>
            Mobile Abo Typ
          </DropdownItem>
          <DropdownItem
            name="schluesselAnlageWerte"
            onClick={onClickStatusTable}
          >
            Schlüssel Anlage
          </DropdownItem>
          <DropdownItem name="schluesselTypWerte" onClick={onClickStatusTable}>
            Schlüssel Typ
          </DropdownItem>
          <DropdownItem name="standortWerte" onClick={onClickStatusTable}>
            Standort
          </DropdownItem>
          <DropdownItem name="statusWerte" onClick={onClickStatusTable}>
            Status
          </DropdownItem>
          <DropdownItem name="telefonTypWerte" onClick={onClickStatusTable}>
            Telefon Typ
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      {activeTable.includes('Werte') && (
        <>
          <StyledButton
            id="newStammdatenButton"
            onClick={addWert}
            disabled={!mayAddNewWert}
          >
            <FaPlus />
          </StyledButton>
          {mayAddNewWert && (
            <UncontrolledTooltip
              placement="bottom"
              target="newStammdatenButton"
            >
              neuen Wert erfassen
            </UncontrolledTooltip>
          )}
          <StyledButton
            id="deleteStammdatenButton"
            onClick={deleteWert}
            disabled={!existsActiveWert}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveWert && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteStammdatenButton"
            >
              markierten Wert löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StamdatenContainer>
  )
}

export default observer(Stammdaten)
