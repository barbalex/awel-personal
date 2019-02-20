import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const Berichte = () => {
  const store = useContext(storeContext)
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
    <UncontrolledDropdown nav inNavbar active={activeLocation === 'berichte'}>
      <DropdownToggle nav caret>
        Berichte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Personalblatt</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>mehr?</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default observer(Berichte)
