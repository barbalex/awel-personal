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
  const { abteilungId } = useParams()
  const store = useContext(storeContext)
  const { abteilungen } = store

  const abteilung = abteilungen.find((p) => p.id === abteilungId)

  return (
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
}

export default observer(Zuletzt)
