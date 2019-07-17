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

const Person = () => {
  const store = useContext(storeContext)
  const {
    showDeleted,
    personenFiltered,
    personen,
    setLocation,
    addPerson,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
    setActivePrintForm,
    activePrintForm,
  } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const activeId = ifIsNumericAsNumber(location[1])

  const showTab = useCallback(
    e => {
      e.preventDefault()
      setActivePrintForm(null)
      setLocation([e.target.id])
    },
    [setActivePrintForm, setLocation],
  )
  const deletePerson = useCallback(() => {
    const activePerson = personen.find(p => p.id === activeId)
    if (activePerson.deleted === 1) {
      // person.deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        store.deletePerson(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activePerson.name
        ? `"${activePerson.name} ${activePerson.vorname}"`
        : 'Dieser Datensatz'
      const namer1 = activePerson.anrede === 'Frau' ? 'sie' : 'ihn'
      const namer2 = activePerson.anrede === 'Frau' ? 'sie' : 'er'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
      )
      setDeletionTitle('Person unwiederbringlich löschen')
    } else {
      // do not true delete yet
      // only set person.deleted = 1
      setDeletionCallback(() => {
        store.setPersonDeleted(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      setDeletionMessage(
        `${
          activePerson.name
            ? `"${activePerson.name} ${activePerson.vorname}"`
            : 'Diesen Datensatz'
        } wirklich löschen?`,
      )
      setDeletionTitle('Person löschen')
    }
  }, [personen, activeId, setDeletionCallback, setDeletionMessage, setDeletionTitle, store])

  const existsActivePerson = activeLocation === 'Personen' && location[1]
  const mayAddNewPerson =
    personenFiltered.filter(p => !p.name && !p.vorname).length === 0
  const personenSum = showDeleted
    ? personen.length
    : personen.filter(p => p.deleted === 0).length
  const personenSumSup =
    personenFiltered.length !== personenSum
      ? `${personenFiltered.length}/${personenSum}`
      : personenFiltered.length
  const active = activeLocation === 'Personen' && !activePrintForm

  return (
    <StyledNavItem active={active}>
      <NavLink href="/" id="Personen" onClick={showTab}>
        Personen
        {active && <Sup>{personenSumSup}</Sup>}
      </NavLink>
      {activeLocation !== 'Personen' && (
        <UncontrolledTooltip placement="bottom" target="Personen">
          Personen anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton
            id="newPersonButton"
            onClick={addPerson}
            disabled={!mayAddNewPerson}
          >
            <FaPlus />
          </StyledButton>
          {mayAddNewPerson && (
            <UncontrolledTooltip placement="bottom" target="newPersonButton">
              neue Person erfassen
            </UncontrolledTooltip>
          )}
          <StyledButton
            id="deletePersonButton"
            onClick={deletePerson}
            disabled={!existsActivePerson}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActivePerson && (
            <UncontrolledTooltip placement="bottom" target="deletePersonButton">
              markierte Person löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Person)
