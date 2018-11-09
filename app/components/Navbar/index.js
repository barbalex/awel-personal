import React, { useContext, useState, useCallback } from 'react'
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
import { observer } from 'mobx-react'

import Filter from './Filter'
import Stammdaten from './Stammdaten'
import Person from './Person'
import Export from './Export'
import More from './More'
import storeContext from '../../storeContext'

const MyNavbar = () => {
  const store = useContext(storeContext)
  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(
    () => {
      setOpen(!open)
    },
    [open]
  )

  const location = store.location.toJSON()
  const activeLocation = location[0]

  return (
    <Navbar color="dark" dark expand="lg">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={open} navbar>
        <Nav className="mr-auto" navbar>
          <Person />
          <Export />
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
          {activeLocation === 'Personen' && <Filter />}
          <More />
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default observer(MyNavbar)
