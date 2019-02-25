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
import sortBy from 'lodash/sortBy'

import Input from '../../shared/Input'
import Select from '../../shared/Select'
import SharedCheckbox from '../../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import Zuletzt from './Zuletzt'
import storeContext from '../../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Abteilung = ({ activeId }) => {
  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    abteilungen,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    standortWerte,
    showFilter,
    filterAbteilung,
    existsFilter,
    setFilter,
    updateField,
  } = store

  let abteilung
  if (showFilter) {
    abteilung = filterAbteilung
  } else {
    abteilung = abteilungen.find(p => p.id === activeId)
    if (!abteilung) abteilung = {}
  }
  const abteilungId = showFilter ? '' : abteilung.id

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [abteilung])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!abteilung && !showFilter)
        throw new Error(`Abteilung with id ${activeId} not found`)
      const newValue = ifIsNumericAsNumber(value)

      if (showFilter) {
        setFilter({
          model: 'filterAbteilung',
          value: { ...filterAbteilung, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'abteilungen',
          parentModel: 'abteilungen',
          field,
          value: newValue,
          id: abteilung.id,
          setErrors,
        })
      }
    },
    [activeId, abteilungen.length, filterAbteilung, showFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== abteilung.leiter)
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
  const kostenstelleOptions = useMemo(() =>
    sortBy(kostenstelleWerte, ['sort', 'value'])
      .filter(w => !!w.value)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )
  const standortOptions = useMemo(() =>
    sortBy(standortWerte, ['sort', 'value'])
      .filter(p => p.deleted === 0)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )

  if (!showFilter && !activeId) return null

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${abteilungId}deleted`}
            value={abteilung.deleted}
            field="deleted"
            label="Gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        <Input
          key={`${abteilungId}name`}
          value={abteilung.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
          error={errors.name}
        />
        <Select
          key={`${abteilungId}${existsFilter ? 1 : 0}amt`}
          value={abteilung.amt}
          field="amt"
          label="Amt"
          options={amtOptions}
          saveToDb={saveToDb}
          error={errors.amt}
        />
        <Input
          key={`${abteilungId}kurzzeichen`}
          value={abteilung.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
          error={errors.kurzzeichen}
        />
        <Input
          key={`${abteilungId}telefonNr`}
          value={abteilung.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
          error={errors.telefonNr}
        />
        <Input
          key={`${abteilungId}email`}
          value={abteilung.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
          error={errors.email}
        />
        <Select
          key={`${abteilungId}${existsFilter ? 1 : 0}standort`}
          value={abteilung.standort}
          field="standort"
          label="Standort"
          options={standortOptions}
          saveToDb={saveToDb}
          error={errors.standort}
        />
        <Select
          key={`${abteilungId}${existsFilter ? 1 : 0}leiter`}
          value={abteilung.leiter}
          field="leiter"
          label="Leiter"
          options={personOptions}
          saveToDb={saveToDb}
          error={errors.leiter}
        />
        <Select
          key={`${abteilungId}${existsFilter ? 1 : 0}kostenstelle`}
          value={abteilung.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={kostenstelleOptions}
          saveToDb={saveToDb}
          error={errors.kostenstelle}
        />
        {showMutationNoetig && (
          <SharedCheckbox
            key={`${abteilungId}mutationNoetig`}
            value={abteilung.mutationNoetig}
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

export default observer(Abteilung)
