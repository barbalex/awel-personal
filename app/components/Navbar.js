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

import { shell } from 'electron'

import DbContext from '../context/db'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const enhance = compose(
  withState('open', 'setOpen', false),
  withHandlers({
    toggle: ({ open, setOpen }) => () => {
      setOpen(!open)
    }
  })
)

const MyNavbar = ({ open, toggle }: { open: boolean, toggle: () => void }) => (
  <DbContext>
    {db => (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Personal</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={open} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Personen</NavLink>
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
                  <DbPath>{`Aktuell: ${db.name}`}</DbPath>
                </DropdownItem>
                <DropdownItem onClick={onClickIssues}>
                  Fehler und Wünsche melden
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    )}
  </DbContext>
)

export default enhance(MyNavbar)
