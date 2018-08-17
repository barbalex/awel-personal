import React from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
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

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const enhance = compose(
  inject('store'),
  withState('open', 'setOpen', false),
  withHandlers({
    toggle: ({ open, setOpen }) => () => {
      setOpen(!open)
    }
  }),
  observer
)

const MyNavbar = ({
  store,
  open,
  toggle
}: {
  store: Object,
  open: boolean,
  toggle: () => void
}) => {
  const { showDeleted } = store
  const personen = store.personen.filter(
    p => (showDeleted ? true : p.deleted === 0)
  )

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/">Personal</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={open} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/">
              Personen
              <Sup>{personen.length}</Sup>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Exporte</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Berichte</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Stammdaten</NavLink>
          </NavItem>
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
