// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label } from 'reactstrap'
import Select from 'react-select'

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
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        const value = props.value || props.value === 0 ? props.value : ''
        props.setStateValue(value)
      }
    }
  }),
  observer
)

const SharedSelect = ({
  stateValue,
  field,
  label,
  options,
  placeholder = '',
  onChange,
  onBlur
}: {
  stateValue: number | string,
  field: string,
  label: string,
  options: Array<Object>,
  placeholder?: string,
  onChange: () => void,
  onBlur: () => void
}) => (
  <FormGroup row>
    <Label for={field} sm={2}>
      {label}
    </Label>
    <Col sm={10}>
      <Select
        id={field}
        name={field}
        placeholder={placeholder}
        value={stateValue}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
        hideSelectedOptions
        isClearable
      />
    </Col>
  </FormGroup>
)

export default enhance(SharedSelect)
