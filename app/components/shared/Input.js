// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { inject, observer } from 'mobx-react'
import { Col, FormGroup, Label, Input } from 'reactstrap'

const enhance = compose(
  inject('store'),
  withState(
    'stateValue',
    'setStateValue',
    ({ value }) => (value || value === 0 ? value : '')
  ),
  withHandlers({
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
    onChange: ({ setStateValue, store, onBlur }) => event => {
      setStateValue(event.target.value)
      if (store.showFilter) {
        // call onBlur to immediately update filters
        onBlur(event)
      }
    }
  }),
  withLifecycle({
    // need this check because of filtering:
    // when filter is emptied, value needs to reset
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        const { setStateValue, value } = props
        setStateValue(value || value === 0 ? value : '')
      }
    }
  }),
  observer
)

const SharedInput = ({
  stateValue,
  field,
  label,
  type = 'text',
  rows = 1,
  placeholder = '',
  disabled = false,
  onChange,
  onBlur
}: {
  stateValue: number | string,
  field: string,
  label?: string,
  type?: string,
  rows?: number,
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
        rows={rows}
      />
    </Col>
  </FormGroup>
)

export default enhance(SharedInput)
