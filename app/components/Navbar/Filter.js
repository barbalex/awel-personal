// @flow
import React from 'react'
import { InputGroup, InputGroupAddon, Input } from 'reactstrap'

const Filter = () => (
  <InputGroup>
    <Input placeholder="Volltext filtern" />
    <Input placeholder="Felder filtern/sortieren" />
    <InputGroupAddon addonType="append">X</InputGroupAddon>
  </InputGroup>
)

export default Filter
