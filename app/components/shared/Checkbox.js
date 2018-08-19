// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { observer } from 'mobx-react'
import { Col, FormGroup, Label, Input } from 'reactstrap'

const enhance = compose(
  withHandlers({
    onChange: ({ saveToDb, field }) => event =>
      saveToDb({ value: event.target.value, field })
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
          <Input id={field} type="checkbox" value={value} onChange={onChange} />
        </Label>
      </FormGroup>
    </Col>
  </FormGroup>
)

export default enhance(SharedCheckbox)
