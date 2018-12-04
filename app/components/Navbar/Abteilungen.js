import React, { useContext, useCallback } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'

import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

const Sup = styled.sup`
  padding-left: 3px;
`
const StyledNavItem = styled(NavItem)`
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

const Abteilung = () => {
  const store = useContext(storeContext)
  const {
    showDeleted,
    abteilungenFiltered,
    abteilungen,
    setLocation,
    addAbteilung,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
  } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const activeId = ifIsNumericAsNumber(location[1])

  const showTab = useCallback(
    e => {
      e.preventDefault()
      setLocation([e.target.id])
    },
    [location],
  )
  // const addAbteilung = useCallback(() => addAbteilung())
  const deleteAbteilung = useCallback(
    () => {
      const activeAbteilung = abteilungen.find(p => p.id === activeId)
      if (activeAbteilung.deleted === 1) {
        // abteilung.deleted is already = 1
        // prepare true deletion
        setDeletionCallback(() => {
          store.deleteAbteilung(activeId)
          setDeletionMessage(null)
          setDeletionTitle(null)
        })
        const name = activeAbteilung.name
          ? `"${activeAbteilung.name}"`
          : 'Dieser Datensatz'
        const namer1 = activeAbteilung.name ? 'sie' : 'ihn'
        const namer2 = activeAbteilung.name ? 'sie' : 'er'
        setDeletionMessage(
          `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
        )
        setDeletionTitle('Abteilung unwiederbringlich löschen')
      } else {
        // do not true delete yet
        // only set abteilung.deleted = 1
        setDeletionCallback(() => {
          store.setAbteilungDeleted(activeId)
          setDeletionMessage(null)
          setDeletionTitle(null)
        })
        setDeletionMessage(
          `${
            activeAbteilung.name
              ? `"${activeAbteilung.name}"`
              : 'Diesen Datensatz'
          } wirklich löschen?`,
        )
        setDeletionTitle('Abteilung löschen')
      }
    },
    [abteilungen.length, location],
  )

  const existsActiveAbteilung = activeLocation === 'Abteilungen' && location[1]
  const mayAddNewAbteilung =
    abteilungenFiltered.filter(p => !p.name && !p.vorname).length === 0
  const abteilungenSum = showDeleted
    ? abteilungen.length
    : abteilungen.filter(p => p.deleted === 0).length
  const abteilungenSumSup =
    abteilungenFiltered.length !== abteilungenSum
      ? `${abteilungenFiltered.length}/${abteilungenSum}`
      : abteilungenFiltered.length

  return (
    <StyledNavItem active={activeLocation === 'Abteilungen'}>
      <NavLink href="/" id="Abteilungen" onClick={showTab}>
        Abteilungen
        {activeLocation === 'Abteilungen' && <Sup>{abteilungenSumSup}</Sup>}
      </NavLink>
      {activeLocation !== 'Abteilungen' && (
        <UncontrolledTooltip placement="bottom" target="Abteilungen">
          Abteilungen anzeigen
        </UncontrolledTooltip>
      )}
      {activeLocation === 'Abteilungen' && (
        <>
          <StyledButton
            id="newAbteilungButton"
            onClick={addAbteilung}
            disabled={!mayAddNewAbteilung}
          >
            <FaPlus />
          </StyledButton>
          {mayAddNewAbteilung && (
            <UncontrolledTooltip placement="bottom" target="newAbteilungButton">
              neue Abteilung erfassen
            </UncontrolledTooltip>
          )}
          <StyledButton
            id="deleteAbteilungButton"
            onClick={deleteAbteilung}
            disabled={!existsActiveAbteilung}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveAbteilung && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteAbteilungButton"
            >
              markierte Abteilung löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Abteilung)
