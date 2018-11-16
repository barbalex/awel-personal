// @flow
import React, { useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, Input } from 'reactstrap'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  position: relative;
  top: 10px;
`

const SharedCheckbox = ({
  value,
  field,
  label,
  saveToDb
}: {
  value: number,
  field: string,
  label: string,
  saveToDb: () => void
}) => {
  const [stateValue, setStateValue] = useState(!!value)
  const onChange = useCallback(
    () => {
      const newValue = !stateValue
      saveToDb({ value: newValue ? 1 : 0, field })
      return setStateValue(newValue)
    },
    [stateValue, field]
  )
  useEffect(() => {
    setStateValue(!!value)
  })

  return (
    <FormGroup row>
      <Label for={field} sm={2}>
        {label}
      </Label>
      <Col sm={{ size: 10 }}>
        <FormGroup check>
          <Label check>
            <StyledInput
              id={field}
              type="checkbox"
              checked={value === 1}
              onChange={onChange}
            />
          </Label>
        </FormGroup>
      </Col>
    </FormGroup>
  )
}

export default observer(SharedCheckbox)
