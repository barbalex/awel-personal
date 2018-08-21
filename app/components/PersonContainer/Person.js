// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'

import Input from '../shared/Input'
import Date from '../shared/Date'
import Select from '../shared/Select'
import SharedCheckbox from '../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import isDateField from '../../src/isDateField'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    saveToDb: ({ store }) => ({ field, value }) => {
      const location = store.location.toJSON()
      const activeId = ifIsNumericAsNumber(location[1])
      const { personen } = store
      const person = personen.find(p => p.id === activeId)
      if (!person) throw new Error(`Person with id ${activeId} not found`)
      let newValue
      if (isDateField(field)) {
        if (value) newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        if (newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      store.updateField({
        table: 'person',
        parentModel: 'personen',
        field,
        value: newValue,
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

  const { personen, showDeleted, statusWerte, geschlechtWerte } = store
  const person = personen.find(p => p.id === activeId) || {}
  const statusOptions = sortBy(statusWerte, 'sort').map(w => ({
    label: w.value,
    value: w.value
  }))
  const geschlechtOptions = sortBy(geschlechtWerte, 'sort').map(w => ({
    label: w.value,
    value: w.value
  }))

  return (
    <Container>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${person.id}deleted`}
            value={person.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
          />
        )}
        <Input
          key={`${person.id}name`}
          value={person.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}vorname`}
          value={person.vorname}
          field="vorname"
          label="Vorname"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}kurzzeichen`}
          value={person.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}telefonNr`}
          value={person.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}telefonNrMobile`}
          value={person.telefonNrMobile}
          field="telefonNrMobile"
          label="Telefon mobile"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}email`}
          value={person.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
        />
        <Date
          key={`${person.id}geburtDatum`}
          value={person.geburtDatum}
          field="geburtDatum"
          label="Geburtsdatum"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}bueroNr`}
          value={person.bueroNr}
          field="bueroNr"
          label="Büro Nr."
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}abteilung`}
          value={person.abteilung}
          field="abteilung"
          label="Abteilung"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}kostenstelle`}
          value={person.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}vorgesetztId`}
          value={person.vorgesetztId}
          field="vorgesetztId"
          label="Vorgesetzte(r)"
          saveToDb={saveToDb}
        />
        <Date
          key={`${person.id}eintrittDatum`}
          value={person.eintrittDatum}
          field="eintrittDatum"
          label="Eintritt Datum"
          saveToDb={saveToDb}
        />
        <Date
          key={`${person.id}austrittDatum`}
          value={person.austrittDatum}
          field="austrittDatum"
          label="Austritt Datum"
          saveToDb={saveToDb}
        />
        <Select
          key={`${person.id}status`}
          value={person.status}
          field="status"
          label="Status"
          options={statusOptions}
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}parkplatzNr`}
          value={person.parkplatzNr}
          field="parkplatzNr"
          label="Parkplatz Nr."
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}parkplatzBeitrag`}
          value={person.parkplatzBeitrag}
          field="parkplatzBeitrag"
          label="Parkplatz Beitrag"
          saveToDb={saveToDb}
        />
        <Select
          key={`${person.id}geschlecht`}
          value={person.geschlecht}
          field="geschlecht"
          label="Geschlecht"
          options={geschlechtOptions}
          saveToDb={saveToDb}
        />
        <Input
          key={`${person.id}bemerkungen`}
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
