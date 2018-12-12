// @flow
import React, { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import { getSnapshot } from 'mobx-state-tree'

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
import storeContext from '../../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Person = ({ activeId }: { activeId: ?number }) => {
  const store = useContext(storeContext)
  const {
    personen,
    abteilungen,
    sektionen,
    etiketten,
    showDeleted,
    statusWerte,
    geschlechtWerte,
    etikettWerte,
    showFilter,
    filterPerson,
    filterEtikett,
    existsFilter,
    setFilter,
  } = store

  let person
  if (showFilter) {
    person = filterPerson
  } else {
    person = personen.find(p => p.id === activeId)
    if (!person) person = {}
  }
  const personId = showFilter ? '' : person.id

  const saveToDb = useCallback(
    ({ field, value }) => {
      // const person = personen.find(p => p.id === activeId)
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
          value: { ...filterPerson, ...{ [field]: newValue } },
        })
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          setFilter({
            model: 'filterPerson',
            value: { ...filterPerson, ...{ sektion: null } },
          })
        }
      } else {
        store.updateField({
          table: 'personen',
          parentModel: 'personen',
          field,
          value: newValue,
          id: person.id,
        })
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          store.updateField({
            table: 'personen',
            parentModel: 'personen',
            field: 'sektion',
            value: null,
            id: person.id,
          })
        }
      }
    },
    [activeId, personen.length, filterPerson, showFilter],
  )
  const addEtikett = useCallback(
    etikett => {
      if (showFilter) {
        setFilter({
          model: 'filterEtikett',
          value: { ...filterEtikett, ...{ etikett } },
        })
      } else {
        store.addEtikett(etikett)
      }
    },
    [showFilter, filterEtikett],
  )
  const deleteEtikett = useCallback(
    etikett => {
      if (showFilter) {
        setFilter({
          model: 'filterEtikett',
          value: { ...filterEtikett, ...{ etikett: null } },
        })
      } else {
        store.deleteEtikett(etikett)
      }
    },
    [filterEtikett, showFilter],
  )
  const saveToDbEtikett = useCallback(
    ({ value }) => {
      if (value) {
        return setFilter({
          model: 'filterEtikett',
          value: { ...filterEtikett, ...{ etikett: value } },
        })
      }
      setFilter({
        model: 'filterEtikett',
        value: { ...filterEtikett, ...{ etikett: null } },
      })
    },
    [filterEtikett],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== person.id)
        .map(w => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [personen.length],
  )
  const abteilungOptions = useMemo(
    () =>
      sortBy(abteilungen, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [abteilungen.length],
  )
  const sektionOptions = useMemo(
    () =>
      sortBy(sektionen, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .filter(w => {
          if (person.abteilung) {
            return w.abteilung === person.abteilung
          }
          return true
        })
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [sektionen.length, person.abteilung],
  )
  const statusOptions = useMemo(() =>
    sortBy(statusWerte, 'sort')
      .filter(w => !!w.value)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const geschlechtOptions = useMemo(() =>
    sortBy(geschlechtWerte, 'sort')
      .filter(w => !!w.value)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const etikettenOptions = useMemo(() =>
    sortBy(etikettWerte, 'sort')
      .filter(w => !!w.value)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const myEtiketten = useMemo(() =>
    sortBy(etiketten.filter(e => e.idPerson === activeId), 'etikett')
      .filter(w => !!w.etikett)
      .map(e => ({
        label: e.etikett,
        value: e.etikett,
      })),
  )

  console.log('Person', person ? getSnapshot(person) : person)

  if (!showFilter && !activeId) return null

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
          key={`${personId}adresse`}
          value={person.adresse}
          field="adresse"
          label="Adresse"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}plz`}
          value={person.plz}
          field="plz"
          label="PLZ"
          saveToDb={saveToDb}
          type="number"
        />
        <Input
          key={`${personId}ort`}
          value={person.ort}
          field="ort"
          label="Ort"
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}land`}
          value={person.land}
          field="land"
          label="Land"
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
          key={`${personId}${existsFilter ? 1 : 0}abteilung`}
          value={person.abteilung}
          field="abteilung"
          label="Abteilung"
          options={abteilungOptions}
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}sektion`}
          value={person.sektion}
          field="sektion"
          label="Sektion"
          options={sektionOptions}
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}vorgesetztId`}
          value={person.vorgesetztId}
          field="vorgesetztId"
          label="Vorgesetzte(r)"
          options={personOptions}
          saveToDb={saveToDb}
        />
        <Date
          key={`${personId}${existsFilter ? 1 : 0}eintrittDatum`}
          value={person.eintrittDatum}
          field="eintrittDatum"
          label="Eintritt Datum"
          saveToDb={saveToDb}
        />
        <Date
          key={`${personId}${existsFilter ? 1 : 0}austrittDatum`}
          value={person.austrittDatum}
          field="austrittDatum"
          label="Austritt Datum"
          saveToDb={saveToDb}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}status`}
          value={person.status}
          field="status"
          label="Status"
          options={statusOptions}
          saveToDb={saveToDb}
        />
        <Input
          key={`${personId}beschaeftigungsgrad`}
          value={person.beschaeftigungsgrad}
          field="beschaeftigungsgrad"
          label="Beschaeftigungsgrad (%)"
          saveToDb={saveToDb}
          type="number"
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
          key={`${personId}${existsFilter ? 1 : 0}geschlecht`}
          value={person.geschlecht}
          field="geschlecht"
          label="Geschlecht"
          options={geschlechtOptions}
          saveToDb={saveToDb}
        />
        {showFilter ? (
          <Select
            key={`${personId}${existsFilter ? 1 : 0}etikett`}
            value={filterEtikett.etikett}
            field="etikett"
            label="Etikett"
            options={etikettenOptions}
            saveToDb={saveToDbEtikett}
          />
        ) : (
          <SelectMulti
            key={`${personId}${existsFilter ? 1 : 0}etikett`}
            value={myEtiketten}
            field="etikett"
            label="Etiketten"
            options={etikettenOptions}
            addEtikett={addEtikett}
            deleteEtikett={deleteEtikett}
          />
        )}
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

export default observer(Person)
