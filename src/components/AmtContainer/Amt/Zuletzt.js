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
  const { amtId } = useParams()

  const store = useContext(storeContext)
  const { aemter } = store

  const amt = aemter.find((p) => p.id === amtId)

  return (
    <FormGroup row>
      <Label for="letzteAenderung" sm={2}>
        Zuletzt geändert
      </Label>
      <Col sm={10}>
        <Value name="letzteAenderung">
          {`${
            moment.unix(amt.letzteMutationZeit / 1000).isValid()
              ? moment
                  .unix(amt.letzteMutationZeit / 1000)
                  .format('DD.MM.YYYY H:mm:ss')
              : ''
          }, ${amt.letzteMutationUser || ''}`}
        </Value>
      </Col>
    </FormGroup>
  )
}

export default observer(Zuletzt)
