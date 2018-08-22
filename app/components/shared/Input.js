// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label, Input } from 'reactstrap'

const enhance = compose(
  withState(
    'stateValue',
    'setStateValue',
    ({ value }) => (value || value === 0 ? value : '')
  ),
  withHandlers({
    onChange: ({ setStateValue }) => event => setStateValue(event.target.value),
    onBlur: ({ saveToDb, field, value }) => event => {
      let newValue = event.target.value
      // save nulls if empty
      if (newValue === '') newValue = null
      // only save if value has changed
      if (!newValue && !value && value !== 0 && newValue !== 0) return
      if (newValue === value) return
      saveToDb({ value: newValue, field })
    }
  }),
  withHandlers({
    onChangeDatePicker: ({ onBlur }) => (name, date) => {
      onBlur({
        target: {
          value: date
        }
      })
    }
  }),
  observer
)

const SharedInput = ({
  stateValue,
  field,
  label,
  type = 'text',
  placeholder = '',
  disabled = false,
  onChange,
  onBlur
}: {
  stateValue: number | string,
  field: string,
  label: string,
  type?: string,
  placeholder?: string,
  disabled?: boolean,
  onChange: () => void,
  onBlur: () => void
}) => (
  <FormGroup row>
    <Label for={field} sm={2}>
      {label}
    </Label>
    <Col sm={10}>
      <Input
        id={field}
        type={type}
        name={field}
        placeholder={placeholder}
        disabled={disabled}
        value={stateValue}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Col>
  </FormGroup>
)

export default enhance(SharedInput)
