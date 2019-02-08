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

const Bereich = ({ activeId }) => {
  const store = useContext(storeContext)
  const {
    personen,
    abteilungen,
    sektionen,
    aemter,
    bereiche,
    showDeleted,
    kostenstelleWerte,
    showFilter,
    filterBereich,
    existsFilter,
    setFilter,
    updateField,
  } = store

  let bereich
  if (showFilter) {
    bereich = filterBereich
  } else {
    bereich = bereiche.find(p => p.id === activeId)
    if (!bereich) bereich = {}
  }
  const bereichId = showFilter ? '' : bereich.id

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [bereich])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!bereich && !showFilter)
        throw new Error(`Bereich with id ${activeId} not found`)
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
          model: 'filterBereich',
          value: { ...filterBereich, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'bereiche',
          parentModel: 'bereiche',
          field,
          value: newValue,
          id: bereich.id,
          setErrors,
        })
      }
    },
    [activeId, bereiche.length, filterBereich, showFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== bereich.leiter)
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
  const sektionOptions = useMemo(
    () =>
      sortBy(sektionen, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [sektionen.length],
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

  if (!showFilter && !activeId) return null

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${bereichId}deleted`}
            value={bereich.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        <Input
          key={`${bereichId}name`}
          value={bereich.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
          error={errors.name}
        />
        <Select
          key={`${bereichId}${existsFilter ? 1 : 0}amt`}
          value={bereich.amt}
          field="amt"
          label="Amt"
          options={amtOptions}
          saveToDb={saveToDb}
          error={errors.amt}
        />
        <Select
          key={`${bereichId}${existsFilter ? 1 : 0}sektion`}
          value={bereich.sektion}
          field="sektion"
          label="Sektion"
          options={sektionOptions}
          saveToDb={saveToDb}
          error={errors.sektion}
        />
        <Select
          key={`${bereichId}${existsFilter ? 1 : 0}abteilung`}
          value={bereich.abteilung}
          field="abteilung"
          label="Abteilung"
          options={abteilungOptions}
          saveToDb={saveToDb}
          error={errors.abteilung}
        />
        <Input
          key={`${bereichId}kurzzeichen`}
          value={bereich.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
          error={errors.kurzzeichen}
        />
        <Input
          key={`${bereichId}telefonNr`}
          value={bereich.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
          error={errors.telefonNr}
        />
        <Input
          key={`${bereichId}email`}
          value={bereich.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
          error={errors.email}
        />
        <Input
          key={`${bereichId}standort`}
          value={bereich.standort}
          field="standort"
          label="Standort"
          saveToDb={saveToDb}
          error={errors.standort}
        />
        <Select
          key={`${bereichId}${existsFilter ? 1 : 0}leiter`}
          value={bereich.leiter}
          field="leiter"
          label="Leiter"
          options={personOptions}
          saveToDb={saveToDb}
          error={errors.leiter}
        />
        <Select
          key={`${bereichId}${existsFilter ? 1 : 0}kostenstelle`}
          value={bereich.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={kostenstelleOptions}
          saveToDb={saveToDb}
          error={errors.kostenstelle}
        />
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default observer(Bereich)
