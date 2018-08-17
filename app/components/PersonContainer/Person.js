// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Form } from 'reactstrap'

import Input from '../shared/Input'

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

  const { personen } = store
  const person = personen.find(p => p.id === activeId) || {}

  return (
    <Container>
      <StyledForm>
        <Input
          value={person.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
        />
        <Input
          value={person.vorname}
          field="vorname"
          label="Vorname"
          saveToDb={saveToDb}
        />
        <Input
          value={person.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
        />
        <Input
          value={person.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
        />
        <Input
          value={person.telefonNrMobile}
          field="telefonNrMobile"
          label="Telefon mobile"
          saveToDb={saveToDb}
        />
        <Input
          value={person.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
        />
        <Input
          value={person.geburtDatum}
          field="geburtDatum"
          label="Geburtsdatum"
          saveToDb={saveToDb}
        />
        <Input
          value={person.bueroNr}
          field="bueroNr"
          label="Büro Nr."
          saveToDb={saveToDb}
        />
        <Input
          value={person.abteilung}
          field="abteilung"
          label="Abteilung"
          saveToDb={saveToDb}
        />
        <Input
          value={person.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          saveToDb={saveToDb}
        />
        <Input
          value={person.vorgesetztId}
          field="vorgesetztId"
          label="Vorgesetzte(r)"
          saveToDb={saveToDb}
        />
        <Input
          value={person.eintrittDatum}
          field="eintrittDatum"
          label="Eintritt Datum"
          saveToDb={saveToDb}
        />
        <Input
          value={person.austrittDatum}
          field="austrittDatum"
          label="Austritt Datum"
          saveToDb={saveToDb}
        />
        <Input
          value={person.status}
          field="status"
          label="Status"
          saveToDb={saveToDb}
        />
        <Input
          value={person.parkplatzNr}
          field="parkplatzNr"
          label="Parkplatz Nr."
          saveToDb={saveToDb}
        />
        <Input
          value={person.parkplatzBeitrag}
          field="parkplatzBeitrag"
          label="Parkplatz Beitrag"
          saveToDb={saveToDb}
        />
        <Input
          value={person.geschlecht}
          field="geschlecht"
          label="Geschlecht"
          saveToDb={saveToDb}
        />
        <Input
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
