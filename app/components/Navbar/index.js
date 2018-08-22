import React from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
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

import Filter from './Filter'
import Stammdaten from './Stammdaten'
import Person from './Person'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
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
    toggleShowDeleted: ({ store }) => () =>
      store.setShowDeleted(!store.showDeleted)
  }),
  observer
)

const MyNavbar = ({
  store,
  open,
  toggleNavbar,
  toggleShowDeleted
}: {
  store: Object,
  open: boolean,
  toggleNavbar: () => void,
  toggleShowDeleted: () => void
}) => {
  const { showDeleted } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]

  return (
    <Navbar color="dark" dark expand="lg">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={open} navbar>
        <Nav className="mr-auto" navbar>
          <Person />
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
          <UncontrolledDropdown
            nav
            inNavbar
            active={activeLocation === 'berichte'}
          >
            <DropdownToggle nav caret>
              Berichte
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>TODO</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>mehr?</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Stammdaten />
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
