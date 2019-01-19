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

const Amt = () => {
  const store = useContext(storeContext)
  const {
    showDeleted,
    aemterFiltered,
    aemter,
    setLocation,
    addAmt,
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
  // const addAmt = useCallback(() => addAmt())
  const deleteAmt = useCallback(
    () => {
      const activeAmt = aemter.find(p => p.id === activeId)
      if (activeAmt.deleted === 1) {
        // amt.deleted is already = 1
        // prepare true deletion
        setDeletionCallback(() => {
          store.deleteAmt(activeId)
          setDeletionMessage(null)
          setDeletionTitle(null)
        })
        const name = activeAmt.name ? `"${activeAmt.name}"` : 'Dieser Datensatz'
        const namer1 = activeAmt.name ? 'sie' : 'ihn'
        const namer2 = activeAmt.name ? 'sie' : 'er'
        setDeletionMessage(
          `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
        )
        setDeletionTitle('Amt unwiederbringlich löschen')
      } else {
        // do not true delete yet
        // only set amt.deleted = 1
        setDeletionCallback(() => {
          store.setAmtDeleted(activeId)
          setDeletionMessage(null)
          setDeletionTitle(null)
        })
        setDeletionMessage(
          `${
            activeAmt.name ? `"${activeAmt.name}"` : 'Diesen Datensatz'
          } wirklich löschen?`,
        )
        setDeletionTitle('Amt löschen')
      }
    },
    [aemter.length, location],
  )

  const existsActiveAmt = activeLocation === 'Aemter' && location[1]
  const mayAddNewAmt =
    aemterFiltered.filter(p => !p.name && !p.vorname).length === 0
  const aemterSum = showDeleted
    ? aemter.length
    : aemter.filter(p => p.deleted === 0).length
  const aemterSumSup =
    aemterFiltered.length !== aemterSum
      ? `${aemterFiltered.length}/${aemterSum}`
      : aemterFiltered.length

  return (
    <StyledNavItem active={activeLocation === 'Aemter'}>
      <NavLink href="/" id="Aemter" onClick={showTab}>
        Ämter
        {activeLocation === 'Aemter' && <Sup>{aemterSumSup}</Sup>}
      </NavLink>
      {activeLocation !== 'Aemter' && (
        <UncontrolledTooltip placement="bottom" target="Aemter">
          Ämter anzeigen
        </UncontrolledTooltip>
      )}
      {activeLocation === 'Aemter' && (
        <>
          <StyledButton
            id="newAmtButton"
            onClick={addAmt}
            disabled={!mayAddNewAmt}
          >
            <FaPlus />
          </StyledButton>
          {mayAddNewAmt && (
            <UncontrolledTooltip placement="bottom" target="newAmtButton">
              neues Amt erfassen
            </UncontrolledTooltip>
          )}
          <StyledButton
            id="deleteAmtButton"
            onClick={deleteAmt}
            disabled={!existsActiveAmt}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveAmt && (
            <UncontrolledTooltip placement="bottom" target="deleteAmtButton">
              markiertes Amt löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Amt)
