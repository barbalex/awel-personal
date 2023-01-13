import React, { useContext } from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import storeContext from '../../../storeContext'

const Value = styled.div`
  padding-top: 7px;
`

moment.locale('de')

const Zuletzt = () => {
  const { bereichId } = useParams()

  const store = useContext(storeContext)
  const { bereiche } = store
  const bereich = bereiche.find((p) => p.id === bereichId)

  return (
    <FormGroup row>
      <Label for="letzteAenderung" sm={2}>
        Zuletzt geändert
      </Label>
      <Col sm={10}>
        <Value name="letzteAenderung">
          {`${
            moment.unix(bereich.letzteMutationZeit / 1000).isValid()
              ? moment
                  .unix(bereich.letzteMutationZeit / 1000)
                  .format('DD.MM.YYYY H:mm:ss')
              : ''
          }, ${bereich.letzteMutationUser || ''}`}
        </Value>
      </Col>
    </FormGroup>
  )
}

export default observer(Zuletzt)
