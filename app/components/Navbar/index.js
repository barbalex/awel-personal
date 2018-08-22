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
  UncontrolledTooltip
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
  withHandlers({
    toggleNavbar: ({ open, setOpen }) => () => {
      setOpen(!open)
    },
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
    },
    toggleShowDeleted: ({ store }) => () =>
      store.setShowDeleted(!store.showDeleted),
    onClickStatusTable: ({ store }) => e => {
      store.setLocation([e.target.name])
    }
  }),
  observer
)

const MyNavbar = ({
  store,
  open,
  toggleNavbar,
  showTab,
  addPerson,
  deletePerson,
  toggleShowDeleted,
  onClickStatusTable
}: {
  store: Object,
  open: boolean,
  toggleNavbar: () => void,
  showTab: () => void,
  addPerson: () => void,
  deletePerson: () => void,
  toggleShowDeleted: () => void,
  onClickStatusTable: () => void
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
              <UncontrolledTooltip placement="bottom" target="Personen">
                Personen anzeigen
              </UncontrolledTooltip>
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
                  <UncontrolledTooltip
                    placement="bottom"
                    target="newPersonButton"
                  >
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
                  <UncontrolledTooltip
                    placement="bottom"
                    target="deletePersonButton"
                  >
                    markierte Person löschen
                  </UncontrolledTooltip>
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
              <DropdownItem name="statusWerte" onClick={onClickStatusTable}>
                Status
              </DropdownItem>
              <DropdownItem name="geschlechtWerte" onClick={onClickStatusTable}>
                Geschlecht
              </DropdownItem>
              <DropdownItem name="abteilungWerte" onClick={onClickStatusTable}>
                Abteilung
              </DropdownItem>
              <DropdownItem
                name="kostenstelleWerte"
                onClick={onClickStatusTable}
              >
                Kostenstelle
              </DropdownItem>
              <DropdownItem
                name="mobileAboTypWerte"
                onClick={onClickStatusTable}
              >
                Mobile Abo
              </DropdownItem>
              <DropdownItem
                name="mobileAboKostenstelleWerte"
                onClick={onClickStatusTable}
              >
                Mobile Abo Kostenstelle
              </DropdownItem>
              <DropdownItem
                name="kaderFunktionWerte"
                onClick={onClickStatusTable}
              >
                Kaderfunktion
              </DropdownItem>
              <DropdownItem name="etikettWerte" onClick={onClickStatusTable}>
                Etikett
              </DropdownItem>
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
