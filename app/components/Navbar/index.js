import React, { useContext, useState, useCallback } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'

import Filter from './Filter'
import Stammdaten from './Stammdaten'
import Personen from './Personen'
import Aemter from './Aemter'
import Abteilungen from './Abteilungen'
import Sektionen from './Sektionen'
import Bereiche from './Bereiche'
import Export from './Export'
import More from './More'
import storeContext from '../../storeContext'

const MyNavbar = () => {
  const store = useContext(storeContext)
  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const location = store.location.toJSON()
  const activeLocation = location[0]

  return (
    <Navbar color="dark" dark expand="lg">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={open} navbar>
        <Nav className="mr-auto" navbar>
          <Personen />
          <Bereiche />
          <Sektionen />
          <Abteilungen />
          <Aemter />
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
          {[
            'Personen',
            'Aemter',
            'Abteilungen',
            'Sektionen',
            'Bereiche',
          ].includes(activeLocation) && <Filter />}
          <More />
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default observer(MyNavbar)
