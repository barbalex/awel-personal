// @flow
import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip
} from 'reactstrap'

import storeContext from '../../storeContext'

const VolltextFilterRemoveAddon = styled(InputGroupText)`
  background-color: white !important;
`

const Filter = () => {
  const store = useContext(storeContext)
  const { showFilter, setShowFilter, filterFulltext, setFilterFulltext } = store

  const toggleShowFilter = useCallback(
    () => {
      setShowFilter(!showFilter)
    },
    [showFilter]
  )
  const onChangeFilterFulltext = useCallback(e =>
    setFilterFulltext(e.target.value)
  )
  const onEmptyFilterFulltext = useCallback(() => setFilterFulltext(null))

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
              <i className="fas fa-times" />
            </VolltextFilterRemoveAddon>
          )}
          <InputGroupText id="filterAddon" onClick={toggleShowFilter}>
            <i
              className={`fas ${store.showFilter ? 'fa-edit' : 'fa-filter'}`}
            />
          </InputGroupText>
          {store.existsFilter && (
            <InputGroupText id="emptyFilterAddon" onClick={store.emptyFilter}>
              <i className="fas fa-times" />
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
