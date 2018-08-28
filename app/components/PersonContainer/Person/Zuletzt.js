// @flow

import React from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'

import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'

moment.locale('de')

const enhance = compose(
  inject('store'),
  observer
)

const Zuletzt = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  if (!location[1]) throw new Error(`no id found`)
  const activeId = ifIsNumericAsNumber(location[1])
  const { personen } = store
  const person = personen.find(p => p.id === activeId)
  return (
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
                  .format('DD.MM.YYYY H:mm')
              : ''
          }, ${person.letzteMutationUser || ''}`}
        </div>
      </Col>
    </FormGroup>
  )
}

export default enhance(Zuletzt)
