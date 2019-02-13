import React, { useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  position: relative;
  top: ${props => (props['data-row'] ? '10px' : '1px')};
  /* larger-sized Checkboxes */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  padding: 10px;
  margin-left: -1.1rem !important;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? 'unset' : '8px !important')};
`
const LabelSpan = styled.span`
  padding-left: 5px;
`

const SharedCheckbox = ({
  value,
  field,
  label,
  saveToDb,
  error,
  row = true,
}) => {
  const [stateValue, setStateValue] = useState(!!value)
  const onChange = useCallback(() => {
    const newValue = !stateValue
    saveToDb({ value: newValue ? 1 : 0, field })
    return setStateValue(newValue)
  }, [stateValue, field])

  useEffect(() => {
    setStateValue(!!value)
  })

  const Content = () => (
    <StyledFormGroup check>
      <Label check>
        <StyledInput
          id={field}
          type="checkbox"
          checked={value === 1}
          onChange={onChange}
          invalid={!!error}
          data-row={row}
        />
        {!row && <LabelSpan>{` ${label}`}</LabelSpan>}
      </Label>
      <FormFeedback>{error}</FormFeedback>
    </StyledFormGroup>
  )

  if (row) {
    return (
      <FormGroup row={row}>
        <Label for={field} sm={2}>
          {label}
        </Label>
        <Col sm={{ size: 10 }}>
          <Content />
        </Col>
      </FormGroup>
    )
  }

  return <Content />
}

export default observer(SharedCheckbox)
