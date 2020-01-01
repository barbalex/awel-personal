import React, { useContext } from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import storeContext from '../../../storeContext'

const Value = styled.div`
  padding-top: 7px;
`

moment.locale('de')

const Zuletzt = () => {
  const store = useContext(storeContext)
  const { sektionen } = store
  const location = store.location.toJSON()
  if (!location[1]) throw new Error(`no id found`)
  const activeId = ifIsNumericAsNumber(location[1])
  const sektion = sektionen.find(p => p.id === activeId)

  return (
    <FormGroup row>
      <Label for="letzteAenderung" sm={2}>
        Zuletzt geändert
      </Label>
      <Col sm={10}>
        <Value name="letzteAenderung">
          {`${
            moment.unix(sektion.letzteMutationZeit / 1000).isValid()
              ? moment
                  .unix(sektion.letzteMutationZeit / 1000)
                  .format('DD.MM.YYYY H:mm:ss')
              : ''
          }, ${sektion.letzteMutationUser || ''}`}
        </Value>
      </Col>
    </FormGroup>
  )
}

export default observer(Zuletzt)
