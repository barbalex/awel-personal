// @flow
import React, { useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'

import storeContext from '../../storeContext'

const SharedInput = ({
  value,
  field,
  label,
  type = 'text',
  rows = 1,
  placeholder = '',
  disabled = false,
  saveToDb,
  error,
}: {
  value: number | string,
  field: string,
  label?: string,
  type?: string,
  rows?: number,
  placeholder?: string,
  disabled?: boolean,
  saveToDb: () => void,
  error: string,
}) => {
  const store = useContext(storeContext)
  const { showFilter } = store
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )

  const onBlur = useCallback(event => {
    let newValue = event.target.value
    // save nulls if empty
    if (newValue === '') newValue = null
    // only save if value has changed
    if (!newValue && !value && value !== 0 && newValue !== 0) return
    if (newValue === value) return
    saveToDb({ value: newValue, field })
  }, [field])
  const onChange = useCallback(event => {
    setStateValue(event.target.value)
    if (showFilter) {
      // call onBlur to immediately update filters
      onBlur(event)
    }
  }, [showFilter])

  // need this check because of filtering:
  // when filter is emptied, value needs to reset
  useEffect(() => setStateValue(value || value === 0 ? value : ''), [value])

  !!error && console.log({ error })

  return (
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
          invalid={!!error}
        />
        <FormFeedback>{error}</FormFeedback>
      </Col>
    </FormGroup>
  )
}

export default observer(SharedInput)
