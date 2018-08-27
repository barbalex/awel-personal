// @flow

import React from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'

const Zuletzt = ({ person }: { person: Object }) => (
  <FormGroup row>
    <Label for="letzteAenderung" sm={2}>
      Zuletzt geändert
    </Label>
    <Col sm={10}>
      <div name="letzteAenderung">
        {`${
          moment.unix(person.letzteMutationZeit / 1000).isValid()
            ? moment
                .unix(person.letzteMutationZeit / 1000)
                .format('DD.MM.YYYY hh:mm')
            : ''
        }, ${person.letzteMutationUser || ''}`}
      </div>
    </Col>
  </FormGroup>
)

export default Zuletzt
