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

const Bereich = () => {
  const store = useContext(storeContext)
  const {
    showDeleted,
    bereicheFilteredSorted,
    bereiche,
    setLocation,
    addBereich,
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
    [setLocation],
  )
  // const addBereich = useCallback(() => addBereich())
  const deleteBereich = useCallback(() => {
    const activeBereich = bereiche.find(p => p.id === activeId)
    if (activeBereich.deleted === 1) {
      // bereich.deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        store.deleteBereich(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activeBereich.name
        ? `"${activeBereich.name}"`
        : 'Dieser Datensatz'
      const namer1 = activeBereich.name ? 'sie' : 'ihn'
      const namer2 = activeBereich.name ? 'sie' : 'er'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
      )
      setDeletionTitle('Bereich unwiederbringlich löschen')
    } else {
      // do not true delete yet
      // only set bereich.deleted = 1
      setDeletionCallback(() => {
        store.setBereichDeleted(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      setDeletionMessage(
        `${
          activeBereich.name ? `"${activeBereich.name}"` : 'Diesen Datensatz'
        } wirklich löschen?`,
      )
      setDeletionTitle('Bereich löschen')
    }
  }, [
    activeId,
    bereiche,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
    store,
  ])

  const existsActiveBereich = activeLocation === 'Bereiche' && location[1]
  const bereicheSum = showDeleted
    ? bereiche.length
    : bereiche.filter(p => p.deleted === 0).length
  const bereicheSumSup =
    bereicheFilteredSorted.length !== bereicheSum
      ? `${bereicheFilteredSorted.length}/${bereicheSum}`
      : bereicheFilteredSorted.length

  return (
    <StyledNavItem active={activeLocation === 'Bereiche'}>
      <NavLink id="Bereiche" onClick={showTab}>
        Bereiche
        {activeLocation === 'Bereiche' && <Sup>{bereicheSumSup}</Sup>}
      </NavLink>
      {activeLocation !== 'Bereiche' && (
        <UncontrolledTooltip placement="bottom" target="Bereiche">
          Bereiche anzeigen
        </UncontrolledTooltip>
      )}
      {activeLocation === 'Bereiche' && (
        <>
          <StyledButton id="newBereichButton" onClick={addBereich}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newBereichButton">
            neuen Bereich erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteBereichButton"
            onClick={deleteBereich}
            disabled={!existsActiveBereich}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveBereich && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteBereichButton"
            >
              markierten Bereich löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Bereich)
