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
    }
  }),
  observer
)

const Filter = ({ toggleShowFilter }: { toggleShowFilter: () => void }) => (
  <div>
    <InputGroup>
      <Input placeholder="Volltext filtern (TODO)" />
      <InputGroupAddon addonType="append">
        <VolltextFilterRemoveAddon id="volltextFilterRemoveAddon">
          <i className="fas fa-times" />
        </VolltextFilterRemoveAddon>
        <InputGroupText id="filterAddon" onClick={toggleShowFilter}>
          <i className="fas fa-times" />
        </InputGroupText>
      </InputGroupAddon>
      <UncontrolledTooltip
        placement="bottom"
        target="volltextFilterRemoveAddon"
      >
        Volltext-Filter entfernen
      </UncontrolledTooltip>
      <UncontrolledTooltip placement="bottom" target="filterAddon">
        Nach Felden filtern
      </UncontrolledTooltip>
    </InputGroup>
  </div>
)

export default enhance(Filter)
