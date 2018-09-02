// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { inject, observer } from 'mobx-react'
import { Input } from 'reactstrap'

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
  observer
)

const SharedInputWithoutLabel = ({
  stateValue,
  field,
  type = 'text',
  rows = 1,
  placeholder = '',
  disabled = false,
  onChange,
  onBlur
}: {
  stateValue: number | string,
  field: string,
  type?: string,
  rows?: number,
  placeholder?: string,
  disabled?: boolean,
  onChange: () => void,
  onBlur: () => void
}) => (
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
)

export default enhance(SharedInputWithoutLabel)
