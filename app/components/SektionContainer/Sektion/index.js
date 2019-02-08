import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'

import Input from '../../shared/Input'
import Select from '../../shared/Select'
import SharedCheckbox from '../../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import isDateField from '../../../src/isDateField'
import Zuletzt from './Zuletzt'
import storeContext from '../../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Sektion = ({ activeId }) => {
  const store = useContext(storeContext)
  const {
    personen,
    abteilungen,
    sektionen,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    showFilter,
    filterSektion,
    existsFilter,
    setFilter,
    updateField,
  } = store

  let sektion
  if (showFilter) {
    sektion = filterSektion
  } else {
    sektion = sektionen.find(p => p.id === activeId)
    if (!sektion) sektion = {}
  }
  const sektionId = showFilter ? '' : sektion.id

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [sektion])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!sektion && !showFilter)
        throw new Error(`Sektion with id ${activeId} not found`)
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
          model: 'filterSektion',
          value: { ...filterSektion, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'sektionen',
          parentModel: 'sektionen',
          field,
          value: newValue,
          id: sektion.id,
          setErrors,
        })
      }
    },
    [activeId, sektionen.length, filterSektion, showFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== sektion.leiter)
        .map(w => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [personen.length],
  )
  const kostenstelleOptions = useMemo(() =>
    sortBy(kostenstelleWerte, ['sort', 'value'])
      .filter(w => !!w.value)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
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

  if (!showFilter && !activeId) return null

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${sektionId}deleted`}
            value={sektion.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        <Input
          key={`${sektionId}name`}
          value={sektion.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
          error={errors.name}
        />
        <Select
          key={`${sektionId}${existsFilter ? 1 : 0}abteilung`}
          value={sektion.abteilung}
          field="abteilung"
          label="Abteilung"
          options={abteilungOptions}
          saveToDb={saveToDb}
          error={errors.abteilung}
        />
        <Input
          key={`${sektionId}kurzzeichen`}
          value={sektion.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
          error={errors.kurzzeichen}
        />
        <Input
          key={`${sektionId}telefonNr`}
          value={sektion.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
          error={errors.telefonNr}
        />
        <Input
          key={`${sektionId}email`}
          value={sektion.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
          error={errors.email}
        />
        <Input
          key={`${sektionId}standort`}
          value={sektion.standort}
          field="standort"
          label="Standort"
          saveToDb={saveToDb}
          error={errors.standort}
        />
        <Select
          key={`${sektionId}${existsFilter ? 1 : 0}leiter`}
          value={sektion.leiter}
          field="leiter"
          label="Leiter"
          options={personOptions}
          saveToDb={saveToDb}
          error={errors.leiter}
        />
        <Select
          key={`${sektionId}${existsFilter ? 1 : 0}kostenstelle`}
          value={sektion.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={kostenstelleOptions}
          saveToDb={saveToDb}
          error={errors.kostenstelle}
        />
        {showMutationNoetig && (
          <SharedCheckbox
            key={`${sektionId}mutationNoetig`}
            value={sektion.mutationNoetig}
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

export default observer(Sektion)
