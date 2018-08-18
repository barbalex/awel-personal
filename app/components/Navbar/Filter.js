// @flow
import React from 'react'
import { InputGroup, InputGroupAddon, Input } from 'reactstrap'

const Filter = () => (
  <InputGroup>
    <Input placeholder="Volltext filtern" />
    <Input placeholder="Felder filtern/sortieren" />
    <InputGroupAddon addonType="append">
      &nbsp;
      <i className="fas fa-times" />
    </InputGroupAddon>
  </InputGroup>
)

export default Filter
