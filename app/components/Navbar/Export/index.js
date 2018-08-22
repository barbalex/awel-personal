import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'

const enhance = compose(
  inject('store'),
  observer
)

const Export = () => (
  <UncontrolledDropdown nav inNavbar>
    <DropdownToggle nav caret>
      Exporte
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Gefilterte Personen mit allen Feldern (TODO)</DropdownItem>
      <DropdownItem divider />
      <DropdownItem>mehr?</DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
)

export default enhance(Export)
