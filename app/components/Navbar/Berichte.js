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
  const { setLocation } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const showPD = location[0] === 'Personen' && location[1]
  const onClickPD = useCallback(() => {
    setLocation([...location, 'pdf'])
  }, [location])

  return (
    <UncontrolledDropdown nav inNavbar active={activeLocation === 'berichte'}>
      <DropdownToggle nav caret>
        Berichte
      </DropdownToggle>
      <DropdownMenu>
        {showPD && (
          <>
            <DropdownItem onClick={onClickPD}>Personalblatt</DropdownItem>
            <DropdownItem divider />
          </>
        )}
        <DropdownItem>mehr?</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default observer(Berichte)
