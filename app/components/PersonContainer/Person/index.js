import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
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
import Telefones from './Telefones'
import Zuletzt from './Zuletzt'
import storeContext from '../../../storeContext'
import PersonImage from './PersonImage'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Person = ({ activeId, dimensions }) => {
  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    abteilungen,
    sektionen,
    bereiche,
    etiketten,
    funktionen,
    showDeleted,
    showMutationNoetig,
    statusWerte,
    anredeWerte,
    etikettWerte,
    funktionWerte,
    landWerte,
    showFilter,
    filterPerson,
    filterEtikett,
    filterFunktion,
    existsFilter,
    setFilter,
    updateField,
  } = store

  console.log('dimensions', dimensions)

  let person
  if (showFilter) {
    person = filterPerson
  } else {
    person = personen.find(p => p.id === activeId)
    if (!person) person = {}
  }
  const personId = showFilter ? '' : person.id

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [person])

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
        if (field === 'amt') {
          if (person.abteilung) {
            // reset abteilung
            setFilter({
              model: 'filterPerson',
              value: { ...filterPerson, ...{ abteilung: null } },
            })
          }
          if (person.sektion) {
            // reset sektion
            setFilter({
              model: 'filterPerson',
              value: { ...filterPerson, ...{ sektion: null } },
            })
          }
        }
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          setFilter({
            model: 'filterPerson',
            value: { ...filterPerson, ...{ sektion: null } },
          })
        }
      } else {
        updateField({
          table: 'personen',
          parentModel: 'personen',
          field,
          value: newValue,
          id: person.id,
          setErrors,
        })
        if (field === 'amt') {
          if (person.abteilung) {
            // reset abteilung
            updateField({
              table: 'personen',
              parentModel: 'personen',
              field: 'abteilung',
              value: null,
              id: person.id,
              setErrors,
            })
          }
          if (person.sektion) {
            // reset sektion
            updateField({
              table: 'personen',
              parentModel: 'personen',
              field: 'sektion',
              value: null,
              id: person.id,
              setErrors,
            })
          }
        }
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          updateField({
            table: 'personen',
            parentModel: 'personen',
            field: 'sektion',
            value: null,
            id: person.id,
            setErrors,
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

  const addFunktion = useCallback(
    funktion => {
      if (showFilter) {
        setFilter({
          model: 'filterFunktion',
          value: { ...filterFunktion, ...{ funktion } },
        })
      } else {
        store.addFunktion(funktion)
      }
    },
    [showFilter, filterFunktion],
  )
  const deleteFunktion = useCallback(
    funktion => {
      if (showFilter) {
        setFilter({
          model: 'filterFunktion',
          value: { ...filterFunktion, ...{ funktion: null } },
        })
      } else {
        store.deleteFunktion(funktion)
      }
    },
    [filterFunktion, showFilter],
  )
  const saveToDbFunktion = useCallback(
    ({ value }) => {
      if (value) {
        return setFilter({
          model: 'filterFunktion',
          value: { ...filterFunktion, ...{ funktion: value } },
        })
      }
      setFilter({
        model: 'filterFunktion',
        value: { ...filterFunktion, ...{ funktion: null } },
      })
    },
    [filterFunktion],
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
  const amtOptions = useMemo(
    () =>
      sortBy(aemter, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [aemter.length],
  )
  const abteilungOptions = useMemo(
    () =>
      sortBy(abteilungen, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .filter(w => {
          if (person.amt) {
            return w.amt === person.amt
          }
          return true
        })
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
    [sektionen.length, person.abteilung, person.amt],
  )
  const bereichOptions = useMemo(
    () =>
      sortBy(bereiche, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [bereiche.length],
  )
  const statusOptions = useMemo(() =>
    sortBy(statusWerte, ['sort', 'value'])
      .filter(p => p.deleted === 0)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const anredeOptions = useMemo(() =>
    sortBy(anredeWerte, ['sort', 'value'])
      .filter(p => p.deleted === 0)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const etikettenOptions = useMemo(() =>
    sortBy(etikettWerte, ['sort', 'value'])
      .filter(p => p.deleted === 0)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const funktionenOptions = useMemo(() =>
    sortBy(funktionWerte, ['sort', 'value'])
      .filter(p => p.deleted === 0)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const landOptions = useMemo(() =>
    sortBy(landWerte, ['sort', 'value'])
      .filter(p => p.deleted === 0)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const myEtiketten = useMemo(() =>
    sortBy(etiketten.filter(e => e.idPerson === activeId), 'etikett')
      .filter(w => !!w.etikett)
      .filter(p => p.deleted === 0)
      .map(e => ({
        label: e.etikett,
        value: e.etikett,
      })),
  )
  const myFunktionen = useMemo(() =>
    sortBy(funktionen.filter(e => e.idPerson === activeId), 'funktion')
      .filter(w => !!w.funktion)
      .filter(p => p.deleted === 0)
      .map(e => ({
        label: e.funktion,
        value: e.funktion,
      })),
  )

  if (!showFilter && !activeId) return null

  
  const WrapperNarrow = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 100%);
    grid-template-rows: auto;
    grid-template-areas:
      'areaNummern' 'areaGeschaeft' 'areaForGeschaeftsart' 'areaFristen' 'areaPersonen' 'areaLinks' 'areaHistory'
      'areaZuletztMutiert';
  `
  const WrapperWide = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 8.33333%);
    grid-template-rows: auto;
    grid-template-areas:
      'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
      'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart'
      'areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
      'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
      'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
      'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
  `
  const {width}=dimensions
  const viewIsNarrow = width < 860
  let Wrapper = viewIsNarrow ? WrapperNarrow : WrapperWide

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        <PersonImage person={person} />
        {showDeleted && (
          <SharedCheckbox
            key={`${personId}deleted`}
            value={person.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        <Input
          key={`${personId}name`}
          value={person.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
          error={errors.name}
        />
        <Input
          key={`${personId}vorname`}
          value={person.vorname}
          field="vorname"
          label="Vorname"
          saveToDb={saveToDb}
          error={errors.vorname}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}anrede`}
          value={person.anrede}
          field="anrede"
          label="Anrede"
          options={anredeOptions}
          saveToDb={saveToDb}
          error={errors.anrede}
        />
        <Input
          key={`${personId}kurzzeichen`}
          value={person.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
          error={errors.kurzzeichen}
        />
        <Input
          key={`${personId}adresse`}
          value={person.adresse}
          field="adresse"
          label="Adresse"
          saveToDb={saveToDb}
          error={errors.adresse}
        />
        <Input
          key={`${personId}plz`}
          value={person.plz}
          field="plz"
          label="PLZ"
          saveToDb={saveToDb}
          type="number"
          error={errors.plz}
        />
        <Input
          key={`${personId}ort`}
          value={person.ort}
          field="ort"
          label="Ort"
          saveToDb={saveToDb}
          error={errors.ort}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}land`}
          value={person.land}
          field="land"
          label="Land"
          options={landOptions}
          saveToDb={saveToDb}
          error={errors.land}
        />
        <Input
          key={`${personId}email`}
          value={person.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
          error={errors.email}
        />
        <Date
          key={`${personId}geburtDatum`}
          value={person.geburtDatum}
          field="geburtDatum"
          label="Geburtsdatum"
          saveToDb={saveToDb}
          error={errors.geburtDatum}
        />
        <Input
          key={`${personId}bueroNr`}
          value={person.bueroNr}
          field="bueroNr"
          label="Büro Nr."
          saveToDb={saveToDb}
          error={errors.bueroNr}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}amt`}
          value={person.amt}
          field="amt"
          label="Amt"
          options={amtOptions}
          saveToDb={saveToDb}
          error={errors.amt}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}abteilung`}
          value={person.abteilung}
          field="abteilung"
          label="Abteilung"
          options={abteilungOptions}
          saveToDb={saveToDb}
          error={errors.abteilung}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}sektion`}
          value={person.sektion}
          field="sektion"
          label="Sektion"
          options={sektionOptions}
          saveToDb={saveToDb}
          error={errors.sektion}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}bereich`}
          value={person.bereich}
          field="bereich"
          label="Bereich"
          options={bereichOptions}
          saveToDb={saveToDb}
          error={errors.bereich}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}vorgesetztId`}
          value={person.vorgesetztId}
          field="vorgesetztId"
          label="Vorgesetzte(r)"
          options={personOptions}
          saveToDb={saveToDb}
          error={errors.vorgesetztId}
        />
        <Date
          key={`${personId}${existsFilter ? 1 : 0}eintrittDatum`}
          value={person.eintrittDatum}
          field="eintrittDatum"
          label="Eintritt Datum"
          saveToDb={saveToDb}
          error={errors.eintrittDatum}
        />
        <Date
          key={`${personId}${existsFilter ? 1 : 0}austrittDatum`}
          value={person.austrittDatum}
          field="austrittDatum"
          label="Austritt Datum"
          saveToDb={saveToDb}
          error={errors.austrittDatum}
        />
        <Select
          key={`${personId}${existsFilter ? 1 : 0}status`}
          value={person.status}
          field="status"
          label="Status"
          options={statusOptions}
          saveToDb={saveToDb}
          error={errors.status}
        />
        <Input
          key={`${personId}beschaeftigungsgrad`}
          value={person.beschaeftigungsgrad}
          field="beschaeftigungsgrad"
          label="Beschaeftigungsgrad (%)"
          saveToDb={saveToDb}
          type="number"
          error={errors.beschaeftigungsgrad}
        />
        <Input
          key={`${personId}parkplatzNr`}
          value={person.parkplatzNr}
          field="parkplatzNr"
          label="Parkplatz Nr."
          saveToDb={saveToDb}
          error={errors.parkplatzNr}
        />
        {showFilter ? (
          <Select
            key={`${personId}${existsFilter ? 1 : 0}funktion`}
            value={filterFunktion.funktion}
            field="funktion"
            label="Funktion"
            options={funktionenOptions}
            saveToDb={saveToDbFunktion}
            error={errors.funktion}
          />
        ) : (
          <SelectMulti
            key={`${personId}${existsFilter ? 1 : 0}funktion`}
            value={myFunktionen}
            field="funktion"
            label="Funktionen"
            options={funktionenOptions}
            add={addFunktion}
            remove={deleteFunktion}
            error={errors.funktion}
          />
        )}
        {showFilter ? (
          <Select
            key={`${personId}${existsFilter ? 1 : 0}etikett`}
            value={filterEtikett.etikett}
            field="etikett"
            label="Etikett"
            options={etikettenOptions}
            saveToDb={saveToDbEtikett}
            error={errors.etikett}
          />
        ) : (
          <SelectMulti
            key={`${personId}${existsFilter ? 1 : 0}etikett`}
            value={myEtiketten}
            field="etikett"
            label="Etiketten"
            options={etikettenOptions}
            add={addEtikett}
            remove={deleteEtikett}
            error={errors.etikett}
          />
        )}
        <Input
          key={`${personId}bemerkungen`}
          value={person.bemerkungen}
          field="bemerkungen"
          label="Bemerkungen"
          saveToDb={saveToDb}
          type="textarea"
          error={errors.bemerkungen}
        />
        {!showFilter && <Links />}
        <Schluessels />
        <MobileAbos />
        <Telefones />
        {showMutationNoetig && (
          <SharedCheckbox
            key={`${personId}mutationNoetig`}
            value={person.mutationNoetig}
            field="mutationNoetig"
            label="Handlungsbedarf"
            saveToDb={saveToDb}
            error={errors.mutationNoetig}
          />
        )}
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default observer(Person)
