// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label, Input } from 'reactstrap'

const enhance = compose(
  withState('stateValue', 'setStateValue', ({ value }) => !!value),
  withHandlers({
    onChange: ({ saveToDb, field, stateValue, setStateValue }) => () => {
      const newValue = !stateValue
      saveToDb({ value: newValue ? 1 : 0, field })
      return setStateValue(newValue)
    }
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        props.setStateValue(!!props.value)
      }
    }
  }),
  observer
)

const SharedCheckbox = ({
  value,
  field,
  label,
  onChange
}: {
  value: number,
  field: string,
  label: string,
  onChange: () => void
}) => (
  <FormGroup row>
    <Label for={field} sm={2}>
      {label}
    </Label>
    <Col sm={{ size: 10 }}>
      <FormGroup check>
        <Label check>
          <Input
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

export default enhance(SharedCheckbox)
