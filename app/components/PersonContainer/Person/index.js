// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'

import Input from '../../shared/Input'
import Date from '../../shared/Date'
import Select from '../../shared/Select'
import SelectMulti from '../../shared/SelectMulti'
import SharedCheckbox from '../../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import isDateField from '../../../src/isDateField'
import Links from './Links'
import Schluessels from './Schluessels'
import MobileAbos from './MobileAbos'
import KaderFunktionen from './KaderFunktionen'
import Zuletzt from './Zuletzt'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    saveToDb: ({ store }) => ({ field, value }) => {
      const { personen, filterPerson, showFilter, setFilter } = store
      const location = store.location.toJSON()
      if (!location[1] && !showFilter) throw new Error(`no id found`)
      const activeId = ifIsNumericAsNumber(location[1])
      const person = personen.find(p => p.id === activeId)
      if (!person && !showFilter)
        throw new Error(`Person with id ${activeId} not found`)
      let newValue
      if (isDateField(field)) {
        if (value) newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        if (newValue && newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      if (showFilter) {
        setFilter({
          model: 'filterPerson',
          value: { ...filterPerson, ...{ [field]: newValue } }
        })
      } else {
        store.updateField({
          table: 'personen',
          parentModel: 'personen',
          field,
          value: newValue,
          id: person.id
        })
      }
    },
    addEtikett: ({ store }) => etikett => store.addEtikett(etikett),
    deleteEtikett: ({ store }) => etikett => store.deleteEtikett(etikett)
  }),
  observer
)

const Person = ({
  store,
  activeId,
  saveToDb,
  addEtikett,
  deleteEtikett
}: {
  store: Object,
  activeId: ?number,
  saveToDb: () => void,
  addEtikett: () => void,
  deleteEtikett: () => void
}) => {
  const {
    personen,
    etiketten,
    showDeleted,
    abteilungWerte,
    kostenstelleWerte,
    statusWerte,
    geschlechtWerte,
    etikettWerte,
    showFilter,
    filterPerson
  } = store
  if (!showFilter && !activeId) return null

  let person
  if (showFilter) {
    person = filterPerson
  } else {
    person = personen.find(p => p.id === activeId)
    if (!person) person = {}
  }
  // console.log('Person, render, person:', person.toJSON())
  const personId = showFilter ? '' : person.id
  // filter out options with empty values - makes no sense and errors
  const personOptions = sortBy(personen, ['name', 'vorname'])
    .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
    .filter(w => !showFilter && w.id !== person.id)
    .map(w => ({
      label: `${w.name} ${w.vorname}`,
      value: w.id
    }))
  const abteilungOptions = sortBy(abteilungWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))
  const kostenstelleOptions = sortBy(kostenstelleWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))
  const statusOptions = sortBy(statusWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))
  const geschlechtOptions = sortBy(geschlechtWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))
  const etikettenOptions = sortBy(etikettWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))
  const myEtiketten = sortBy(
    etiketten.filter(e => e.idPerson === activeId),
    'etikett'
  )
    .filter(w => !!w.etikett)
    .map(e => ({
      label: e.etikett,
      value: e.etikett
    }))

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${personId}deleted`}
            value={person.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
          />
        )}
        <Input
          key={`${personId}name`}
          value={person.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}vorname`}
          value={person.vorname}
          field="vorname"
          label="Vorname"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}kurzzeichen`}
          value={person.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}telefonNr`}
          value={person.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}telefonNrMobile`}
          value={person.telefonNrMobile}
          field="telefonNrMobile"
          label="Telefon mobile"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}email`}
          value={person.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
        />
        <Date
          key={`${personId}geburtDatum`}
          value={person.geburtDatum}
          field="geburtDatum"
          label="Geburtsdatum"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}bueroNr`}
          value={person.bueroNr}
          field="bueroNr"
          label="Büro Nr."
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}abteilung`}
          value={person.abteilung}
          field="abteilung"
          label="Abteilung"
          options={abteilungOptions}
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}kostenstelle`}
          value={person.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={kostenstelleOptions}
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}vorgesetztId`}
          value={person.vorgesetztId}
          field="vorgesetztId"
          label="Vorgesetzte(r)"
          options={personOptions}
          saveToDb={saveToDb}
        />
        <Date
          key={`${personId}eintrittDatum`}
          value={person.eintrittDatum}
          field="eintrittDatum"
          label="Eintritt Datum"
          saveToDb={saveToDb}
        />
        <Date
          key={`${personId}austrittDatum`}
          value={person.austrittDatum}
          field="austrittDatum"
          label="Austritt Datum"
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}status`}
          value={person.status}
          field="status"
          label="Status"
          options={statusOptions}
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}parkplatzNr`}
          value={person.parkplatzNr}
          field="parkplatzNr"
          label="Parkplatz Nr."
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}parkplatzBeitrag`}
          value={person.parkplatzBeitrag}
          field="parkplatzBeitrag"
          label="Parkplatz Beitrag"
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}geschlecht`}
          value={person.geschlecht}
          field="geschlecht"
          label="Geschlecht"
          options={geschlechtOptions}
          saveToDb={saveToDb}
        />
        <SelectMulti
          key={`${personId}etikett`}
          value={myEtiketten}
          field="etikett"
          label="Etiketten"
          options={etikettenOptions}
          addEtikett={addEtikett}
          deleteEtikett={deleteEtikett}
        />
        <Input
          key={`${personId}bemerkungen`}
          value={person.bemerkungen}
          field="bemerkungen"
          label="Bemerkungen"
          saveToDb={saveToDb}
          type="textarea"
        />
        {!showFilter && <Links />}
        <Schluessels />
        <MobileAbos />
        <KaderFunktionen />
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default enhance(Person)
