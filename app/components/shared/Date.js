// @flow
import React from 'react'
import {
  Col,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'

moment.locale('de')

const StyledFormGroup = styled(FormGroup)`
  grid-column: 1;
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
const StyledDatePicker = styled(DatePicker)`
  cursor: pointer;
`

const enhance = compose(
  inject('store'),
  withState('open', 'setOpen', false),
  withState(
    'stateValue',
    'setStateValue',
    ({ value }) => (value || value === 0 ? value : '')
  ),
  withHandlers({
    onChange: ({ setStateValue }) => async event => {
      setStateValue(event.target.value)
      return null
    },
    onBlur: ({ saveToDb, field, value }) => event => {
      let newValue = event.target.value
      // save nulls if empty
      if (newValue === '') newValue = null
      // only save if value has changed
      if (!newValue && !value && value !== 0 && newValue !== 0) return
      if (newValue === value) return
      saveToDb({ value: newValue, field })
    },
    openPicker: ({ setOpen }) => () => setOpen(true),
    closePicker: ({ setOpen }) => () => setOpen(false)
  }),
  withHandlers({
    onChangeDatePicker: ({ onBlur, onChange, setOpen }) => async date => {
      const myEvent = {
        target: {
          value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')
        }
      }
      await onChange(myEvent)
      onBlur(myEvent)
      setOpen(false)
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

const DateField = ({
  open,
  openPicker,
  closePicker,
  stateValue,
  field,
  label,
  onChange,
  onChangeDatePicker,
  onBlur
}: {
  open: boolean,
  openPicker: () => void,
  closePicker: () => void,
  stateValue: number | string,
  field: string,
  label: string,
  onChange: () => void,
  onChangeDatePicker: () => void,
  onBlur: () => void
}) => (
  <StyledFormGroup row>
    <Label for={field} sm={2}>
      {label}
    </Label>
    <Col sm={10}>
      <InputGroup>
        <Input
          id={field}
          type="text"
          name={field}
          value={stateValue}
          onChange={onChange}
          onBlur={onBlur}
        />
        <InputGroupAddon
          addonType="append"
          id="datePickerInputGroup"
          onClick={openPicker}
        >
          <span className="input-group-text">
            <i className="far fa-calendar-alt" />
          </span>
          {open && (
            <StyledDatePicker
              selected={
                moment(stateValue, 'DD.MM.YYYY').isValid()
                  ? moment(stateValue, 'DD.MM.YYYY')
                  : null
              }
              onChange={onChangeDatePicker}
              dateFormat="DD.MM.YYYY"
              locale="de-CH"
              withPortal
              inline
              onClickOutside={closePicker}
            />
          )}
        </InputGroupAddon>
      </InputGroup>
    </Col>
  </StyledFormGroup>
)

export default enhance(DateField)
