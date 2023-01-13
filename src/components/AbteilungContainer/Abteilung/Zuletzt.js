import React from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import styled from 'styled-components'

const Value = styled.div`
  padding-top: 7px;
`

moment.locale('de')

const Zuletzt = ({ abteilung }) => (
  <FormGroup row>
    <Label for="letzteAenderung" sm={2}>
      Zuletzt geändert
    </Label>
    <Col sm={10}>
      <Value name="letzteAenderung">
        {`${
          moment.unix(abteilung.letzteMutationZeit / 1000).isValid()
            ? moment
                .unix(abteilung.letzteMutationZeit / 1000)
                .format('DD.MM.YYYY H:mm:ss')
            : ''
        }, ${abteilung.letzteMutationUser || ''}`}
      </Value>
    </Col>
  </FormGroup>
)

export default Zuletzt
