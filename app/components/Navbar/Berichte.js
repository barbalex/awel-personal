import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaPrint, FaRegFilePdf } from 'react-icons/fa'

import storeContext from '../../storeContext'

const StyledUncontrolledDropdown = styled(UncontrolledDropdown)`
  display: flex;
  border: ${props =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Berichte = () => {
  const store = useContext(storeContext)
  const { setLocation } = store
  const location = store.location.toJSON()
  const showPD = location[0] === 'Personen' && location[1]
  const onClickPD = useCallback(() => {
    setLocation([...location, 'pdf'])
  }, [location])

  return (
    <StyledUncontrolledDropdown nav inNavbar active={location.includes('pdf')}>
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
      {location.includes('pdf') && (
        <>
          <StyledButton id="newPersonButton">
            <FaPrint />
          </StyledButton>
        </>
      )}
    </StyledUncontrolledDropdown>
  )
}

export default observer(Berichte)
