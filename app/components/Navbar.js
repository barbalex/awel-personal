import React from 'react'
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
  > button {
    background-color: rgba(0, 0, 0, 0);
    border: unset;
  }
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const enhance = compose(
  inject('store'),
  withState('open', 'setOpen', false),
  withState('newPersonTooltipOpen', 'setNewPersonTooltip', false),
  withState('deletePersonTooltipOpen', 'setDeletePersonTooltip', false),
  withHandlers({
    toggle: ({ open, setOpen }) => () => {
      setOpen(!open)
    },
    toggleNewPersonTooltip: ({
      newPersonTooltipOpen,
      setNewPersonTooltip
    }) => () => setNewPersonTooltip(!newPersonTooltipOpen),
    toggleDeletePersonTooltip: ({
      deletePersonTooltipOpen,
      setDeletePersonTooltip
    }) => () => setDeletePersonTooltip(!deletePersonTooltipOpen)
  }),
  observer
)

const MyNavbar = ({
  store,
  open,
  toggle,
  newPersonTooltipOpen,
  toggleNewPersonTooltip,
  deletePersonTooltipOpen,
  toggleDeletePersonTooltip
}: {
  store: Object,
  open: boolean,
  toggle: () => void,
  newPersonTooltipOpen: boolean,
  toggleNewPersonTooltip: () => void,
  deletePersonTooltipOpen: boolean,
  toggleDeletePersonTooltip: () => void
}) => {
  const { showDeleted } = store
  const personen = store.personen.filter(
    p => (showDeleted ? true : p.deleted === 0)
  )
  const location = store.location.toJSON()
  const activeLink = location[0]

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={open} navbar>
        <Nav className="mr-auto" navbar>
          <StyledNavItem active={activeLink === 'Personen'}>
            <NavLink href="/">
              Personen
              <Sup>{personen.length}</Sup>
            </NavLink>
            <Button id="newPersonSymbol">
              <i className="fas fa-plus" />
            </Button>
            <Tooltip
              placement="bottom"
              isOpen={newPersonTooltipOpen}
              target="newPersonSymbol"
              toggle={toggleNewPersonTooltip}
            >
              neue Person erstellen
            </Tooltip>
            <Button id="deletePersonSymbol">
              <i className="fas fa-trash-alt" />
            </Button>
            <Tooltip
              placement="bottom"
              isOpen={deletePersonTooltipOpen}
              target="deletePersonSymbol"
              toggle={toggleDeletePersonTooltip}
            >
              aktive Person löschen
            </Tooltip>
          </StyledNavItem>
          <NavItem>
            <NavLink href="/">Exporte</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Berichte</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Stammdaten</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
              <i className="fas fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                Datenbank wählen
                <br />
                <DbPath>{`Aktuell: ${app.db.name}`}</DbPath>
              </DropdownItem>
              <DropdownItem onClick={onClickIssues}>
                Fehler und Wünsche melden
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default enhance(MyNavbar)
