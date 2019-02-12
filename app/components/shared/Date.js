import React, { useState, useCallback, useEffect } from 'react'
import {
  Col,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  FormFeedback,
} from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaCalendarAlt } from 'react-icons/fa'

moment.locale('de')

const StyledFormGroup = styled(FormGroup)`
  grid-column: 1;
  margin-bottom: ${props => (props.row ? 'unset' : '8px !important')};
  .react-datepicker-popper {
    z-index: 10;
  }
  .react-datepicker {
    font-size: 1em;
  }
  .react-datepicker__header {
    padding-top: 0.8em;
  }
  .react-datepicker__month {
    margin: 0.4em 1em;
  }
  .react-datepicker__day-name,
  .react-datepicker__day {
    width: 1.9em;
    line-height: 1.9em;
    margin: 0.166em;
  }
  .react-datepicker__current-month {
    font-size: 1em;
  }
  .react-datepicker__navigation {
    top: 1em;
    line-height: 1.7em;
    border: 0.45em solid transparent;
  }
  .react-datepicker__navigation--previous {
    border-right-color: #ccc;
    left: 1em;
  }
  .react-datepicker__navigation--next {
    border-left-color: #ccc;
    right: 1em;
  }
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledInputGroupAddon = styled(InputGroupAddon)`
  cursor: pointer;
`

const DateField = ({ value, field, label, saveToDb, error, row = true }) => {
  const [open, setOpen] = useState(false)
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )

  const onChange = useCallback(async event => {
    setStateValue(event.target.value)
    return null
  })
  const onBlur = useCallback(
    event => {
      let newValue = event.target.value
      // save nulls if empty
      if (newValue === '') newValue = null
      // only save if value has changed
      if (!newValue && !value && value !== 0 && newValue !== 0) return
      if (newValue === value) return
      saveToDb({ value: newValue, field })
    },
    [value, field],
  )
  const openPicker = useCallback(() => setOpen(true))
  const closePicker = useCallback(() => setOpen(false))
  const onChangeDatePicker = useCallback(async date => {
    const myEvent = {
      target: {
        value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY'),
      },
    }
    await onChange(myEvent)
    onBlur(myEvent)
    setOpen(false)
  })

  // without lifecycle state value does not immediately update
  // after user enters new date
  useEffect(() => setStateValue(value || value === 0 ? value : ''), [value])

  const Inner = () => (
    <InputGroup>
      <Input
        id={field}
        type="text"
        name={field}
        value={stateValue}
        onChange={onChange}
        onBlur={onBlur}
        invalid={!!error}
      />
      <StyledInputGroupAddon
        addonType="append"
        id="datePickerInputGroup"
        onClick={openPicker}
      >
        <span className="input-group-text">
          <FaCalendarAlt />
        </span>
        {open && (
          <DatePicker
            selected={
              moment(stateValue, 'DD.MM.YYYY').isValid()
                ? moment(stateValue, 'DD.MM.YYYY').toDate()
                : null
            }
            onChange={onChangeDatePicker}
            dateFormat="DD.MM.YYYY"
            withPortal
            inline
            onClickOutside={closePicker}
          />
        )}
      </StyledInputGroupAddon>
      <FormFeedback>{error}</FormFeedback>
    </InputGroup>
  )

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for={field} sm={2}>
            {label}
          </Label>
          <Col sm={10}>
            <Inner />
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for={field}>{label}</NonRowLabel>
          <Inner />
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(DateField)
