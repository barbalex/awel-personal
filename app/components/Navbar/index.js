import React, { Fragment } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip
} from 'reactstrap'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import app from 'ampersand-app'
import { inject, observer } from 'mobx-react'
import { shell } from 'electron'

import Filter from './Filter'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
`
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
const MoreMenu = styled(UncontrolledDropdown)`
  width: 40px;
  > a {
    padding-left: 18px !important;
  }
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const enhance = compose(
  inject('store'),
  withState('open', 'setOpen', false),
  withState('personenTooltipOpen', 'setPersonenTooltip', false),
  withState('newPersonTooltipOpen', 'setNewPersonTooltip', false),
  withState('deletePersonTooltipOpen', 'setDeletePersonTooltip', false),
  withHandlers({
    toggleNavbar: ({ open, setOpen }) => () => {
      setOpen(!open)
    },
    togglePersonenTooltip: ({
      personenTooltipOpen,
      setPersonenTooltip
    }) => () => setPersonenTooltip(!personenTooltipOpen),
    toggleNewPersonTooltip: ({
      newPersonTooltipOpen,
      setNewPersonTooltip
    }) => () => setNewPersonTooltip(!newPersonTooltipOpen),
    toggleDeletePersonTooltip: ({
      deletePersonTooltipOpen,
      setDeletePersonTooltip
    }) => () => setDeletePersonTooltip(!deletePersonTooltipOpen),
    showTab: ({ store }) => e => {
      e.preventDefault()
      const id = e.target.id
      const activeLocation = store.location.toJSON()[0]
      const newLocation = id
      // do nothing if is same location
      if (newLocation === activeLocation) return
      store.setLocation([newLocation])
    },
    addPerson: ({ store }) => () => store.addPerson(),
    setPersonDeleted: ({ store }) => () => {
      const {
        setDeletionMessage,
        setDeletionTitle,
        setDeletionCallback,
        personen
      } = store
      const location = store.location.toJSON()
      let activeId = location[1]
      if (!isNaN(activeId)) activeId = +activeId
      setDeletionCallback(() => {
        store.deletePerson(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const activePerson = personen.find(p => p.id === activeId)
      setDeletionMessage(
        `${
          activePerson.name
            ? `"${activePerson.name} ${activePerson.vorname}"`
            : 'Diesen Datensatz'
        } wirklich löschen?`
      )
      setDeletionTitle('Person löschen')
    },
    deletePerson: ({ store }) => () => {
      const {
        setDeletionMessage,
        setDeletionTitle,
        setDeletionCallback,
        personen
      } = store
      const location = store.location.toJSON()
      let activeId = location[1]
      if (!isNaN(activeId)) activeId = +activeId
      setDeletionCallback(() => {
        store.deletePerson(activeId)
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const activePerson = personen.find(p => p.id === activeId)
      setDeletionMessage(
        `${
          activePerson.name
            ? `"${activePerson.name} ${activePerson.vorname}"`
            : 'Diesen Datensatz'
        } wirklich löschen?`
      )
      setDeletionTitle('Person löschen')
    },
    toggleShowDeleted: ({ store }) => () =>
      store.setShowDeleted(!store.showDeleted)
  }),
  observer
)

const MyNavbar = ({
  store,
  open,
  toggleNavbar,
  personenTooltipOpen,
  togglePersonenTooltip,
  newPersonTooltipOpen,
  toggleNewPersonTooltip,
  deletePersonTooltipOpen,
  toggleDeletePersonTooltip,
  showTab,
  addPerson,
  deletePerson,
  toggleShowDeleted
}: {
  store: Object,
  open: boolean,
  toggleNavbar: () => void,
  personenTooltipOpen: boolean,
  togglePersonenTooltip: () => void,
  newPersonTooltipOpen: boolean,
  toggleNewPersonTooltip: () => void,
  deletePersonTooltipOpen: boolean,
  toggleDeletePersonTooltip: () => void,
  showTab: () => void,
  addPerson: () => void,
  deletePerson: () => void,
  toggleShowDeleted: () => void
}) => {
  const { showDeleted } = store
  const personen = store.personen.filter(
    p => (showDeleted ? true : p.deleted === 0)
  )
  const location = store.location.toJSON()
  const activeLink = location[0]
  const existsActivePerson = activeLink === 'Personen' && location[1]
  const mayAddNewPerson =
    personen.filter(p => p.deleted === 0 && !p.name && !p.vorname).length === 0

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={open} navbar>
        <Nav className="mr-auto" navbar>
          <StyledNavItem active={activeLink === 'Personen'}>
            <NavLink href="/" id="Personen" onClick={showTab}>
              Personen
              <Sup>{personen.length}</Sup>
            </NavLink>
            {activeLink !== 'Personen' && (
              <Tooltip
                placement="bottom"
                isOpen={personenTooltipOpen}
                target="Personen"
                toggle={togglePersonenTooltip}
              >
                Personen anzeigen
              </Tooltip>
            )}
            {activeLink === 'Personen' && (
              <Fragment>
                <StyledButton
                  id="newPersonButton"
                  onClick={addPerson}
                  disabled={!mayAddNewPerson}
                >
                  <i className="fas fa-plus" />
                </StyledButton>
                {mayAddNewPerson && (
                  <Tooltip
                    placement="bottom"
                    isOpen={newPersonTooltipOpen}
                    target="newPersonButton"
                    toggle={toggleNewPersonTooltip}
                  >
                    neue Person erfassen
                  </Tooltip>
                )}
                <StyledButton
                  id="deletePersonButton"
                  onClick={deletePerson}
                  disabled={!existsActivePerson}
                >
                  <i className="fas fa-trash-alt" />
                </StyledButton>
                {existsActivePerson && (
                  <Tooltip
                    placement="bottom"
                    isOpen={deletePersonTooltipOpen}
                    target="deletePersonButton"
                    toggle={toggleDeletePersonTooltip}
                  >
                    markierte Person löschen
                  </Tooltip>
                )}
              </Fragment>
            )}
          </StyledNavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Exporte
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                Gefilterte Personen mit allen Feldern (TODO)
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>mehr?</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Berichte
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>TODO</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>mehr?</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Stammdaten
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Status (TODO)</DropdownItem>
              <DropdownItem>Geschlecht (TODO)</DropdownItem>
              <DropdownItem>Abteilung (TODO)</DropdownItem>
              <DropdownItem>Kostenstelle (TODO)</DropdownItem>
              <DropdownItem>Mobile Abo (TODO)</DropdownItem>
              <DropdownItem>Mobile Abo Kostenstelle (TODO)</DropdownItem>
              <DropdownItem>Kaderfunktion (TODO)</DropdownItem>
              <DropdownItem>Tag (TODO)</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Nav className="ml-auto" navbar>
          <Filter />
          <MoreMenu nav inNavbar>
            <DropdownToggle nav>
              <i className="fas fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                Datenbank wählen (TODO)
                <br />
                <DbPath>{`Aktuell: ${app.db.name}`}</DbPath>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={toggleShowDeleted}>
                {showDeleted
                  ? 'gelöschte Datensätze verbergen'
                  : 'gelöschte Datensätze anzeigen'}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={onClickIssues}>
                Fehler und Wünsche melden
              </DropdownItem>
            </DropdownMenu>
          </MoreMenu>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default enhance(MyNavbar)
