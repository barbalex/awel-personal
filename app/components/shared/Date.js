// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { Col, FormGroup, Label, Input, InputGroupAddon } from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
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
  observer
)

const DateField = ({
  store,
  name,
  label,
  change,
  blur,
  onChangeDatePicker,
  tabIndex
}) => {
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte
  } = store.geschaefte
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  /**
   * need to give addon no padding
   * and the originally addon's padding to the glyphicon
   * to make entire addon clickable
   * for opening calendar
   */
  const datePickerAddonStyle = {
    padding: 0
  }
  const datePickerCalendarStyle = {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12
  }

  return (
    <StyledFormGroup row>
      <Label for={field} sm={2}>
        {label}
      </Label>
      <Col sm={10}>
        <Input
          id={field}
          type="text"
          name={field}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <InputGroup.Addon style={datePickerAddonStyle}>
          <StyledDatePicker
            onChange={onChangeDatePicker.bind(this, name)}
            dateFormat="DD.MM.YYYY"
            locale="de-CH"
            customInput={
              <i className="far fa-calendar-alt" style={datePickerCalendarStyle} />
            }
            popperPlacement="top-end"
          />
        </InputGroup.Addon>
      </Col>
    </StyledFormGroup>
  )
}

DateField.displayName = 'DateField'

DateField.propTypes = {
  store: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  blur: PropTypes.func.isRequired,
  onChangeDatePicker: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired
}

export default enhance(DateField)
