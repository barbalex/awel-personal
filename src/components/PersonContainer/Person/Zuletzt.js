import React from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import styled from 'styled-components'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) => (props.row ? 'unset' : '2px !important')};
`
const Value = styled.div`
  padding-top: 7px;
`

moment.locale('de')

const Zuletzt = ({ row = true, person }) => (
  <StyledFormGroup row={row}>
    <Label for="letzteAenderung" sm={2}>
      Zuletzt geändert
    </Label>
    <Col sm={10}>
      <Value name="letzteAenderung">
        {`${
          person
            ? moment.unix(person.letzteMutationZeit / 1000).isValid()
              ? moment
                  .unix(person.letzteMutationZeit / 1000)
                  .format('DD.MM.YYYY H:mm:ss')
              : ''
            : ''
        }, ${person.letzteMutationUser || ''}`}
      </Value>
    </Col>
  </StyledFormGroup>
)

export default Zuletzt
