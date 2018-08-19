// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Form, Label, Input, FormGroup, Col } from 'reactstrap'

import MyInput from '../shared/Input'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    saveToDb: ({ store }) => ({ field, value }) => {
      const location = store.location.toJSON()
      let activeId = location[1]
      if (!isNaN(activeId)) activeId = +activeId
      const { personen } = store
      const person = personen.find(p => p.id === activeId) || {}

      person.setField({
        field,
        value,
        id: person.id
      })
    }
  }),
  observer
)

const Person = ({
  store,
  activeId,
  saveToDb
}: {
  store: Object,
  activeId: ?number,
  saveToDb: () => void
}) => {
  if (!activeId) return null

  const { personen, showDeleted } = store
  const person = personen.find(p => p.id === activeId) || {}

  return (
    <Container>
      <StyledForm>
        {showDeleted && (
          <FormGroup row>
            <Label for="checkbox2" sm={2}>
              gelöscht
            </Label>
            <Col sm={{ size: 10 }}>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" id="checkbox2" value={person.deleted} />
                </Label>
              </FormGroup>
            </Col>
          </FormGroup>
        )}
        <MyInput
          value={person.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.vorname}
          field="vorname"
          label="Vorname"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.telefonNrMobile}
          field="telefonNrMobile"
          label="Telefon mobile"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.geburtDatum}
          field="geburtDatum"
          label="Geburtsdatum"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.bueroNr}
          field="bueroNr"
          label="Büro Nr."
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.abteilung}
          field="abteilung"
          label="Abteilung"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.vorgesetztId}
          field="vorgesetztId"
          label="Vorgesetzte(r)"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.eintrittDatum}
          field="eintrittDatum"
          label="Eintritt Datum"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.austrittDatum}
          field="austrittDatum"
          label="Austritt Datum"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.status}
          field="status"
          label="Status"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.parkplatzNr}
          field="parkplatzNr"
          label="Parkplatz Nr."
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.parkplatzBeitrag}
          field="parkplatzBeitrag"
          label="Parkplatz Beitrag"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.geschlecht}
          field="geschlecht"
          label="Geschlecht"
          saveToDb={saveToDb}
        />
        <MyInput
          value={person.bemerkungen}
          field="bemerkungen"
          label="Bemerkungen"
          saveToDb={saveToDb}
          type="textarea"
        />
      </StyledForm>
    </Container>
  )
}

export default enhance(Person)
