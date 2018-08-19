// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label, Input } from 'reactstrap'

const enhance = compose(
  withState(
    'stateValue',
    'setStateValue',
    ({ value }) => (value || value === 0 ? value : '')
  ),
  withHandlers({
    onChange: ({ setStateValue }) => event => setStateValue(event.target.value),
    onBlur: ({ saveToDb, field, value, stateValue }) => event => {
      console.log({ value, evTValue: event.target.value, stateValue })
      if (event.target.value == value) return
      saveToDb({ value: event.target.value || '', field })
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

const SharedInput = ({
  stateValue,
  field,
  label,
  type = 'text',
  placeholder = '',
  onChange,
  onBlur
}: {
  stateValue: number | string,
  field: string,
  label: string,
  type?: string,
  placeholder?: string,
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
        value={stateValue}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Col>
  </FormGroup>
)

export default enhance(SharedInput)
