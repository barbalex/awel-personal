// @flow
import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip
} from 'reactstrap'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const VolltextFilterRemoveAddon = styled(InputGroupText)`
  background-color: white !important;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    toggleShowFilter: ({ store }) => () => {
      const { showFilter, setShowFilter } = store
      setShowFilter(!showFilter)
    },
    onChangeFilterFulltext: ({ store }) => e =>
      store.setFilterFulltext(e.target.value),
    onEmptyFilterFulltext: ({ store }) => () => store.setFilterFulltext(null)
  }),
  observer
)

const Filter = ({
  store,
  toggleShowFilter,
  onChangeFilterFulltext,
  onEmptyFilterFulltext
}: {
  store: Object,
  toggleShowFilter: () => void,
  onChangeFilterFulltext: () => void,
  onEmptyFilterFulltext: () => void
}) => (
  <div>
    <InputGroup>
      <Input
        placeholder="Volltext filtern (TODO)"
        onChange={onChangeFilterFulltext}
        value={store.filterFulltext || ''}
      />
      <InputGroupAddon addonType="append">
        {store.filterFulltext && (
          <VolltextFilterRemoveAddon
            id="volltextFilterRemoveAddon"
            onClick={onEmptyFilterFulltext}
          >
            <i className="fas fa-times" />
          </VolltextFilterRemoveAddon>
        )}
        <InputGroupText id="filterAddon" onClick={toggleShowFilter}>
          <i className={`fas ${store.showFilter ? 'fa-edit' : 'fa-filter'}`} />
        </InputGroupText>
        {store.existsFilter && (
          <InputGroupText id="emptyFilterAddon" onClick={store.emptyFilter}>
            <i className="fas fa-times" />
          </InputGroupText>
        )}
      </InputGroupAddon>
      {store.filterFulltext && (
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

export default enhance(Filter)
