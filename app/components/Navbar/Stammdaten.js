import React, { Fragment } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  UncontrolledTooltip
} from 'reactstrap'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'

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

const enhance = compose(
  inject('store'),
  withHandlers({
    addWert: ({ store }) => () => {
      const location = store.location.toJSON()
      const activeTable = location[0]
      store.addWert(activeTable)
    },
    deleteWert: ({ store }) => () => {
      const {
        setDeletionMessage,
        setDeletionTitle,
        setDeletionCallback
      } = store
      const location = store.location.toJSON()
      const activeTable = location[0]
      const activeId = ifIsNumericAsNumber(location[1])
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
          `${name} war schon gelöscht. Wenn Sie ihn nochmals löschen, ist das endgültig und unwiederbringlich. Möchten Sie das?`
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
          } wirklich löschen?`
        )
        setDeletionTitle(`${activeTable} löschen`)
      }
    },
    onClickStatusTable: ({ store }) => e => {
      store.setLocation([e.target.name])
    }
  }),
  observer
)

const Stammdaten = ({
  store,
  addWert,
  deleteWert,
  onClickStatusTable
}: {
  store: Object,
  addWert: () => void,
  deleteWert: () => void,
  onClickStatusTable: () => void
}) => {
  const location = store.location.toJSON()
  const activeLocation = location[0]
  let stammdatenCount = 0
  if (activeLocation.includes('Werte')) {
    stammdatenCount = store[activeLocation].length
  }
  let mayAddNewWert
  if (activeLocation && store[activeLocation]) {
    mayAddNewWert =
      store[activeLocation].filter(p => p.deleted === 0 && !p.value).length ===
      0
  }
  const existsActiveWert = activeLocation.includes('Werte') && location[1]

  return (
    <StamdatenContainer active={activeLocation.includes('Werte')}>
      <UncontrolledDropdown
        nav
        inNavbar
        active={activeLocation.includes('Werte')}
      >
        <DropdownToggle nav caret>
          {activeLocation.includes('Werte') ? (
            <span>
              {activeLocation}
              <Sup>{stammdatenCount}</Sup>
            </span>
          ) : (
            'Stammdaten'
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem name="abteilungWerte" onClick={onClickStatusTable}>
            Abteilung
          </DropdownItem>
          <DropdownItem name="etikettWerte" onClick={onClickStatusTable}>
            Etikett
          </DropdownItem>
          <DropdownItem name="geschlechtWerte" onClick={onClickStatusTable}>
            Geschlecht
          </DropdownItem>
          <DropdownItem name="kaderFunktionWerte" onClick={onClickStatusTable}>
            Kaderfunktion
          </DropdownItem>
          <DropdownItem name="kostenstelleWerte" onClick={onClickStatusTable}>
            Kostenstelle
          </DropdownItem>
          <DropdownItem name="mobileAboTypWerte" onClick={onClickStatusTable}>
            Mobile Abo Typ
          </DropdownItem>
          <DropdownItem
            name="mobileAboKostenstelleWerte"
            onClick={onClickStatusTable}
          >
            Mobile Abo Kostenstelle
          </DropdownItem>
          <DropdownItem name="statusWerte" onClick={onClickStatusTable}>
            Status
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      {activeLocation.includes('Werte') && (
        <Fragment>
          <StyledButton
            id="newStammdatenButton"
            onClick={addWert}
            disabled={!mayAddNewWert}
          >
            <i className="fas fa-plus" />
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
            <i className="fas fa-trash-alt" />
          </StyledButton>
          {existsActiveWert && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteStammdatenButton"
            >
              markierten Wert löschen
            </UncontrolledTooltip>
          )}
        </Fragment>
      )}
    </StamdatenContainer>
  )
}

export default enhance(Stammdaten)
