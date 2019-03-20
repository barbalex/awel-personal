import React, { useState, useCallback, useEffect } from 'react'
import { Input, InputGroup, InputGroupAddon, FormFeedback } from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaCalendarAlt } from 'react-icons/fa'

moment.locale('de')

const Container = styled.div`
  grid-column: 1;
  display: flex;
  margin-bottom: 8px;
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
const StyledInputGroupAddon = styled(InputGroupAddon)`
  cursor: pointer;
`
const Label = styled.div`
  width: calc(16.667% + 8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Data = styled.div`
  display: flex;
  width: calc(83.332% - 10px);
`
const StyledInput = styled(Input)`
  position: relative !important;
  margin-left: 0 !important;
  margin-right: 20px;
  top: 8px;
  /* larger-sized Checkboxes */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  padding: 10px !important;
`

const DateField = ({
  mutationFristValue,
  mutationNoetigValue,
  label,
  saveToDb,
  errorMutationNoetig,
  errorMutationFrist,
}) => {
  const [mutationNoetigStateValue, setMutationNoetigStateValue] = useState(
    !!mutationNoetigValue,
  )
  const onChangeMutationNoetig = useCallback(() => {
    const newValue = !mutationNoetigStateValue
    saveToDb({ value: newValue ? 1 : 0, field: 'mutationNoetig' })
    return setMutationNoetigStateValue(newValue)
  }, [mutationNoetigStateValue])

  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [stateValue, setStateValue] = useState(
    mutationFristValue || mutationFristValue === 0 ? mutationFristValue : '',
  )

  const onChangeMutationFrist = useCallback(event => {
    setStateValue(event.target.value)
    return null
  })
  const onBlurMutationFrist = useCallback(
    event => {
      let newValue = event.target.value
      // save nulls if empty
      if (newValue === '') newValue = null
      // only save if value has changed
      if (
        !newValue &&
        !mutationFristValue &&
        mutationFristValue !== 0 &&
        newValue !== 0
      )
        return
      if (newValue === mutationFristValue) return
      saveToDb({ value: newValue, field: 'mutationFrist' })
    },
    [mutationFristValue],
  )
  const openPicker = useCallback(() => setOpenDatePicker(true))
  const closePicker = useCallback(() => setOpenDatePicker(false))
  const onChangeDatePicker = useCallback(date => {
    const myEvent = {
      target: {
        value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY'),
      },
    }
    onChangeMutationFrist(myEvent)
    onBlurMutationFrist(myEvent)
    setTimeout(() => setOpenDatePicker(false))
  })

  // without lifecycle state value does not immediately update
  // after user enters new date
  useEffect(
    () =>
      setStateValue(
        mutationFristValue || mutationFristValue === 0
          ? mutationFristValue
          : '',
      ),
    [mutationFristValue],
  )

  return (
    <Container>
      <Label htmlFor="mutationNoetig" sm={2}>
        {label}
      </Label>
      <Data>
        <StyledInput
          id="mutationNoetig"
          type="checkbox"
          checked={mutationNoetigValue === 1}
          onChange={onChangeMutationNoetig}
          invalid={!!errorMutationNoetig}
          title="Besteht Handlungsbedarf?"
        />
        <InputGroup>
          <Input
            id="mutationFrist"
            type="text"
            name="mutationFrist"
            value={stateValue}
            onChange={onChangeMutationFrist}
            onBlur={onBlurMutationFrist}
            invalid={!!errorMutationFrist}
            title="Frist"
          />
          <StyledInputGroupAddon
            addonType="append"
            id="datePickerInputGroup"
            onClick={openPicker}
            title="Kalender öffnen"
          >
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            {openDatePicker && (
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
          <FormFeedback>{errorMutationFrist}</FormFeedback>
        </InputGroup>
      </Data>
    </Container>
  )
}

export default observer(DateField)
