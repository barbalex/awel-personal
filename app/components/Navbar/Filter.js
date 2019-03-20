import React, { useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { FaTimes, FaEdit, FaFilter } from 'react-icons/fa'

import storeContext from '../../storeContext'

const VolltextFilterRemoveAddon = styled(InputGroupText)`
  background-color: white !important;
`
const FilerIconContainer = styled.div`
  padding-right: 10px;
`
const StyledDropdown = styled(Dropdown)`
  margin-right: -12px;
  margin-top: -8px;
  margin-bottom: -8px;
  min-width: 23px;
  min-height: 38px;
  .dropdown-toggle {
    min-height: 38px;
    padding-top: 5px;
    padding-right: 4px;
    min-width: 23px;
    border-left: 1px solid #ced4da;
  }
`

const Filter = () => {
  const store = useContext(storeContext)
  const {
    showFilter,
    setShowFilter,
    filterFulltext,
    setFilterFulltext,
    setFilter,
  } = store

  const [filterDropdownIsOpen, setFilterDropdownIsOpen] = useState(false)

  const toggleShowFilter = useCallback(() => setShowFilter(!showFilter), [
    showFilter,
  ])
  const onChangeFilterFulltext = useCallback(e =>
    setFilterFulltext(e.target.value),
  )
  const onEmptyFilterFulltext = useCallback(() => setFilterFulltext(null))
  const toggleFilterDropdown = useCallback(
    e => {
      setFilterDropdownIsOpen(!filterDropdownIsOpen)
      e.stopPropagation()
    },
    [filterDropdownIsOpen],
  )
  const onClickAnstehendeMutationen = useCallback(() =>
    setFilter({ model: 'filterPerson', value: { mutationNoetig: 1 } }),
  )

  return (
    <div>
      <InputGroup>
        <Input
          placeholder="Volltext filtern"
          onChange={onChangeFilterFulltext}
          value={filterFulltext || ''}
        />
        <InputGroupAddon addonType="append">
          {filterFulltext && (
            <VolltextFilterRemoveAddon
              id="volltextFilterRemoveAddon"
              onClick={onEmptyFilterFulltext}
            >
              <FaTimes />
            </VolltextFilterRemoveAddon>
          )}
          <InputGroupText id="filterAddon" onClick={toggleShowFilter}>
            <FilerIconContainer>
              {store.showFilter ? <FaEdit /> : <FaFilter />}
            </FilerIconContainer>
            {filterFulltext && (
              <UncontrolledTooltip
                placement="left"
                target="volltextFilterRemoveAddon"
              >
                Volltext-Filter leeren
              </UncontrolledTooltip>
            )}
            <UncontrolledTooltip placement="left" target="filterAddon">
              {store.showFilter ? 'Daten bearbeiten' : 'Nach Felden filtern'}
            </UncontrolledTooltip>
            {store.existsFilter && (
              <UncontrolledTooltip placement="left" target="emptyFilterAddon">
                Filter leeren
              </UncontrolledTooltip>
            )}
            <StyledDropdown
              isOpen={filterDropdownIsOpen}
              toggle={toggleFilterDropdown}
            >
              <DropdownToggle caret tag="div">
                {' '}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>vorbereitete Filter</DropdownItem>
                <DropdownItem onClick={onClickAnstehendeMutationen}>
                  Anstehende Mutationen
                </DropdownItem>
              </DropdownMenu>
            </StyledDropdown>
          </InputGroupText>
          {store.existsFilter && (
            <InputGroupText id="emptyFilterAddon" onClick={store.emptyFilter}>
              <FaTimes />
            </InputGroupText>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default observer(Filter)
