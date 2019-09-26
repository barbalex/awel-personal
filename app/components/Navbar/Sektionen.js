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

const Sektion = () => {
  const store = useContext(storeContext)
  const {
    showDeleted,
    sektionenFiltered,
    sektionen,
    setLocation,
    addSektion,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
    activePrintForm,
  } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const activeId = ifIsNumericAsNumber(location[1])

  const showTab = useCallback(
    e => {
      e.preventDefault()
      setLocation([e.target.id])
    },
    [setLocation],
  )
  // const addSektion = useCallback(() => addSektion())
  const deleteSektion = useCallback(() => {
    const activeSektion = sektionen.find(p => p.id === activeId)
    if (activeSektion.deleted === 1) {
      // sektion.deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        store.deleteSektion(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activeSektion.name
        ? `"${activeSektion.name}"`
        : 'Dieser Datensatz'
      const namer1 = activeSektion.name ? 'sie' : 'ihn'
      const namer2 = activeSektion.name ? 'sie' : 'er'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
      )
      setDeletionTitle('Sektion unwiederbringlich löschen')
    } else {
      // do not true delete yet
      // only set sektion.deleted = 1
      setDeletionCallback(() => {
        store.setSektionDeleted(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      setDeletionMessage(
        `${
          activeSektion.name ? `"${activeSektion.name}"` : 'Diesen Datensatz'
        } wirklich löschen?`,
      )
      setDeletionTitle('Sektion löschen')
    }
  }, [
    sektionen,
    activeId,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
    store,
  ])

  const sektionenSum = showDeleted
    ? sektionen.length
    : sektionen.filter(p => p.deleted === 0).length
  const sektionenSumSup =
    sektionenFiltered.length !== sektionenSum
      ? `${sektionenFiltered.length}/${sektionenSum}`
      : sektionenFiltered.length
  const active = activeLocation === 'Sektionen' && !activePrintForm
  const existsActiveSektion = active && location[1]

  return (
    <StyledNavItem active={active}>
      <NavLink href="/" id="Sektionen" onClick={showTab}>
        Sektionen
        {active && <Sup>{sektionenSumSup}</Sup>}
      </NavLink>
      {activeLocation !== 'Sektionen' && (
        <UncontrolledTooltip placement="bottom" target="Sektionen">
          Sektionen anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton id="newSektionButton" onClick={addSektion}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newSektionButton">
            neue Sektion erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteSektionButton"
            onClick={deleteSektion}
            disabled={!existsActiveSektion}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveSektion && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteSektionButton"
            >
              markierte Sektion löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Sektion)
