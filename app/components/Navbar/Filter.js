// @flow
import React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  UncontrolledTooltip
} from 'reactstrap'

const Filter = () => (
  <div>
    <InputGroup>
      <Input placeholder="Volltext filtern (TODO)" />
      <Input placeholder="Felder filtern/sortieren" />
      <InputGroupAddon addonType="append" id="filterRemoveAddon">
        <span className="input-group-text">
          <i className="fas fa-times" />
        </span>
      </InputGroupAddon>
      <UncontrolledTooltip placement="bottom" target="filterRemoveAddon">
        Filter entfernen
      </UncontrolledTooltip>
    </InputGroup>
  </div>
)

export default Filter
