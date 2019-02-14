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

const RevertButton = styled(Button)`
  font-size: 0.8rem !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  margin-top: -5px;
  height: 27px;
  align-self: center;
`

const MyNavbar = () => {
  const store = useContext(storeContext)
  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(() => {
    setOpen(!open)
  }, [open])
  const {
    lastUserMutation,
    lastUserMutationRevertion,
    revertMutation,
    addError,
  } = store
  const onClickRevert = useCallback(() => {
    console.log({ lastUserMutation })
    if (!lastUserMutation) {
      return addError(
        'Es gibt keine Ation, die rückgängig gemacht werden könnte',
      )
    }
    revertMutation(lastUserMutation.id)
  })

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
          <RevertButton
            disabled={!lastUserMutation}
            onClick={onClickRevert}
            outline
          >
            <FaUndo />
          </RevertButton>
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
