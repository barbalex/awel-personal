import React from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import styled from 'styled-components'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) => (props['data-row'] ? 'unset' : '2px !important')};
  display: flex;
`
const Value = styled.div`
  padding-top: 7px;
`

moment.locale('de')

const Zuletzt = ({ noBottomMargin = true, row }) => (
  <StyledFormGroup data-row={noBottomMargin}>
    <Label for="letzteAenderung" sm={2}>
      Zuletzt geändert
    </Label>
    <Col sm={10}>
      <Value name="letzteAenderung">
        {`${
          row
            ? moment.unix(row.letzteMutationZeit / 1000).isValid()
              ? moment
                  .unix(row.letzteMutationZeit / 1000)
                  .format('DD.MM.YYYY H:mm:ss')
              : ''
            : ''
        }, ${row.letzteMutationUser || ''}`}
      </Value>
    </Col>
  </StyledFormGroup>
)

export default Zuletzt
