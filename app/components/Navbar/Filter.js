import React, { useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { FaTimes, FaEdit, FaFilter } from 'react-icons/fa'

import storeContext from '../../storeContext'

const VolltextFilterRemoveAddon = styled(InputGroupText)`
  background-color: white !important;
`

const Filter = () => {
  const store = useContext(storeContext)
  const { showFilter, setShowFilter, filterFulltext, setFilterFulltext } = store

  const [filterDropdownIsOpen, setFilterDropdownIsOpen] = useState(false)

  const toggleShowFilter = useCallback(() => setShowFilter(!showFilter), [
    showFilter,
  ])
  const onChangeFilterFulltext = useCallback(e =>
    setFilterFulltext(e.target.value),
  )
  const onEmptyFilterFulltext = useCallback(() => setFilterFulltext(null))
  const toggleFilterDropdown = useCallback(
    () => setFilterDropdownIsOpen(!filterDropdownIsOpen),
    [filterDropdownIsOpen],
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
          <ButtonDropdown
            direction="down"
            id="filterAddon"
            isOpen={filterDropdownIsOpen}
            toggle={toggleFilterDropdown}
            onClick={toggleShowFilter}
          >
            <DropdownToggle caret>
              {store.showFilter ? <FaEdit /> : <FaFilter />}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          {store.existsFilter && (
            <InputGroupText id="emptyFilterAddon" onClick={store.emptyFilter}>
              <FaTimes />
            </InputGroupText>
          )}
        </InputGroupAddon>
        {filterFulltext && (
          <UncontrolledTooltip
            placement="bottom"
            target="volltextFilterRemoveAddon"
          >
            Volltext-Filter leeren
          </UncontrolledTooltip>
        )}
        <UncontrolledTooltip placement="bottom" target="filterAddon">
          {store.showFilter ? 'Daten bearbeiten' : 'Nach Felden filtern'}
        </UncontrolledTooltip>
        {store.existsFilter && (
          <UncontrolledTooltip placement="bottom" target="emptyFilterAddon">
            Filter leeren
          </UncontrolledTooltip>
        )}
      </InputGroup>
    </div>
  )
}

export default observer(Filter)
