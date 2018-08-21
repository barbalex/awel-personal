// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label } from 'reactstrap'
import Select from 'react-select'

const enhance = compose(
  withHandlers({
    onChange: ({ saveToDb, field }) => option => {
      console.log('Select, onChange, event:', option)
      saveToDb({ value: option ? option.value : null, field })
    }
  }),
  observer
)

const SharedSelect = ({
  value,
  field,
  label,
  options,
  placeholder = '',
  onChange
}: {
  value?: ?number | ?string,
  field: string,
  label: string,
  options: Array<Object>,
  placeholder?: string,
  onChange: () => void
}) => {
  const option = options.find(o => o.value === value)
  console.log('Select, render:', { option, value })
  return (
    <FormGroup row>
      <Label for={field} sm={2}>
        {label}
      </Label>
      <Col sm={10}>
        <Select
          id={field}
          name={field}
          placeholder={placeholder}
          defaultValue={option}
          options={options}
          onChange={onChange}
          hideSelectedOptions
          isClearable
          isSearchable
        />
      </Col>
    </FormGroup>
  )
}

export default enhance(SharedSelect)
