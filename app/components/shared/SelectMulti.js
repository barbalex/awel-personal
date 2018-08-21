// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label } from 'reactstrap'
import Select from 'react-select'
import styled from 'styled-components'

const StyledSelect = styled(Select)`
  height: 38px;
  > div > div > div {
    top: 46% !important;
  }
  > div {
    background-color: rgba(255, 255, 255, 1) !important;
  }
  > div:focus-within {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  > div:hover {
    border-color: rgb(204, 204, 204);
  }
`

const enhance = compose(
  withHandlers({
    onChange: ({ addEtikett, deleteEtikett }) => (option, action) => {
      if (action.action === 'select-option') addEtikett(action.option.value)
      if (action.action === 'remove-value')
        deleteEtikett(action.removedValue.value)
    }
  }),
  observer
)

const SharedSelectMulti = ({
  value,
  field,
  label,
  options,
  onChange
}: {
  value?: Array<Object>,
  field: string,
  label: string,
  options: Array<Object>,
  onChange: () => void
}) => (
  <FormGroup row>
    <Label for={field} sm={2}>
      {label}
    </Label>
    <Col sm={10}>
      <StyledSelect
        id={field}
        name={field}
        isMulti
        defaultValue={value}
        options={options}
        onChange={onChange}
        hideSelectedOptions
        placeholder=""
        isClearable={false}
        isSearchable
        noOptionsMessage={() => '(keine)'}
      />
    </Col>
  </FormGroup>
)

export default enhance(SharedSelectMulti)
