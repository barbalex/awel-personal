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
  Button,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'
import { FaUndo } from 'react-icons/fa'
import styled from 'styled-components'

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

const UndoButton = styled(Button)`
  margin-right: 5px;
  background-color: transparent !important;
  border: none !important;
  &:hover {
    background-color: ${props =>
      props.disabled ? 'transparent !important' : '#6c757d !important'};
  }
`

const MyNavbar = () => {
  const store = useContext(storeContext)
  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(() => {
    setOpen(!open)
  }, [open])
  const { lastUserMutation, revertMutation, addError } = store
  const onClickUndo = useCallback(() => {
    if (!lastUserMutation) {
      return addError(
        'Es gibt keine Aktion, die rückgängig gemacht werden könnte',
      )
    }
    revertMutation(lastUserMutation.id)
  }, [lastUserMutation])

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
          <UndoButton
            disabled={!lastUserMutation}
            onClick={onClickUndo}
            title={
              lastUserMutation
                ? 'letzte Aktion rückgängig machen'
                : 'keine Aktion, die rückgängig gemacht werden könnte'
            }
          >
            <FaUndo />
          </UndoButton>
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
