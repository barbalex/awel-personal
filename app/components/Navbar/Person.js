import React, { Fragment } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'

const Sup = styled.sup`
  padding-left: 3px;
`
const StyledNavItem = styled(NavItem)`
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
    showTab: ({ store }) => e => {
      e.preventDefault()
      const id = e.target.id
      const activeLocation = store.location[0]
      const newLocation = id
      // do nothing if is same location
      if (newLocation === activeLocation) return
      store.setLocation([newLocation])
    },
    addPerson: ({ store }) => () => store.addPerson(),
    deletePerson: ({ store }) => () => {
      const {
        setDeletionMessage,
        setDeletionTitle,
        setDeletionCallback,
        personen
      } = store
      const location = store.location
      const activeId = ifIsNumericAsNumber(location[1])
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
        const namer1 = activePerson.geschlecht === 'w' ? 'sie' : 'ihn'
        const namer2 = activePerson.geschlecht === 'w' ? 'sie' : 'er'
        setDeletionMessage(
          `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`
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
          } wirklich löschen?`
        )
        setDeletionTitle('Person löschen')
      }
    }
  }),
  observer
)

const Person = ({
  store,
  showTab,
  addPerson,
  deletePerson
}: {
  store: Object,
  showTab: () => void,
  addPerson: () => void,
  deletePerson: () => void
}) => {
  const { showDeleted, personenFiltered, personen } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const existsActivePerson = activeLocation === 'Personen' && location[1]
  const mayAddNewPerson =
    personenFiltered.filter(p => !p.name && !p.vorname).length === 0
  const personenSum = showDeleted
    ? personen.length
    : personen.filter(p => p.deleted === 0).length

  return (
    <StyledNavItem active={activeLocation === 'Personen'}>
      <NavLink href="/" id="Personen" onClick={showTab}>
        Personen
        {activeLocation === 'Personen' && (
          <Sup>{`${personenFiltered.length}/${personenSum}`}</Sup>
        )}
      </NavLink>
      {activeLocation !== 'Personen' && (
        <UncontrolledTooltip placement="bottom" target="Personen">
          Personen anzeigen
        </UncontrolledTooltip>
      )}
      {activeLocation === 'Personen' && (
        <Fragment>
          <StyledButton
            id="newPersonButton"
            onClick={addPerson}
            disabled={!mayAddNewPerson}
          >
            <i className="fas fa-plus" />
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
            <i className="fas fa-trash-alt" />
          </StyledButton>
          {existsActivePerson && (
            <UncontrolledTooltip placement="bottom" target="deletePersonButton">
              markierte Person löschen
            </UncontrolledTooltip>
          )}
        </Fragment>
      )}
    </StyledNavItem>
  )
}

export default enhance(Person)
